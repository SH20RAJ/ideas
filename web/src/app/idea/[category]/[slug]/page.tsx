import { getIdeaBySlug, getAllIdeas } from '@/lib/ideas';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const ideas = await getAllIdeas();
  return ideas.map((idea) => ({
    category: idea.category,
    slug: idea.slug,
  }));
}

export default async function IdeaPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const idea = await getIdeaBySlug(category, slug);

  if (!idea) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-black p-8 md:p-20 max-w-5xl mx-auto">
      <nav className="mb-16">
        <Link href="/" className="text-sm font-bold tracking-widest uppercase hover:opacity-50 transition-opacity flex items-center gap-2">
          ← Back
        </Link>
      </nav>

      <article className="max-w-3xl">
        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <span>{idea.metadata.category}</span>
            <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
            <span>{idea.metadata.status}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            {idea.metadata.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-500 font-medium leading-relaxed">
            {idea.metadata.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {idea.metadata.tags.map(tag => (
              <span key={tag} className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 border border-zinc-200 rounded-full text-zinc-500">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <section 
          className="markdown-content prose-headings:font-bold prose-h2:text-4xl prose-h3:text-2xl"
          dangerouslySetInnerHTML={{ __html: idea.content }} 
        />
      </article>

      <footer className="mt-40 pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center text-[11px] font-bold uppercase tracking-widest text-zinc-400 gap-4">
        <div className="flex gap-8">
           <a href="https://github.com/sh20raj" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Github</a>
           <a href="https://github.com/sh20raj/ideas" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Source</a>
           <a href="https://sh20raj.github.io/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Portfolio</a>
           <span>Concept &copy; 2026 @sh20raj</span>
        </div>
        <div className="flex gap-8">
           <span>Priority {idea.metadata.priority}/5</span>
           <span>v1.0.0</span>
        </div>
      </footer>
    </main>
  );
}
