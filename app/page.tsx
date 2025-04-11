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
          credentials: "include",
        });

        const data = await res.json();
        if (data.token) {
          setToken(data.token);
          router.push("/tasks");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-10 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-amber-600">TASKIDO</h1>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/login" highlight>Start Now</NavLink>
          </nav>
          <button className="md:hidden p-2 rounded-md hover:bg-neutral-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-neutral-900">
              Forge Your <span className="text-amber-600">Iron Will</span>
            </h2>
            <p className="text-neutral-600 text-base md:text-lg max-w-md">
              Channel relentless discipline into daily victories. No excuses. Just results.
            </p>
            <Link href="/login">
              <button className="bg-amber-600 text-white mt-7 px-6 py-3 rounded-lg font-medium shadow-md hover:bg-amber-700 transition-all">
                Begin the Grind
              </button>
            </Link>
          </div>
          <div className="relative">
            <img
              src="https://assets.cdn.filesafe.space/cd9mgmvFLDLo7Sm54MPR/media/67ae20919b4e2636eab0db5f.png"
              alt="David Goggins"
              className="w-[600px] mx-auto rounded-lg shadow-lg object-cover h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12 tracking-tight text-neutral-900">
            The Discipline Edge
          </h2>
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
      <section className="py-12 bg-gradient-to-r from-neutral-50 via-amber-50 to-neutral-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <blockquote className="text-lg md:text-xl italic font-medium text-neutral-800">
            "The only way out is through."
          </blockquote>
          <p className="mt-4 text-amber-600 font-medium">David Goggins</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900">
            No More Weakness
          </h2>
          <p className="text-neutral-600 text-base md:text-lg">
            Join the ranks of those who conquer their limits daily.
          </p>
          <Link href="/login">
            <button className="bg-amber-600 text-white px-8 py-4 rounded-lg font-medium shadow-md hover:bg-amber-700 transition-all">
              Start Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-neutral-100 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-amber-600">TASKIDO</h3>
            <p className="text-neutral-500 text-sm">Built for the relentless.</p>
          </div>
          <div className="flex gap-6 text-sm text-neutral-600">
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
    <div className="bg-white p-6 rounded-lg border border-neutral-200 hover:border-amber-600 transition-all shadow-sm">
      <h3 className="text-lg md:text-xl font-extrabold mb-2 text-neutral-900">{title}</h3>
      <p className="text-neutral-600 text-sm">{description}</p>
    </div>
  );
}