import { getAllIdeas } from '@/lib/ideas';
import Dashboard from '@/components/Dashboard';

export default async function Home() {
  const ideas = await getAllIdeas();

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
          Ideas Dashboard
        </h1>
        <p className="text-slate-400 text-lg">
          A premium archive of startups, projects, and library concepts by @sh20raj
        </p>
      </header>

      <Dashboard initialIdeas={ideas} />
    </main>
  );
}
