"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/auth/fetch-token", {
          method: "GET",
          credentials: "include", // Ensures cookies are sent
        });

        const data = await res.json();
        if (data.token) {
          setToken(data.token);
          router.push("/tasks"); // Redirect if token exists
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col bg-white text-neutral-900">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-10 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-amber-600">TASKIDO</h1>
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/login" highlight>Start Now</NavLink>
          </nav>
          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Forge Your <span className="text-amber-600">Iron Will</span>
            </h2>
            <p className="text-neutral-600 text-lg max-w-md">
              Channel relentless discipline into daily victories. No excuses. Just results.
            </p>
            <Link href="/login">
            <button className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors">
              Begin the Grind
            </button>
            </Link>
          </div>
          <div className="relative">
            <img
              src="https://assets.cdn.filesafe.space/cd9mgmvFLDLo7Sm54MPR/media/67ae20919b4e2636eab0db5f.png"
              alt="David Goggins"
              className="w-full max-w-lg mx-auto rounded-full shadow-xl "
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12 tracking-tight">The Discipline Edge</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Steel Mindset"
              description="Daily challenges to forge unbreakable mental resilience."
            />
            <FeatureCard 
              title="Truth Mirror"
              description="Raw, honest tracking of your commitments and progress."
            />
            <FeatureCard 
              title="Victory Vault"
              description="Store your wins to fuel future battles."
            />
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-12 bg-gradient-to-r from-white via-amber-100 to-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <blockquote className="text-xl md:text-2xl italic font-medium text-neutral-800">
            "The only way out is through."
          </blockquote>
          <p className="mt-4 text-amber-600 font-medium">David Goggins</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            No More Weakness
          </h2>
          <p className="text-neutral-600 text-lg">
            Join the ranks of those who conquer their limits daily.
          </p>
          <Link href="/login">
          <button className="bg-amber-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors">
            Start Now
          </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-amber-600 mb-2">TASKIDO</h3>
            <p className="text-neutral-500 text-sm">Built for the relentless.</p>
          </div>
          <div className="flex gap-8 text-sm text-neutral-600">
            <a href="#" className="hover:text-amber-600 transition-colors">Features</a>
            <a href="#" className="hover:text-amber-600 transition-colors">About</a>
            <a href="#" className="hover:text-amber-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Components
function NavLink({ href, children, highlight = false }: { href: string; children: ReactNode; highlight?: boolean }) {
  return (
    <a 
      href={href} 
      className={`${
        highlight 
          ? 'bg-amber-600 text-white px-4 py-2 rounded-lg' 
          : 'text-neutral-600 hover:text-amber-600'
      } font-medium transition-colors`}
    >
      {children}
    </a>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200 hover:border-amber-600 transition-colors shadow-sm">
      <h3 className="text-xl font-extrabold mb-2">{title}</h3>
      <p className="text-neutral-600 text-sm">{description}</p>
    </div>
  );
}