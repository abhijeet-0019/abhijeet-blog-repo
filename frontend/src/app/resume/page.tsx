import Link from "next/link";
import { ArrowLeft, Download, Mail, Github, Linkedin, MapPin } from "lucide-react";
import skills from "@/data/skills.json";
import experience from "@/data/experience.json";
import certifications from "@/data/certifications.json";
import siteConfig from "@/data/site-config.json";
import { Skill, Experience, Certification } from "@/types";

export default function ResumePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back to home
      </Link>

      {/* Header with Download */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            {siteConfig.name}
          </h1>
          <p className="text-lg text-[var(--accent)]">{siteConfig.title}</p>
        </div>
        
        {siteConfig.resumePdf && (
          <Link
            href={siteConfig.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            <Download size={18} />
            Download PDF
          </Link>
        )}
      </div>

      {/* Contact Info Bar */}
      <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)] mb-8 pb-8 border-b border-[var(--border)]">
        <Link
          href={`mailto:${siteConfig.email}`}
          className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
        >
          <Mail size={14} />
          {siteConfig.email}
        </Link>
        {siteConfig.social.github && (
          <Link
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
          >
            <Github size={14} />
            GitHub
          </Link>
        )}
        {siteConfig.social.linkedin && (
          <Link
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
          >
            <Linkedin size={14} />
            LinkedIn
          </Link>
        )}
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          Remote
        </span>
      </div>

      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3 uppercase tracking-wider">
          Summary
        </h2>
        <p className="text-[var(--foreground)] leading-relaxed">
          {siteConfig.description}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 uppercase tracking-wider">
          Experience
        </h2>
        
        <div className="space-y-6">
          {experience.map((exp: Experience, index: number) => (
            <div key={index}>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">
                    {exp.title}
                  </h3>
                  <p className="text-[var(--accent)]">{exp.company}</p>
                </div>
                <p className="text-sm text-[var(--muted)]">
                  {exp.period}
                </p>
              </div>
              
              <p className="text-[var(--foreground)] mb-2">{exp.description}</p>
              
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="list-disc list-inside text-sm text-[var(--muted)] space-y-1">
                  {exp.highlights.map((highlight: string, hIndex: number) => (
                    <li key={hIndex}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 uppercase tracking-wider">
          Skills
        </h2>
        
        <div className="space-y-3">
          {skills.map((skillGroup: Skill, index: number) => (
            <div key={index} className="flex flex-col sm:flex-row sm:gap-4">
              <span className="text-sm font-medium text-[var(--muted)] sm:w-40 flex-shrink-0">
                {skillGroup.category}:
              </span>
              <span className="text-[var(--foreground)]">
                {skillGroup.items.join(", ")}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 uppercase tracking-wider">
          Certifications
        </h2>
        
        <div className="space-y-2">
          {certifications.map((cert: Certification, index: number) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <span className="text-[var(--foreground)] font-medium">
                {cert.name}
              </span>
              <span className="text-sm text-[var(--muted)]">
                {cert.issuer}, {cert.date}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Print-friendly notice */}
      <div className="mt-12 pt-8 border-t border-[var(--border)] text-center text-sm text-[var(--muted)]">
        <p>This page is print-friendly. Use Ctrl+P / Cmd+P to print or save as PDF.</p>
      </div>
    </div>
  );
}
