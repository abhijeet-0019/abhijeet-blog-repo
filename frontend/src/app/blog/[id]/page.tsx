import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { getPosts, getPostById } from "@/lib/api";
import categories from "@/data/categories.json";
import { Category } from "@/types";

import "highlight.js/styles/github.css";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  const getCategoryLabel = (categoryId: string) => {
    const cat = categories.find((c: Category) => c.id === categoryId);
    return cat?.label || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    const cat = categories.find((c: Category) => c.id === categoryId);
    return cat?.color || "#6B7280";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back to blog
      </Link>

      {/* Post Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${getCategoryColor(post.category)}20`,
              color: getCategoryColor(post.category),
            }}
          >
            {getCategoryLabel(post.category)}
          </span>
          <span className="text-sm text-[var(--muted)]">
            {formatDate(post.date)}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-2">
          {post.title}
        </h1>
        <p className="text-lg text-[var(--muted)]">{post.summary}</p>
      </header>

      <hr className="border-[var(--border)] mb-8" />

      {/* Post Content */}
      <article className="markdown-content">
        {post.content ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        ) : (
          <p className="text-[var(--muted)]">Content not available.</p>
        )}
      </article>

      {/* Author */}
      <footer className="mt-12 pt-8 border-t border-[var(--border)]">
        <p className="text-sm text-[var(--muted)]">
          Written by <span className="text-[var(--foreground)]">{post.author}</span>
        </p>
      </footer>
    </div>
  );
}
        