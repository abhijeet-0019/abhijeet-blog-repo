# API Integration Setup

## Quick Start

### 1. Deploy Your Backend

First, make sure your backend is deployed:

```bash
cd backend
cdk deploy
```

After deployment, you'll see output like:
```
AbhijeetBlogStack.ApiUrl = https://abc123xyz.execute-api.us-east-1.amazonaws.com
```

### 2. Configure Frontend API URL

Create `.env.local` in the frontend directory:

```bash
cd frontend
cp .env.local.example .env.local
```

Edit `.env.local` and add your API URL:

```env
NEXT_PUBLIC_API_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com
```

**Important:** No trailing slash!

### 3. Test Locally

```bash
npm run dev
```

Open http://localhost:3000 - your frontend should now fetch data from the backend API.

### 4. Rebuild for Production

```bash
npm run build
```

The build will include your API URL in the static files.

---

## How It Works

### Data Flow

```
Browser → API Call → API Gateway → Lambda → DynamoDB
                                              ↓
Browser ← Response ← API Gateway ← Lambda ← Query Result
```

### API Functions

The [api.ts](src/lib/api.ts) file now includes:

#### `getPosts()`
Fetches all blog posts from `/posts` endpoint and transforms DynamoDB format:

```typescript
// DynamoDB structure:
{
  items: [
    { PK: "POST#1", SK: "METADATA", title: "...", author: "...", ... },
    { PK: "POST#1", SK: "CONTENT", content: "..." },
    { PK: "POST#2", SK: "METADATA", title: "...", ... },
    { PK: "POST#2", SK: "CONTENT", content: "..." }
  ]
}

// Transformed to:
[
  { id: "1", title: "...", content: "...", ... },
  { id: "2", title: "...", content: "...", ... }
]
```

#### `getPostById(id)`
Fetches a specific post by ID (currently filters from all posts).

#### `getPostsByCategory(category)`
Filters posts by category.

#### `createPost(post)` 
Creates a new post via POST to `/posts` (for future admin panel).

---

## Testing the Integration

### 1. Add a Test Post

Use your backend's POST endpoint:

```bash
curl -X POST https://YOUR-API-URL/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Real Post",
    "author": "Abhijeet",
    "date": "2026-02-25",
    "category": "tech",
    "summary": "Testing the API integration",
    "content": "# Hello\n\nThis is my first post from the API!"
  }'
```

### 2. Verify in Frontend

Refresh your browser - the new post should appear!

### 3. Check Browser Console

Open DevTools (F12) → Console tab. You should see:
- ✅ Successful API calls (no errors)
- Network tab shows requests to your API Gateway

---

## Troubleshooting

### Issue: "API_URL not configured"

**Problem:** Console shows warning about missing API URL

**Solution:** 
1. Create `.env.local` file
2. Add `NEXT_PUBLIC_API_URL=https://your-api-url`
3. Restart dev server: `npm run dev`

### Issue: CORS Error

**Problem:** Browser console shows CORS error

**Solution:** Your backend already has CORS enabled for `*`. For specific origins:

```python
# In backend/infrastructure/blog_stack.py
allow_origins=["https://yourdomain.com"]
```

### Issue: Empty Posts Array

**Problem:** No posts showing up

**Possible causes:**
1. DynamoDB table is empty → Add posts via POST endpoint
2. Wrong API URL → Check `.env.local`
3. API not deployed → Run `cdk deploy` in backend

**Debug:**
1. Open browser DevTools → Network tab
2. Look for request to `/posts`
3. Check response data

### Issue: Build Fails with API Error

**Problem:** Build fails when API is unreachable

During static export build, if the API is called at build time and fails, the build might error out. Since we're using client-side fetching, this shouldn't happen, but if it does:

**Solution:** The API functions now have error handling that returns empty arrays on failure, so builds will succeed even if API is down.

---

## Production Deployment

### Environment Variables for S3

When deploying to S3, the `.env.local` file won't be included. The `NEXT_PUBLIC_*` variables are embedded in the built JavaScript during `npm run build`.

**Workflow:**
1. Set `NEXT_PUBLIC_API_URL` in `.env.local`
2. Run `npm run build`
3. The API URL is now hardcoded in `out/_next/static/.../*.js`
4. Upload `out/` to S3

**For different environments:**

```bash
# Development
NEXT_PUBLIC_API_URL=https://dev-api.example.com npm run build

# Production
NEXT_PUBLIC_API_URL=https://api.example.com npm run build
```

---

## Backend Updates Needed

### Optional: Add Single Post Endpoint

For better performance, add this to your backend:

```python
# In backend/runtime/posts_handler.py
def handler(event, context):
    path = event.get('rawPath', '')
    method = event['requestContext']['http']['method']
    
    # Existing endpoints...
    
    # New: GET /posts/{id}
    if method == 'GET' and path.startswith('/posts/'):
        post_id = path.split('/')[-1]
        return get_post_by_id(post_id)

def get_post_by_id(post_id):
    response = table.query(
        KeyConditionExpression='PK = :pk',
        ExpressionAttributeValues={
            ':pk': f'POST#{post_id}'
        }
    )
    # Return combined metadata + content
```

Then update `getPostById()` in frontend to use this endpoint.

---

## Next Steps

1. ✅ Set up `.env.local` with your API URL
2. ✅ Test locally with `npm run dev`
3. ✅ Add some blog posts via POST endpoint
4. ✅ Verify they appear in frontend
5. Build and deploy to S3 when ready
