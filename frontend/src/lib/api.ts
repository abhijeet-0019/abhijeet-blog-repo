import { BlogPost } from "@/types";

// For now, use mock data. Later, connect to your DynamoDB backend API.
const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Building Serverless APIs with AWS CDK",
    author: "Abhijeet",
    date: "2026-02-20",
    category: "tech",
    summary: "Learn how to build scalable serverless APIs using AWS CDK, Lambda, and API Gateway.",
    content: `
# Building Serverless APIs with AWS CDK

AWS Cloud Development Kit (CDK) is a powerful tool for defining cloud infrastructure using familiar programming languages. In this post, we'll explore how to build a serverless API from scratch.

## Why CDK?

Instead of writing JSON or YAML templates, CDK lets you use TypeScript, Python, or other languages to define your infrastructure. This means:

- Type safety and IDE support
- Reusable constructs
- Easier testing

## Getting Started

First, install the CDK CLI:

\`\`\`bash
npm install -g aws-cdk
\`\`\`

Then create a new project:

\`\`\`bash
cdk init app --language typescript
\`\`\`

## Creating a Lambda Function

Here's how to define a simple Lambda function:

\`\`\`typescript
const handler = new lambda.Function(this, 'MyHandler', {
  runtime: lambda.Runtime.NODEJS_18_X,
  code: lambda.Code.fromAsset('lambda'),
  handler: 'index.handler',
});
\`\`\`

## Adding API Gateway

Connect your Lambda to an HTTP API:

\`\`\`typescript
const api = new apigatewayv2.HttpApi(this, 'MyApi');
api.addRoutes({
  path: '/hello',
  methods: [HttpMethod.GET],
  integration: new HttpLambdaIntegration('HelloIntegration', handler),
});
\`\`\`

## Conclusion

CDK makes it incredibly easy to build and deploy serverless infrastructure. Give it a try!
    `.trim(),
  },
  {
    id: "2",
    title: "Weekend Cricket Thoughts",
    author: "Abhijeet",
    date: "2026-02-15",
    category: "sports",
    summary: "Reflections on the weekend cricket match and what makes the sport so captivating.",
    content: `
# Weekend Cricket Thoughts

There's something magical about weekend cricket. The anticipation, the strategy, the unexpected turns...

## The Beauty of Test Cricket

In an age of T20s and instant gratification, Test cricket remains a thinking person's game. It teaches patience, strategy, and the value of building something gradually.

## Key Takeaways

- Patience is a virtue
- Every ball is an opportunity
- The game rewards perseverance

What are your thoughts on cricket?
    `.trim(),
  },
  {
    id: "3",
    title: "My Journey into Cloud Computing",
    author: "Abhijeet",
    date: "2026-02-10",
    category: "tech",
    summary: "How I transitioned from traditional backend development to cloud-native architecture.",
    content: `
# My Journey into Cloud Computing

Three years ago, I was a traditional backend developer. Today, I can't imagine building applications without the cloud.

## The Turning Point

It started with a simple question: "Why are we managing servers when we could be building features?"

## What I've Learned

1. **Start small** - Don't try to learn everything at once
2. **Build projects** - Theory only goes so far
3. **Get certified** - It structures your learning
4. **Share knowledge** - Teaching reinforces learning

## AWS Services I Use Daily

- Lambda for compute
- DynamoDB for data
- API Gateway for APIs
- CDK for infrastructure

The cloud journey never ends, but that's what makes it exciting!
    `.trim(),
  },
];

export async function getPosts(): Promise<BlogPost[]> {
  // TODO: Replace with actual API call when backend is ready
  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
  // const data = await response.json();
  // return data.items;
  
  return MOCK_POSTS;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  // TODO: Replace with actual API call
  const posts = await getPosts();
  return posts.find(post => post.id === id) || null;
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getPosts();
  if (category === "all") return posts;
  return posts.filter(post => post.category === category);
}
