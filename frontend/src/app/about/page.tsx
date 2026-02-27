import Link from "next/link";
import { ArrowLeft, Download, Mail, Github, Linkedin, MapPin, Briefcase, GraduationCap, Award, Code, FolderGit2, ExternalLink } from "lucide-react";
import skills from "@/data/skills.json";
import experience from "@/data/experience.json";
import certifications from "@/data/certifications.json";
import education from "@/data/education.json";
import projects from "@/data/projects.json";
import siteConfig from "@/data/site-config.json";
import { Skill, Experience, Certification, Education, Project } from "@/types";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-8 cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to home
      </Link>

      {/* Header Section */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-1">
              {siteConfig.fullName}
            </h1>
            <p className="text-lg text-[var(--accent)] font-medium">
              {siteConfig.title}
            </p>
          </div>
          
          {siteConfig.resumePdf && (
            <a
              href={siteConfig.resumePdf}
              download="Abhijeet_Singh_Rajpurohit_Resume.pdf"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download size={18} />
              Download Resume
            </a>
          )}
        </div>

        {/* Contact Info Bar */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)] pb-6 border-b border-[var(--border)]">
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors cursor-pointer"
          >
            <Mail size={14} />
            {siteConfig.email}
          </a>
          {siteConfig.social.github && (
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              <Github size={14} />
              GitHub
            </a>
          )}
          {siteConfig.social.linkedin && (
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              <Linkedin size={14} />
              LinkedIn
            </a>
          )}
          <span className="flex items-center gap-1.5">
            <MapPin size={14} />
            Jodhpur, Rajasthan, India
          </span>
        </div>
      </header>

      {/* Summary Section */}
      <section className="mb-10">
        <p className="text-[var(--foreground)] leading-relaxed text-base">
          {siteConfig.description}
        </p>
      </section>

      {/* Experience Section */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6 flex items-center gap-3 uppercase tracking-wider">
          <span className="w-8 h-8 bg-[var(--accent)] bg-opacity-10 rounded-lg flex items-center justify-center">
            <Briefcase size={16} className="text-[var(--accent)]" />
          </span>
          Experience
        </h2>

        <div className="space-y-6">
          {experience.map((exp: Experience, index: number) => (
            <div key={index} className="relative pl-6 border-l-2 border-[var(--border)] hover:border-[var(--accent)] transition-colors">
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-[var(--accent)] rounded-full" />
              
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">
                    {exp.title}
                  </h3>
                  <p className="text-[var(--accent)]">{exp.company}</p>
                </div>
                <span className="text-sm text-[var(--muted)] whitespace-nowrap">
                  {exp.period}
                </span>
              </div>
              
              <p className="text-[var(--foreground)] text-sm mb-2">{exp.description}</p>
              
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

      {/* Skills Section */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6 flex items-center gap-3 uppercase tracking-wider">
          <span className="w-8 h-8 bg-[var(--accent)] bg-opacity-10 rounded-lg flex items-center justify-center">
            <Code size={16} className="text-[var(--accent)]" />
          </span>
          Skills & Technologies
        </h2>

        <div className="space-y-4">
          {skills.map((skillGroup: Skill, index: number) => (
            <div key={index}>
              <h3 className="text-sm font-medium text-[var(--accent)] mb-2">
                {skillGroup.category}
              </h3>
              <p className="text-[var(--foreground)] text-sm leading-relaxed">
                {skillGroup.items.join(" • ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6 flex items-center gap-3 uppercase tracking-wider">
          <span className="w-8 h-8 bg-[var(--accent)] bg-opacity-10 rounded-lg flex items-center justify-center">
            <FolderGit2 size={16} className="text-[var(--accent)]" />
          </span>
          Projects
        </h2>

        <div className="space-y-6">
          {projects.map((project: Project, index: number) => (
            <div
              key={index}
              className="p-5 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">{project.name}</h3>
                  <p className="text-sm text-[var(--accent)]">{project.type}</p>
                </div>
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                  >
                    <Github size={14} />
                    View Code
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
              
              <p className="text-[var(--foreground)] text-sm mb-3">{project.description}</p>
              
              {project.highlights && project.highlights.length > 0 && (
                <ul className="list-disc list-inside text-sm text-[var(--muted)] space-y-1 mb-3">
                  {project.highlights.map((highlight: string, hIndex: number) => (
                    <li key={hIndex}>{highlight}</li>
                  ))}
                </ul>
              )}
              
              {project.techStack && project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                  {project.techStack.map((tech: string, tIndex: number) => (
                    <span
                      key={tIndex}
                      className="px-2 py-1 bg-gray-100 text-[var(--foreground)] text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6 flex items-center gap-3 uppercase tracking-wider">
          <span className="w-8 h-8 bg-[var(--accent)] bg-opacity-10 rounded-lg flex items-center justify-center">
            <Award size={16} className="text-[var(--accent)]" />
          </span>
          Certifications
        </h2>

        <div className="grid gap-3">
          {certifications.map((cert: Certification, index: number) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
            >
              <div>
                <h3 className="font-medium text-[var(--foreground)]">{cert.name}</h3>
                <p className="text-sm text-[var(--muted)]">
                  {cert.issuer} • {cert.date}
                </p>
              </div>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors cursor-pointer whitespace-nowrap"
                >
                  View credential →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6 flex items-center gap-3 uppercase tracking-wider">
          <span className="w-8 h-8 bg-[var(--accent)] bg-opacity-10 rounded-lg flex items-center justify-center">
            <GraduationCap size={16} className="text-[var(--accent)]" />
          </span>
          Education
        </h2>

        <div className="space-y-5">
          {education.map((edu: Education, index: number) => (
            <div key={index} className="p-4 border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                <h3 className="font-semibold text-[var(--foreground)]">
                  {edu.degree}
                </h3>
                <span className="text-sm text-[var(--muted)]">{edu.period}</span>
              </div>
              <p className="text-[var(--foreground)] text-sm">{edu.institution}</p>
              <p className="text-sm text-[var(--accent)] font-medium mt-1">{edu.gpa}</p>
              {edu.achievements && edu.achievements.length > 0 && (
                <ul className="list-disc list-inside text-sm text-[var(--muted)] space-y-1 mt-2">
                  {edu.achievements.map((achievement: string, aIndex: number) => (
                    <li key={aIndex}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <div className="pt-8 border-t border-[var(--border)] text-center text-sm text-[var(--muted)]">
        <p>This page is print-friendly. Use Ctrl+P / Cmd+P to save as PDF.</p>
      </div>
    </div>
  );
}
