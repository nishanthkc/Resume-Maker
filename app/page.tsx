'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { CareerBackground } from '@/components/CareerBackground';
import { ThemeToggle } from '@/components/ThemeToggle';
import { withCursorFollow } from '@/components/withCursorFollow';

// Cursor follow component
const CursorGlow = () => (
  <div className="w-32 h-32 rounded-full bg-purple-500/20 blur-3xl" />
);

const CursorFollowGlow = withCursorFollow(CursorGlow);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Register GSAP plugins only on client side
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const sections = sectionsRef.current;

    // Create sticky scroll sections
    sections.forEach((section, index) => {
      if (!section) return;

      const scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
        scrub: 1,
      });

      // Animate content on scroll
      const animation = gsap.fromTo(
        section.querySelectorAll('.animate-on-scroll'),
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
        }
      );

      // Store references for cleanup
      (section as any).__scrollTrigger = scrollTrigger;
      (section as any).__animation = animation;
    });

    // Hero animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll('.hero-content'),
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
        }
      );
    }

    return () => {
      // Cleanup all ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
      // Cleanup animations
      sections.forEach((section) => {
        if (section && (section as any).__animation) {
          (section as any).__animation.kill();
        }
      });
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="relative min-h-screen bg-black dark:bg-black text-white overflow-hidden">
      <CareerBackground />
      <CursorFollowGlow />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Resume Maker
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link
              href="/resume-builder"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-6 pt-20"
      >
        <div className="max-w-5xl mx-auto text-center z-10">
          <div className="hero-content mb-6">
            <div className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
              <span className="text-sm text-purple-400">Transform your resume in minutes</span>
            </div>
          </div>
          
          <h1 className="hero-content text-6xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="text-white">The truly</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Tailored
            </span>
            <span className="text-white/70"> resume</span>
            <br />
            <span className="text-white">for your dream job.</span>
          </h1>

          <p className="hero-content text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Say goodbye to generic resumes, and hello to perfectly tailored, ATS-optimized resumes that get you noticed.
          </p>

          <div className="hero-content flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/resume-builder"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/50"
            >
              Get Started
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 rounded-full border-2 border-zinc-700 text-white font-semibold text-lg hover:border-zinc-600 transition-all duration-300"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        ref={addToRefs}
        id="how-it-works"
        className="relative min-h-screen flex items-center justify-center px-6"
      >
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-16 animate-on-scroll">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Your Resume',
                description: 'Upload your current resume in PDF, DOCX, or LaTeX format. Our system extracts all your information automatically.',
              },
              {
                step: '02',
                title: 'Provide Job Details',
                description: 'Paste the job description and specify the job role. Add any personalization preferences if needed.',
              },
              {
                step: '03',
                title: 'Get Tailored Resume',
                description: 'Our AI analyzes the job requirements and tailors your resume to match perfectly. Download and apply with confidence.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="animate-on-scroll p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="text-6xl font-bold text-purple-500/20 mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold mb-4 text-white">{item.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={addToRefs}
        className="relative min-h-screen flex items-center justify-center px-6"
      >
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-16 animate-on-scroll">
            Powerful Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '🎯',
                title: 'ATS Optimized',
                description: 'Resumes are optimized to pass Applicant Tracking Systems and reach human recruiters.',
              },
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Get your tailored resume in minutes, not hours. No waiting, no delays.',
              },
              {
                icon: '🎨',
                title: 'Multiple Templates',
                description: 'Choose from Modern, Classic, or Old-school templates that match your industry.',
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                description: 'Your data is encrypted and secure. We never share your information with third parties.',
              },
              {
                icon: '🤖',
                title: 'AI-Powered',
                description: 'Advanced AI analyzes job descriptions and tailors your resume to match perfectly.',
              },
              {
                icon: '📄',
                title: 'Multiple Formats',
                description: 'Support for PDF, DOCX, and LaTeX formats. Export to Overleaf for further editing.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="animate-on-scroll p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={addToRefs}
        className="relative min-h-screen flex items-center justify-center px-6"
      >
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-5xl md:text-7xl font-bold text-center mb-16 animate-on-scroll">
            What Users Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                role: 'Software Engineer',
                content: 'Got 3 interviews in the first week after using my tailored resume. This tool is a game-changer!',
                rating: 5,
              },
              {
                name: 'Michael Rodriguez',
                role: 'Product Manager',
                content: 'The AI really understands how to match skills to job descriptions. My response rate increased by 200%.',
                rating: 5,
              },
              {
                name: 'Emily Johnson',
                role: 'Data Scientist',
                content: 'Finally, a tool that creates resumes that actually get past ATS systems. Highly recommend!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="animate-on-scroll p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-zinc-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-zinc-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Join thousands of job seekers who have transformed their careers with tailored resumes.
          </p>
          <Link
            href="/resume-builder"
            className="inline-block px-10 py-5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/50"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-zinc-800 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-zinc-400">
          <p>&copy; 2024 Resume Maker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
