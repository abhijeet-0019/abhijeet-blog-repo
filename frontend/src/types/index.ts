export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  summary: string;
  content?: string;
}

export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  badgeImage: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  email: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  resumePdf: string;
  apiUrl: string;
}
