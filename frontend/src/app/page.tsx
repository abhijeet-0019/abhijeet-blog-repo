import Link from "next/link";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import siteConfig from "@/data/site-config.json";
import categories from "@/data/categories.json";
import { getPosts } from "@/lib/api";

export default async function Home() {
  const posts = await getPosts();
  const latestPosts = posts.slice(0, 3);

  const getCategoryLabel = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.label || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.color || "#6B7280";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full">
        {/* Hero Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-3">
            {siteConfig.name}
          </h1>
          <p className="text-lg text-[var(--muted)]">
            {siteConfig.title}
          </p>
        </header>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6 mb-12 text-base">
          <Link 
            href="/blog" 
            className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
          >
            Blog
          </Link>
          <Link 
            href="/about" 
            className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
          >
            About
          </Link>
          <Link 
            href="/resume" 
            className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
          >
            Resume
          </Link>
          <Link 
            href="/contact" 
            className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Divider */}
        <hr className="border-[var(--border)] mb-12" />

        {/* Latest Posts */}
        <section>
          <h2 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-6">
            Latest from the blog
          </h2>
          <ul className="space-y-4">
            {latestPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.id}`}
                  className="group flex items-center gap-3"
                >
                  <ArrowRight 
                    size={16} 
                    className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors flex-shrink-0" 
                  />
                  <span className="text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                    {post.title}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full ml-auto flex-shrink-0"
                    style={{ 
                      backgroundColor: `${getCategoryColor(post.category)}20`,
                      color: getCategoryColor(post.category)
                    }}
                  >
                    {getCategoryLabel(post.category)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 mt-8 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            View all posts <ArrowRight size={14} />
          </Link>
        </section>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-16">
          {siteConfig.social.github && (
            <Link
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              aria-label="GitHub"
            >
              <Github size={22} />
            </Link>
          )}
          {siteConfig.social.linkedin && (
            <Link
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={22} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
