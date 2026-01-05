import Link from 'next/link';
import Button from '@/components/button';

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          Authentication Error
        </h1>
        <p className="text-foreground-muted">
          There was a problem signing you in. Please try again.
        </p>
        <div className="pt-4">
          <Button href="/" variant="primary">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}

