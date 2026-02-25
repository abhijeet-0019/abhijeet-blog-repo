"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import categories from "@/data/categories.json";
import { BlogPost, Category } from "@/types";
import { getPosts } from "@/lib/api";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const data = await getPosts();
      setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, []);

  const filteredPosts = activeCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const getCategoryColor = (categoryId: string) => {
    const cat = categories.find((c: Category) => c.id === categoryId);
    return cat?.color || "#6B7280";
  };

  const getCategoryLabel = (categoryId: string) => {
    const cat = categories.find((c: Category) => c.id === categoryId);
    return cat?.label || categoryId;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back to home
      </Link>

      {/* Header */}
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Blog</h1>
      <p className="text-[var(--muted)] mb-8">
        Thoughts on tech, sports, and everything in between.
      </p>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-10 border-b border-[var(--border)] pb-4">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeCategory === "all"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          All
        </button>
        {categories.map((cat: Category) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeCategory === cat.id
                ? "text-white"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
            style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-[var(--muted)]">Loading...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-[var(--muted)]">No posts found in this category.</div>
      ) : (
        <ul className="space-y-6">
          {filteredPosts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.id}`} className="group block">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <span className="text-sm text-[var(--muted)] flex-shrink-0 w-28">
                    {formatDate(post.date)}
                  </span>
                  <span className="text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors font-medium">
                    {post.title}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full ml-auto flex-shrink-0 hidden sm:inline"
                    style={{
                      backgroundColor: `${getCategoryColor(post.category)}20`,
                      color: getCategoryColor(post.category),
                    }}
                  >
                    {getCategoryLabel(post.category)}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted)] mt-1 sm:ml-32">
                  {post.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
