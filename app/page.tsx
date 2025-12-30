'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center py-16 px-8 bg-white dark:bg-black">
        <div className="w-full max-w-3xl text-center space-y-8">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
            Resume Maker
          </h1>
          <p className="text-xl leading-8 text-zinc-600 dark:text-zinc-400">
            Transform your resume into a tailored masterpiece for any job application.
          </p>
          <p className="text-lg leading-8 text-zinc-500 dark:text-zinc-500">
            Upload your resume, provide a job description, and let AI create a customized resume that stands out.
          </p>
          <div className="pt-4">
            <Link
              href="/resume-builder"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-zinc-950 dark:bg-zinc-50 text-white dark:text-black font-medium transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              Get Started
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
