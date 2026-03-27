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

  const categories = ['all', 'docs', 'startup', 'projects', 'libs'];

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="flex flex-col gap-12">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-[64px] font-bold leading-[1.1] tracking-tight text-black">
             Structure for <br/> <span className="opacity-40 italic font-medium">multi-tenancy</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
            A hyper-minimalist archive of core documentation, startup pitches, and technical projects by @sh20raj.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-100 pb-12">
          <div className="flex gap-2 bg-zinc-50 p-1 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  category === cat 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filteredIdeas.map((idea) => (
            <Link
              key={idea.slug}
              href={`/idea/${idea.category}/${idea.slug}`}
              className="group flex flex-col gap-4 no-underline"
            >
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                 <span>{idea.category}</span>
                 {idea.status && idea.status !== 'stable' && <span>{idea.status}</span>}
              </div>
              
              <h3 className="text-2xl font-bold group-hover:underline underline-offset-4 decoration-1">
                {idea.title}
              </h3>
              
              <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                {idea.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {idea.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] font-medium text-zinc-400 border border-zinc-100 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {filteredIdeas.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-zinc-400 text-sm italic">Nothing found. Try a different term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
