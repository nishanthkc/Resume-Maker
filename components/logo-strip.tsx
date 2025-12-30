interface LogoStripProps {
  companies?: string[];
  className?: string;
}

export default function LogoStrip({ 
  companies = ['Google', 'Amazon', 'Netflix', 'Spotify', 'Stripe'],
  className = '' 
}: LogoStripProps) {
  return (
    <div className={`flex items-center justify-center gap-12 ${className}`}>
      {companies.map((company, index) => (
        <div
          key={index}
          className="text-foreground-muted text-3xl font-bold grayscale opacity-40 hover:opacity-60 transition-opacity"
        >
          {company}
        </div>
      ))}
    </div>
  );
}

