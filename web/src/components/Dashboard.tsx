'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { IdeaMetadata } from '@/lib/ideas';

export default function Dashboard({ initialIdeas }: { initialIdeas: IdeaMetadata[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');

  const fuse = useMemo(() => new Fuse(initialIdeas, {
    keys: ['title', 'description', 'tags'],
    threshold: 0.3,
  }), [initialIdeas]);

  const filteredIdeas = useMemo(() => {
    let results = query 
      ? fuse.search(query).map(r => r.item)
      : initialIdeas;
    
    if (category !== 'all') {
      results = results.filter(idea => idea.category === category);
    }
    
    return results;
  }, [query, category, initialIdeas, fuse]);

  const categories = ['all', 'startup', 'projects', 'libs'];

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search ideas (e.g. 'ai', 'farmer', 'journal')..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
             {filteredIdeas.length} results
          </div>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                category === cat 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => (
          <Link
            key={idea.slug}
            href={`/idea/${idea.category}/${idea.slug}`}
            className="group block p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 px-2 py-1 bg-blue-400/10 rounded">
                {idea.category}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${
                idea.status === 'in-progress' ? 'bg-amber-400/10 text-amber-400' :
                idea.status === 'executed' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-slate-700 text-slate-400'
              }`}>
                {idea.status}
              </span>
            </div>
            
            <h2 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
              {idea.title}
            </h2>
            
            <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">
              {idea.description}
            </p>
            
            <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {idea.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[9px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-slate-600 font-mono text-[10px]">
                v1.0
              </span>
            </div>
          </Link>
        ))}
      </section>

      {filteredIdeas.length === 0 && (
        <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl">
          <p className="text-slate-500">No ideas found matching your search criteria.</p>
        </div>
      )}
    </>
  );
}
