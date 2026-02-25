import Link from "next/link";
import { ArrowLeft, Award, Briefcase } from "lucide-react";
import skills from "@/data/skills.json";
import experience from "@/data/experience.json";
import certifications from "@/data/certifications.json";
import siteConfig from "@/data/site-config.json";
import { Skill, Experience, Certification } from "@/types";

export default function AboutPage() {
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
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">About Me</h1>
      <p className="text-[var(--muted)] mb-12">
        {siteConfig.description}
      </p>

      {/* Skills Section */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-[var(--accent)] bg-opacity-10 rounded-lg flex items-center justify-center">
            <Award size={18} className="text-[var(--accent)]" />
          </span>
          Skills & Technologies
        </h2>
        
        <div className="grid gap-6">
          {skills.map((skillGroup: Skill, index: number) => (
            <div key={index}>
              <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
                {skillGroup.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((skill: string, skillIndex: number) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1.5 bg-gray-100 text-[var(--foreground)] text-sm rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-[var(--accent)] bg-opacity-10 rounded-lg flex items-center justify-center">
            <Briefcase size={18} className="text-[var(--accent)]" />
          </span>
          Experience
        </h2>

        <div className="space-y-8">
          {experience.map((exp: Experience, index: number) => (
            <div key={index} className="relative pl-6 border-l-2 border-[var(--border)]">
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[var(--accent)] rounded-full" />
              
              <div className="mb-1">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {exp.title}
                </h3>
                <p className="text-[var(--accent)]">{exp.company}</p>
              </div>
              
              <p className="text-sm text-[var(--muted)] mb-3">
                {exp.period} • {exp.location}
              </p>
              
              <p className="text-[var(--foreground)] mb-3">{exp.description}</p>
              
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

      {/* Certifications Section */}
      <section>
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-[var(--accent)] bg-opacity-10 rounded-lg flex items-center justify-center">
            <Award size={18} className="text-[var(--accent)]" />
          </span>
          Certifications
        </h2>

        <div className="grid gap-4">
          {certifications.map((cert: Certification, index: number) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border border-[var(--border)] rounded-lg"
            >
              <div className="flex-grow">
                <h3 className="font-medium text-[var(--foreground)]">{cert.name}</h3>
                <p className="text-sm text-[var(--muted)]">
                  {cert.issuer} • {cert.date}
                </p>
              </div>
              {cert.credentialUrl && (
                <Link
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                >
                  View credential →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
