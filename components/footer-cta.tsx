import Button from './button';

interface FooterCTAProps {
  className?: string;
}

export default function FooterCTA({ className = '' }: FooterCTAProps) {
  return (
    <section className={`py-20 px-8 bg-background-secondary ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Green Dot Message */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-foreground-muted uppercase tracking-wider">
            We're here to help
          </span>
        </div>

        {/* Large Italic Serif Text */}
        <h2 className="text-5xl md:text-6xl font-serif italic text-center text-foreground mb-8">
          Are you ready?
        </h2>

        {/* CTA Button */}
        <div className="flex justify-center mb-12">
          <Button href="/resume-builder" variant="primary" className="text-lg px-10 py-4">
            Start Building Your Resume
          </Button>
        </div>

        {/* Contact & Additional Info */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-8 border-t border-border">
          <div className="text-center md:text-left">
            <p className="text-sm text-foreground-muted mb-2">Have questions?</p>
            <a
              href="mailto:support@resumemaker.com"
              className="text-foreground hover:text-foreground-muted transition-colors font-medium"
            >
              support@resumemaker.com
            </a>
          </div>
          <div className="hidden md:block w-px h-12 bg-border"></div>
          <div className="text-center md:text-left">
            <p className="text-sm text-foreground-muted mb-2">Need help?</p>
            <a
              href="/contact"
              className="text-foreground hover:text-foreground-muted transition-colors font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

