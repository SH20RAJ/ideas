import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const rootDir = path.join(process.cwd(), '../');
const categories = ['startup', 'projects', 'libs'] as const;
const rootFiles = ['README.md', 'what-i-know.md', 'AGENTS.md'];

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

  // 1. Get Root Files
  for (const fileName of rootFiles) {
    const filePath = path.join(rootDir, fileName);
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      const slug = fileName.replace('.md', '');
      
      allIdeas.push({
        title: data.title || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: data.description || `Core documentation: ${fileName}`,
        status: data.status || 'stable',
        type: 'docs',
        tags: data.tags || ['meta'],
        created_at: data.created_at || '2026-03-27',
        executed_at: null,
        link: null,
        priority: 0,
        slug: slug,
        category: 'docs',
      });
    }
  }

  // 2. Get Categorized Ideas
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

  return allIdeas;
}

export async function getIdeaBySlug(category: string, slug: string): Promise<Idea | null> {
  let filePath = '';
  
  if (category === 'docs') {
    filePath = path.join(rootDir, `${slug}.md`);
  } else {
    filePath = path.join(rootDir, category, slug, 'README.md');
  }

  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const processedContent = await remark()
    .use(html)
    .process(content);
  
  const contentHtml = processedContent.toString();

  const title = data.title || (category === 'docs' ? slug : slug).split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    metadata: {
      title,
      description: data.description || '',
      status: data.status || 'stable',
      type: data.type || category,
      tags: data.tags || [],
      created_at: data.created_at || '',
      executed_at: data.executed_at || null,
      link: data.link || null,
      priority: data.priority || 0,
      slug,
      category,
    },
    content: contentHtml,
  };
}
