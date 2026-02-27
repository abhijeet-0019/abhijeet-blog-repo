import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import siteConfig from "@/data/site-config.json";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] mt-16">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--muted)] text-sm">
            © {currentYear} {siteConfig.displayName}. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            {siteConfig.social.github && (
              <Link
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
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
                <Linkedin size={20} />
              </Link>
            )}
            {siteConfig.social.twitter && (
              <Link
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </Link>
            )}
            <Link
              href={`mailto:${siteConfig.email}`}
              className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
