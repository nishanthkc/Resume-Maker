'use client';

import Button from '@/components/button';
import LogoStrip from '@/components/logo-strip';
import ProcessSection from '@/components/process-section';
import FAQSection from '@/components/faq-section';
import FooterCTA from '@/components/footer-cta';

export default function Home() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <main className="flex min-h-screen items-center justify-center w-full max-w-6xl mx-auto py-16 px-8">
        <div className="w-full max-w-4xl text-center space-y-8">
          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tight text-foreground">
            The truly <span className="serif-highlight">Limitless</span> resume builder.
          </h1>
          
          {/* Subtext Paragraph */}
          <p className="text-xl md:text-2xl leading-8 text-foreground-muted max-w-2xl mx-auto">
          Say goodbye to expensive career coaches, and hello to limitless, lightning fast resume tailoring.
          </p>
          
          {/* CTA Button */}
          <div className="pt-4">
            <Button href="/resume-builder" variant="primary" className="text-base px-8 py-3">
              Start Building
            </Button>
          </div>
          
          {/* Logo Strip */}
          <div className="pt-12">
            <LogoStrip />
          </div>
        </div>
      </main>

      {/* Process Section */}
      <section id="about">
        <ProcessSection />
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <FAQSection />
      </section>

      {/* Footer CTA */}
      <FooterCTA />
    </div>
  );
}
