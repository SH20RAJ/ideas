import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const rootDir = path.join(process.cwd(), '../');
const categories = ['startup', 'projects', 'libs'] as const;

export type IdeaMetadata = {
  title: string;
  description: string;
  status: string;
  type: string;
  tags: string[];
  created_at: string;
  executed_at: string | null;
  link: string | null;
  priority: number;
  slug: string;
  category: string;
};

export type Idea = {
  metadata: IdeaMetadata;
  content: string;
};

export async function getAllIdeas(): Promise<IdeaMetadata[]> {
  const allIdeas: IdeaMetadata[] = [];

  for (const category of categories) {
    const categoryDir = path.join(rootDir, category);
    if (!fs.existsSync(categoryDir)) continue;

    const items = fs.readdirSync(categoryDir, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        const readmePath = path.join(categoryDir, item.name, 'README.md');
        if (fs.existsSync(readmePath)) {
          const fileContents = fs.readFileSync(readmePath, 'utf8');
          const { data } = matter(fileContents);
          
          allIdeas.push({
            ...(data as Omit<IdeaMetadata, 'slug' | 'category'>),
            slug: item.name,
            category,
          });
        }
      }
    }
  }

  return allIdeas.sort((a, b) => (new Date(b.created_at) > new Date(a.created_at) ? 1 : -1));
}

export async function getIdeaBySlug(category: string, slug: string): Promise<Idea | null> {
  const readmePath = path.join(rootDir, category, slug, 'README.md');
  if (!fs.existsSync(readmePath)) return null;

  const fileContents = fs.readFileSync(readmePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const processedContent = await remark()
    .use(html)
    .process(content);
  
  const contentHtml = processedContent.toString();

  return {
    metadata: {
      ...(data as Omit<IdeaMetadata, 'slug' | 'category'>),
      slug,
      category,
    },
    content: contentHtml,
  };
}
