import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto py-16 text-center animate-enter">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">Build, share, and collect forms</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">A professional form builder for modern teams. Design, validate, and publish in minutes.</p>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"> BY SHAHID AFRID </p>
        <div className="flex justify-center gap-3 mt-8">
          <Link to="/auth"><Button variant="brutal" size="xl" className="hover-scale">Get Started</Button></Link>
          <Link to="/preview?demo=true"><Button variant="outline" size="xl" className="hover-scale">Live Demo</Button></Link>
        </div>
      </header>

      <main className="container mx-auto pb-16">
        <section className="grid md:grid-cols-2 gap-6">
          <article className="brutal-card animate-enter">
            <h2 className="text-2xl font-black mb-2">1. Create</h2>
            <p className="text-muted-foreground">Add fields, rules, and derived values. Chunky controls, simple UX.</p>
          </article>
          <article className="brutal-card animate-enter">
            <h2 className="text-2xl font-black mb-2">2. Share</h2>
            <p className="text-muted-foreground">Publish a public link and share it anywhere. Works on any device.</p>
          </article>
          <article className="brutal-card animate-enter">
            <h2 className="text-2xl font-black mb-2">3. Collect</h2>
            <p className="text-muted-foreground">Capture responses instantly. Realtime-ready backend with Supabase.</p>
          </article>
          <article className="brutal-card animate-enter">
            <h2 className="text-2xl font-black mb-2">4. Manage</h2>
            <p className="text-muted-foreground">A colorful dashboard to organize all your forms.</p>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Index;
