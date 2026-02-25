import { BlogPost } from "@/types";

// Get API URL from environment variable
// Set this in .env.local: NEXT_PUBLIC_API_URL=https://your-api-gateway-url.amazonaws.com
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interface for DynamoDB item structure
interface DynamoDBItem {
  PK: string;
  SK: string;
  title?: string;
  author?: string;
  date?: string;
  category?: string;
  summary?: string;
  content?: string;
}

/**
 * Fetch all blog posts from the backend API
 */
export async function getPosts(): Promise<BlogPost[]> {
  console.log("🔍 API_URL:", API_URL); // Debug log
  
  if (!API_URL) {
    console.warn("⚠️ API_URL not configured. Please set NEXT_PUBLIC_API_URL in .env.local");
    return [];
  }

  try {
    console.log("📡 Fetching posts from:", `${API_URL}/posts`); // Debug log
    const response = await fetch(`${API_URL}/posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ API Response received:", data); // Debug log
    
    // Check if response is already an array or wrapped in 'items' property
    const items: DynamoDBItem[] = Array.isArray(data) ? data : (data.items || []);
    console.log("📦 Items from DynamoDB:", items.length); // Debug log
    
    // Group items by post ID (PK) to combine metadata and content
    const postsMap = new Map<string, { metadata?: DynamoDBItem; content?: DynamoDBItem }>();
    
    items.forEach((item) => {
      const postId = item.PK.replace("POST#", "");
      
      if (!postsMap.has(postId)) {
        postsMap.set(postId, {});
      }
      
      const post = postsMap.get(postId)!;
      
      if (item.SK === "METADATA") {
        post.metadata = item;
      } else if (item.SK === "CONTENT") {
        post.content = item;
      }
    });
    
    // Transform to BlogPost format
    const posts: BlogPost[] = [];
    
    postsMap.forEach((value, postId) => {
      const { metadata, content } = value;
      
      if (metadata) {
        posts.push({
          id: postId,
          title: metadata.title || "Untitled",
          author: metadata.author || "Unknown",
          date: metadata.date || "",
          category: metadata.category || "general",
          summary: metadata.summary || "",
          content: content?.content || "",
        });
      }
    });
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log("🎉 Transformed posts:", posts.length, "posts ready");
    console.log("📝 Posts:", posts.map(p => ({ id: p.id, title: p.title }))); // Debug log
    return posts;
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return [];
  }
}

/**
 * Fetch a single blog post by ID
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  if (!API_URL) {
    console.warn("API_URL not configured. Please set NEXT_PUBLIC_API_URL in .env.local");
    return null;
  }

  try {
    // For now, fetch all posts and filter
    // TODO: Add a GET /posts/{id} endpoint to your backend for better performance
    const posts = await getPosts();
    return posts.find(post => post.id === id) || null;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return null;
  }
}

/**
 * Fetch posts by category
 */
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getPosts();
  
  if (category === "all") {
    return posts;
  }
  
  return posts.filter(post => post.category === category);
}

/**
 * Create a new blog post (for future admin panel)
 */
export async function createPost(post: Omit<BlogPost, "id">): Promise<BlogPost | null> {
  if (!API_URL) {
    console.error("API_URL not configured");
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.status}`);
    }

    const data = await response.json();
    return data.post || null;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
}
