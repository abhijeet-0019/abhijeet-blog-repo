"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Github, Linkedin, Phone, Send, CheckCircle } from "lucide-react";
import siteConfig from "@/data/site-config.json";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show success message
    // TODO: Connect to backend API or email service
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    
    // Reset after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
        Get in Touch
      </h1>
      <p className="text-[var(--muted)] mb-12">
        Have a question or want to work together? Feel free to reach out.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Send a Message
          </h2>

          {submitted ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg">
              <CheckCircle size={20} />
              <span>Thanks for your message! I&apos;ll get back to you soon.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[var(--foreground)] mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--foreground)] mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-white"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[var(--foreground)] mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent bg-white resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Other Ways to Connect
          </h2>

          <div className="space-y-4">
            <Link
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-3 p-4 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:bg-opacity-10 transition-colors">
                <Mail size={20} className="text-[var(--muted)] group-hover:text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Email</p>
                <p className="text-[var(--foreground)]">{siteConfig.email}</p>
              </div>
            </Link>

            {siteConfig.phone && (
              <Link
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-3 p-4 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:bg-opacity-10 transition-colors">
                  <Phone size={20} className="text-[var(--muted)] group-hover:text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)]">Phone</p>
                  <p className="text-[var(--foreground)]">{siteConfig.phone}</p>
                </div>
              </Link>
            )}

            {siteConfig.social.github && (
              <Link
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:bg-opacity-10 transition-colors">
                  <Github size={20} className="text-[var(--muted)] group-hover:text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)]">GitHub</p>
                  <p className="text-[var(--foreground)]">@abhijeet-0019</p>
                </div>
              </Link>
            )}

            {siteConfig.social.linkedin && (
              <Link
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:bg-opacity-10 transition-colors">
                  <Linkedin size={20} className="text-[var(--muted)] group-hover:text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)]">LinkedIn</p>
                  <p className="text-[var(--foreground)]">Abhijeet Singh Rajpurohit</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
