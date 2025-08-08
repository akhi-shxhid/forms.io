import { Link } from 'react-router-dom';
import { Github, Linkedin, Globe, Heart, Code, Zap, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="container mx-auto py-16 text-center animate-enter">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            CREATED BY
          </h1>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
            SHAHID AFRID
          </h2>
        </div>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          A passionate Software Developer and full-stack developer crafting modern web applications with cutting-edge technologies
        </p>
        
        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-8">
          <a href="https://linkedin.com/in/shahid-afrid-218186308" target="_blank" rel="noreferrer">
            <Button variant="brutal" size="lg" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Linkedin className="h-5 w-5" />
              LinkedIn
            </Button>
          </a>
          <a href="https://github.com/akhi-shxhid" target="_blank" rel="noreferrer">
            <Button variant="brutal" size="lg" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900">
              <Github className="h-5 w-5" />
              GitHub
            </Button>
          </a>
          <a href="https://shahid-topaz.vercel.app" target="_blank" rel="noreferrer">
            <Button variant="brutal" size="lg" className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Globe className="h-5 w-5" />
              Portfolio
            </Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto pb-16 space-y-12">
        {/* Project Overview */}
        <section className="brutal-card bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-black">About Forms.io</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Forms.io is a modern, brutalist-styled form builder that combines powerful functionality with 
            an intuitive user experience. Built as a portfolio project to showcase full-stack development 
            and Software Development skills using React, TypeScript, Supabase, and modern web technologies.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Code className="h-5 w-5 text-secondary" />
                Tech Stack
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• React 18 with TypeScript</li>
                <li>• Redux Toolkit for state management</li>
                <li>• Supabase for backend & authentication</li>
                <li>• Tailwind CSS with custom brutalist design</li>
                <li>• Vite for fast development</li>
                <li>• shadcn/ui component library</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                Key Features
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Drag-and-drop form builder</li>
                <li>• Real-time form validation</li>
                <li>• Public form sharing</li>
                <li>• Response collection & management</li>
                <li>• Derived field calculations</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="brutal-card bg-gradient-to-br from-primary/20 to-primary/5">
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-xl font-black">Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built with Supabase authentication and row-level security for data protection
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="brutal-card bg-gradient-to-br from-secondary/20 to-secondary/5">
            <CardHeader>
              <Users className="h-8 w-8 text-secondary mb-2" />
              <CardTitle className="text-xl font-black">Collaborative</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Share forms publicly and collect responses from anyone, anywhere
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="brutal-card bg-gradient-to-br from-accent/20 to-accent/5">
            <CardHeader>
              <Zap className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="text-xl font-black">Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Lightning-fast performance with Vite and optimized React components
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="brutal-card bg-gradient-to-br from-destructive/20 to-destructive/5">
            <CardHeader>
              <Code className="h-8 w-8 text-destructive mb-2" />
              <CardTitle className="text-xl font-black">Modern</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built with the latest web technologies and best practices
              </CardDescription>
            </CardContent>
          </Card>
        </section>

        {/* Developer Info */}
        <section className="brutal-card bg-gradient-to-br from-secondary/10 to-accent/10">
          <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
            <Code className="h-8 w-8 text-secondary" />
            About the Developer
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Shahid Afrid</h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                A dedicated full-stack developer with expertise in modern web technologies. 
                Passionate about Software Development creating user-friendly applications that solve real-world problems.
              </p>
              <p className="text-muted-foreground mb-6">
                This project demonstrates proficiency in React ecosystem, backend integration, 
                UI/UX design, and modern development practices.
              </p>
              <div className="flex gap-3">
                <a href="https://linkedin.com/in/shahid-afrid-218186308" target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">
                    <Linkedin className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </a>
                <a href="https://github.com/akhi-shxhid" target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                </a>
              </div>
            </div>
            <div className="text-center">
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center mb-4">
                <Code className="h-24 w-24 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">
                "Building the future, one line of code at a time"
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center brutal-card bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
          <h2 className="text-3xl font-black mb-4">Ready to Build Amazing Forms?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Start creating professional forms in minutes with our intuitive builder
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/">
              <Button variant="brutal" size="xl">
                Get Started
              </Button>
            </Link>
            <Link to="/preview?demo=true">
              <Button variant="outline" size="xl">
                Try Demo
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
