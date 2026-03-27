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
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <nav className="mb-8">
        <Link href="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <article className="prose prose-invert prose-blue max-w-none">
        <header className="mb-12 border-b border-slate-800 pb-8">
          <div className="flex gap-4 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 px-2 py-1 bg-blue-400/10 rounded">
              {idea.metadata.category}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              idea.metadata.status === 'in-progress' ? 'bg-amber-400/10 text-amber-400' :
              idea.metadata.status === 'executed' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-slate-700 text-slate-300'
            }`}>
              {idea.metadata.status}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 !mt-0">
            {idea.metadata.title}
          </h1>
          <p className="text-xl text-slate-400 italic !mb-0">
            {idea.metadata.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {idea.metadata.tags.map(tag => (
              <span key={tag} className="text-xs text-slate-500 border border-slate-800 px-3 py-1 rounded-full bg-slate-900">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        <section 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: idea.content }} 
        />
      </article>

      <footer className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        Created on {new Date(idea.metadata.created_at).toLocaleDateString()} • {idea.metadata.priority}/5 Priority
      </footer>
    </main>
  );
}
