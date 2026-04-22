import type { BlogPost, Locale } from "./types";
import { acMaintenanceGuide } from "./posts/ac-maintenance-guide";
import { heatingWithAc } from "./posts/heating-with-ac";
import { howToChooseAc } from "./posts/how-to-choose-ac";

const allPosts: BlogPost[] = [acMaintenanceGuide, heatingWithAc, howToChooseAc];

// Sort by date descending
allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getAllPosts(): BlogPost[] {
  return allPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return allPosts.map((p) => p.slug);
}

export type { BlogPost, Locale };
