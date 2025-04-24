"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Home() {
  const router = useRouter();
  const mainRef = useRef(null);
  const textRef = useRef(null);

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

  // Animation for text elements
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the welcome text
      gsap.fromTo(
        ".welcome-text",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
        }
      );
      
      // Animate the button
      gsap.fromTo(
        ".get-started-btn",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.8,
          ease: "back.out(1.7)",
        }
      );
    }, mainRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <main 
      ref={mainRef} 
      className="min-h-screen bg-black text-white flex items-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col md:flex-row items-center">
        {/* Text Content */}
        <div ref={textRef} className="md:w-1/2 space-y-6 z-10">
          <h1 className="welcome-text text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Welcome to<br />Taskidos
          </h1>
          <p className="welcome-text text-lg sm:text-xl text-gray-300 max-w-lg">
            Where discipline meets productivity.
            Organize tasks, crush goals, and stay unstoppable—like Goggins.
          </p>
          <div className="pt-4">
            <Link href="/login">
              <button className="get-started-btn bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-md font-medium transition duration-300 text-lg">
                Get Started
              </button>
            </Link>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="md:w-1/2 mt-10 md:mt-0 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
          <img
            src="https://assets.cdn.filesafe.space/cd9mgmvFLDLo7Sm54MPR/media/67ae20919b4e2636eab0db5f.png"
            alt="Motivational figure"
            className="w-full max-w-md mx-auto welcome-text"
          />
        </div>
      </div>
    </main>
  );
}