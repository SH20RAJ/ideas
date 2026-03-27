import { getAllIdeas } from '@/lib/ideas';
import Dashboard from '@/components/Dashboard';

export default async function Home() {
  const ideas = await getAllIdeas();

  return (
    <main className="min-h-screen bg-white">
      <Dashboard initialIdeas={ideas} />
    </main>
  );
}
