'use client';

import { useState } from 'react';
import { ResumeFormProvider } from '@/context/resume-form-context';

export default function ResumeBuilder() {
  const [latexCode, setLatexCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overleafUrl, setOverleafUrl] = useState<string | null>(null);
  const [s3Url, setS3Url] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOverleafUrl(null);
    setS3Url(null);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latexCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload resume');
      }

      setS3Url(data.url);
      setOverleafUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResumeFormProvider>
      <div className="flex min-h-screen items-center justify-center bg-background font-sans">
        <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-start py-16 px-8 bg-background">
          <div className="w-full max-w-3xl">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground mb-2">
            Resume Maker
          </h1>
          <p className="text-lg leading-8 text-foreground-muted mb-8">
            Paste your LaTeX resume code below to upload it to S3 and get an Overleaf link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="latex-code"
                className="block text-sm font-medium text-foreground-secondary mb-2"
              >
                LaTeX Resume Code
              </label>
              <textarea
                id="latex-code"
                value={latexCode}
                onChange={(e) => setLatexCode(e.target.value)}
                placeholder="Paste your LaTeX code here..."
                className="w-full h-96 px-4 py-3 border border-border rounded-lg bg-background-secondary text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !latexCode.trim()}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-accent text-background px-6 font-medium transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Uploading...
                </>
              ) : (
                'Upload to S3 & Get Overleaf Link'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-background-secondary border border-border rounded-lg">
              <p className="text-error text-sm font-medium">
                Error: {error}
              </p>
            </div>
          )}

          {overleafUrl && (
            <div className="mt-6 p-6 bg-background-secondary border border-border rounded-lg">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Success! Your resume has been uploaded.
              </h2>
              <p className="text-sm text-foreground-muted mb-4">
                S3 URL: <a href={s3Url || ''} target="_blank" rel="noopener noreferrer" className="underline break-all">{s3Url}</a>
              </p>
              <form
                action="https://www.overleaf.com/docs"
                method="post"
                target="_blank"
                className="mt-4"
              >
                <input type="hidden" name="snip_uri" value={overleafUrl} />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-full bg-success bg-success-hover text-white px-6 font-medium transition-colors"
                >
                  Open in Overleaf
                </button>
              </form>
            </div>
          )}
          </div>
        </main>
      </div>
    </ResumeFormProvider>
  );
}

