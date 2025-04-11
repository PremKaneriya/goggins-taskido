"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const router = useRouter();
  const mainRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check authentication token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/auth/fetch-token", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.token) router.push("/tasks");
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    fetchToken();
  }, [router]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section fade-ins
      gsap.utils.toArray<HTMLElement>(".section").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Headline word-by-word animation
      gsap.utils.toArray<HTMLElement>(".animate-headline").forEach((headline) => {
        const words = headline.querySelectorAll(".word");
        gsap.fromTo(
          words,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headline,
              start: "top 90%",
            },
          }
        );
      });

      // Stagger feature cards
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-section",
            start: "top 80%",
          },
        }
      );

      // Stagger testimonials
      gsap.fromTo(
        ".testimonial-card",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".testimonials-section",
            start: "top 80%",
          },
        }
      );

      // Parallax for images
      gsap.utils.toArray<HTMLElement>(".parallax-img").forEach((img) => {
        gsap.fromTo(
          img,
          { y: -50 },
          {
            y: 50,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // Pinned quote section
      const quote = document.querySelector(".quote-section");
      if (quote) {
        gsap.fromTo(
          quote.querySelector("blockquote"),
          { scale: 0.9, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: quote,
              start: "top 60%",
              end: "top 20%",
              scrub: 1,
              pin: true,
              pinSpacing: true,
            },
          }
        );
      }
    }, mainRef);
    return () => ctx.revert();
  }, []);

  // Button and card hover animations
  useEffect(() => {
    gsap.utils.toArray<HTMLElement>(".hover-btn").forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "power2.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
      });
    });

    gsap.utils.toArray<HTMLElement>(".feature-card, .testimonial-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { y: -10, duration: 0.3, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
      });
    });
  }, []);

  // Helper to split headlines into words
  const splitWords = (text: string) =>
    text.split(" ").map((word, i) => (
      <span key={i} className="word inline-block mr-2">
        {word}
      </span>
    ));

  return (
    <main ref={mainRef} className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="fixed top-0 z-20 w-full bg-white/90 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-amber-600">
            TASKIDO
          </Link>
          <nav className="hidden md:flex gap-4 lg:gap-6">
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/login" highlight>
              Start Now
            </NavLink>
          </nav>
          <button
            className="md:hidden p-2 rounded hover:bg-neutral-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-neutral-100">
            <nav className="flex flex-col items-center gap-4 py-4">
              <NavLink href="/features" onClick={() => setIsMenuOpen(false)}>
                Features
              </NavLink>
              <NavLink href="/about" onClick={() => setIsMenuOpen(false)}>
                About
              </NavLink>
              <NavLink href="/login" highlight onClick={() => setIsMenuOpen(false)}>
                Start Now
              </NavLink>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="section pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="animate-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              {splitWords("Forge Your Iron Will")}
            </h1>
            <p className="text-neutral-600 text-base sm:text-lg max-w-md">
              Discipline drives results. No excuses, only victories.
            </p>
            <Link href="/login">
              <button className="hover-btn bg-amber-600 text-white px-6 py-3 rounded-md font-medium hover:bg-amber-700 transition duration-300">
                Begin Now
              </button>
            </Link>
          </div>
          <img
            src="https://assets.cdn.filesafe.space/cd9mgmvFLDLo7Sm54MPR/media/67ae20919b4e2636eab0db5f.png"
            alt="Motivational figure"
            loading="lazy"
            className="parallax-img w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] mx-auto rounded-md shadow-lg object-cover"
          />
        </div>
      </section>

      {/* Why TASKIDO */}
      <section className="section py-12 sm:py-16 px-4 sm:px-6 bg-neutral-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
            alt="Focused workspace"
            loading="lazy"
            className="parallax-img w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] mx-auto rounded-md shadow-lg object-cover order-2 md:order-1"
          />
          <div className="space-y-4 sm:space-y-6 order-1 md:order-2">
            <h2 className="animate-headline text-2xl sm:text-3xl font-bold">
              {splitWords("Why TASKIDO?")}
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg max-w-md">
              TASKIDO isn’t just a tool—it’s a mindset. Reject mediocrity and turn chaos into clarity.
            </p>
            <ul className="space-y-2 text-neutral-600">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                </svg>
                Relentless focus.
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                </svg>
                Brutal honesty.
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                </svg>
                Inner drive.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="animate-headline text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
            {splitWords("The Discipline Edge")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard
              title="Steel Mindset"
              description="Daily challenges to crush self-doubt and build unbreakable resilience."
              className="feature-card"
            />
            <FeatureCard
              title="Truth Mirror"
              description="Track your goals with raw accountability, no sugarcoating."
              className="feature-card"
            />
            <FeatureCard
              title="Victory Vault"
              description="Log every win to fuel your relentless pursuit of greatness."
              className="feature-card"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section py-12 sm:py-16 px-4 sm:px-6 bg-neutral-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">1. Set Your Mission</h3>
              <p className="text-neutral-600 text-sm sm:text-base">
                Define clear, actionable goals that align with your vision.
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">2. Track Your Grind</h3>
              <p className="text-neutral-600 text-sm sm:text-base">
                Log every step with precision to see real-time progress.
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">3. Conquer Daily</h3>
              <p className="text-neutral-600 text-sm sm:text-base">
                Stack wins with unwavering discipline, day after day.
              </p>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop"
            alt="Task tracking"
            loading="lazy"
            className="parallax-img w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] mx-auto rounded-md shadow-lg object-cover"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="animate-headline text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
            {splitWords("What Warriors Say")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <TestimonialCard
              quote="TASKIDO turned chaos into clarity. I’m unstoppable now."
              author="Alex R."
              role="Entrepreneur"
              className="testimonial-card"
            />
            <TestimonialCard
              quote="It’s raw, real, and exactly what I needed."
              author="Sarah K."
              role="Athlete"
              className="testimonial-card"
            />
            <TestimonialCard
              quote="Every win I log fuels my fire."
              author="James T."
              role="Designer"
              className="testimonial-card"
            />
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="section quote-section py-12 sm:py-16 px-4 sm:px-6 bg-amber-50/50">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-lg sm:text-xl md:text-2xl italic font-medium text-neutral-800">
            "The only way out is through."
          </blockquote>
          <p className="mt-2 text-amber-600 font-medium">David Goggins</p>
        </div>
      </section>

      {/* Community */}
      <section className="section py-12 sm:py-16 px-4 sm:px-6 bg-neutral-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="space-y-4 sm:space-y-6">
            <h2 className="animate-headline text-2xl sm:text-3xl font-bold">
              {splitWords("Join the Relentless")}
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg max-w-md">
              Connect with a community that refuses to settle. Share wins, learn, and grow stronger.
            </p>
            <Link href="/login">
              <button className="hover-btn bg-amber-600 text-white px-6 py-3 rounded-md font-medium hover:bg-amber-700 transition duration-300">
                Join Now
              </button>
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
            alt="Community collaboration"
            loading="lazy"
            className="parallax-img w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] mx-auto rounded-md shadow-lg object-cover"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="section py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
          <h2 className="animate-headline text-2xl sm:text-3xl md:text-4xl font-bold">
            {splitWords("No More Excuses")}
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg">
            Step into the arena. Conquer your limits with TASKIDO.
          </p>
          <Link href="/login">
            <button className="hover-btn bg-amber-600 text-white px-6 sm:px-8 py-3 rounded-md font-medium hover:bg-amber-700 transition duration-300">
              Start Your Journey
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <section className="section py-8 sm:py-12 px-4 sm:px-6 bg-neutral-100 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-amber-600">TASKIDO</h3>
            <p className="text-neutral-500 text-sm">Built for the relentless.</p>
          </div>
          <nav className="flex gap-4 sm:gap-6 text-sm text-neutral-600">
            <Link href="/features" className="hover:text-amber-600">
              Features
            </Link>
            <Link href="/about" className="hover:text-amber-600">
              About
            </Link>
            <Link href="/contact" className="hover:text-amber-600">
              Contact
            </Link>
          </nav>
        </div>
      </section>
    </main>
  );
}

// Components
function NavLink({
  href,
  children,
  highlight = false,
  onClick,
}: {
  href: string;
  children: ReactNode;
  highlight?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`font-medium transition duration-300 ${
        highlight
          ? "bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700"
          : "text-neutral-600 hover:text-amber-600"
      }`}
    >
      {children}
    </Link>
  );
}

function FeatureCard({ title, description, className }: { title: string; description: string; className?: string }) {
  return (
    <div
      className={`bg-white p-4 sm:p-6 rounded-md border border-neutral-200 hover:border-amber-600 transition duration-300 shadow-sm ${className}`}
    >
      <h3 className="text-lg sm:text-xl font-bold mb-2">{title}</h3>
      <p className="text-neutral-600 text-sm sm:text-base">{description}</p>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  className,
}: {
  quote: string;
  author: string;
  role: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-white p-4 sm:p-6 rounded-md border border-neutral-200 shadow-sm ${className}`}
    >
      <blockquote className="text-neutral-600 italic text-sm sm:text-base mb-4">"{quote}"</blockquote>
      <p className="text-neutral-900 font-medium">{author}</p>
      <p className="text-neutral-500 text-sm">{role}</p>
    </div>
  );
}