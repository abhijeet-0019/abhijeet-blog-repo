import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getPosts, getPostById } from "@/lib/api";
import categories from "@/data/categories.json";
import { Category } from "@/types";

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

  // Simple markdown-like rendering (basic)
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactElement[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let codeLanguage = "";

    lines.forEach((line, index) => {
      // Code block handling
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
          codeContent = [];
        } else {
          elements.push(
            <pre
              key={index}
              className="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4 text-sm"
            >
              <code className={`language-${codeLanguage}`}>
                {codeContent.join("\n")}
              </code>
            </pre>
          );
          inCodeBlock = false;
          codeContent = [];
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Headings
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold mt-4 mb-2">
            {line.slice(4)}
          </h3>
        );
      }
      // List items
      else if (line.startsWith("- ")) {
        elements.push(
          <li key={index} className="ml-4 list-disc">
            {line.slice(2)}
          </li>
        );
      } else if (/^\d+\.\s/.test(line)) {
        const text = line.replace(/^\d+\.\s/, "");
        elements.push(
          <li key={index} className="ml-4 list-decimal">
            {renderInlineFormatting(text)}
          </li>
        );
      }
      // Empty lines
      else if (line.trim() === "") {
        elements.push(<br key={index} />);
      }
      // Regular paragraphs
      else {
        elements.push(
          <p key={index} className="my-2">
            {renderInlineFormatting(line)}
          </p>
        );
      }
    });

    return elements;
  };

  const renderInlineFormatting = (text: string) => {
    // Handle inline code
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
            {part.slice(1, -1)}
          </code>
        );
      }
      // Handle bold
      if (part.includes("**")) {
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return boldParts.map((bp, j) => {
          if (bp.startsWith("**") && bp.endsWith("**")) {
            return <strong key={`${i}-${j}`}>{bp.slice(2, -2)}</strong>;
          }
          return bp;
        });
      }
      return part;
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
      <article className="prose-blog text-[var(--foreground)]">
        {post.content ? renderContent(post.content) : (
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
