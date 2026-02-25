# S3 Static Hosting - Deployment Guide

## ✅ Confirmation: Your Frontend IS S3-Compatible!

### What Changed to Make It S3-Ready

1. **Added `output: 'export'`** to `next.config.ts` - generates static HTML files
2. **Converted homepage** to client-side (`"use client"`) - fetches data in browser
3. **Blog posts** use Static Site Generation (SSG) - pre-rendered at build time
4. **All pages** are now pure static HTML

### Build Output

After running `npm run build`, you get an `/out` folder with:
```
out/
├── index.html              → Homepage
├── about.html              → About page
├── resume.html             → Resume page
├── contact.html            → Contact page
├── blog.html               → Blog listing
├── blog/
│   ├── 1.html              → Blog post 1 (pre-rendered)
│   ├── 2.html              → Blog post 2 (pre-rendered)
│   └── 3.html              → Blog post 3 (pre-rendered)
└── _next/
    └── static/             → CSS, JS, fonts
```

**This entire `/out` folder can be uploaded directly to S3!**

---

## Deployment Steps

### Option 1: Manual S3 Upload

1. **Build the static site:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create an S3 bucket:**
   - Name: `abhijeet-blog-website`
   - Enable "Static website hosting"
   - Set index document: `index.html`
   - Set error document: `404.html`

3. **Configure bucket policy (public access):**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::abhijeet-blog-website/*"
       }
     ]
   }
   ```

4. **Upload the `/out` folder:**
   ```bash
   aws s3 sync out/ s3://abhijeet-blog-website/ --delete
   ```

5. **Access your site:**
   ```
   http://abhijeet-blog-website.s3-website-us-east-1.amazonaws.com
   ```

### Option 2: S3 + CloudFront (Recommended)

**Why CloudFront?**
- HTTPS support (S3 website hosting doesn't support SSL)
- Custom domain (e.g., `blog.abhijeet.com`)
- Edge caching (faster global access)
- Better security

**Steps:**
1. Upload to S3 (as above)
2. Create CloudFront distribution pointing to S3
3. Set up Route 53 for custom domain
4. Add SSL certificate from ACM

### Option 3: AWS CDK Automation

Add to your existing CDK stack:

```python
from aws_cdk import (
    aws_s3 as s3,
    aws_s3_deployment as s3_deployment,
    aws_cloudfront as cloudfront,
    RemovalPolicy,
)

# S3 bucket for frontend
frontend_bucket = s3.Bucket(
    self, "FrontendBucket",
    website_index_document="index.html",
    website_error_document="404.html",
    public_read_access=True,
    block_public_access=s3.BlockPublicAccess(
        block_public_acls=False,
        block_public_policy=False,
        ignore_public_acls=False,
        restrict_public_buckets=False,
    ),
    removal_policy=RemovalPolicy.DESTROY,
    auto_delete_objects=True,
)

# Deploy frontend files
s3_deployment.BucketDeployment(
    self, "DeployFrontend",
    sources=[s3_deployment.Source.asset("../frontend/out")],
    destination_bucket=frontend_bucket,
)

# CloudFront distribution (optional but recommended)
distribution = cloudfront.CloudFrontWebDistribution(
    self, "FrontendDistribution",
    origin_configs=[
        cloudfront.SourceConfiguration(
            s3_origin_source=cloudfront.S3OriginConfig(
                s3_bucket_source=frontend_bucket
            ),
            behaviors=[cloudfront.Behavior(is_default_behavior=True)]
        )
    ]
)
```

---

## Connecting to Your Backend API

### Step 1: Get Your API Gateway URL

After deploying your backend CDK stack:
```bash
cd backend
cdk deploy
```

Output will show:
```
AbhijeetBlogStack.ApiUrl = https://abc123.execute-api.us-east-1.amazonaws.com
```

### Step 2: Create Environment Variable

Create `.env.local` in `/frontend`:
```env
NEXT_PUBLIC_API_URL=https://abc123.execute-api.us-east-1.amazonaws.com
```

### Step 3: Update API Functions

In `src/lib/api.ts`, uncomment the API calls:

```typescript
export async function getPosts(): Promise<BlogPost[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
  const data = await response.json();
  
  // Transform DynamoDB response to BlogPost format
  const posts = data.items || [];
  return posts.map((item: any) => ({
    id: item.PK.replace('POST#', ''),
    title: item.title,
    author: item.author,
    date: item.date,
    category: item.category,
    summary: item.summary,
    content: item.content, // You'll need to fetch content separately
  }));
}
```

### Step 4: Rebuild and Redeploy

```bash
npm run build
aws s3 sync out/ s3://abhijeet-blog-website/ --delete
```

---

## Key Concepts: S3 vs Server Hosting

| Feature | S3 Static | Server (EC2/Lambda) |
|---------|-----------|---------------------|
| **Server-side rendering per request** | ❌ No | ✅ Yes |
| **API routes in Next.js** | ❌ No | ✅ Yes |
| **Static HTML files** | ✅ Yes | ✅ Yes |
| **Client-side JavaScript** | ✅ Yes | ✅ Yes |
| **Cost** | Very low | Higher |
| **Scalability** | Automatic | Needs config |
| **Build-time data fetching** | ✅ Yes | ✅ Yes |
| **Runtime data fetching (client-side)** | ✅ Yes | ✅ Yes |

### What You Built Uses:

✅ **Build-time rendering** - Pages generated once during build  
✅ **Client-side data fetching** - Browser fetches from API Gateway  
✅ **Static file hosting** - S3 serves HTML/CSS/JS  

This is the **perfect architecture** for S3 hosting!

---

## Testing Locally

Serve the static export locally to test:

```bash
# Install a simple HTTP server
npm install -g serve

# Serve the out directory
cd frontend
serve out

# Open http://localhost:3000
```

---

## CORS Configuration

Your backend already has CORS enabled:
```python
# In backend/infrastructure/blog_stack.py
allow_origins=["*"]
```

For production, update to:
```python
allow_origins=["https://yourdomain.com"]
```

---

## Summary

1. ✅ Frontend is **fully S3-compatible**
2. ✅ Static export generates pure HTML/CSS/JS
3. ✅ Client-side fetching connects to API Gateway
4. ✅ No server needed - browser does the work
5. ✅ Cost-effective and infinitely scalable

**Your architecture:**
```
User → CloudFront/S3 (static files) → User's Browser (executes JS) → API Gateway → Lambda → DynamoDB
```

The JavaScript in the user's browser makes API calls directly to your backend!
