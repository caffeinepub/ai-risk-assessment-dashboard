import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utmUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border bg-card mt-auto py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-display font-semibold text-foreground">
              HealthAI
            </span>
            <span>— AI-Powered Health Risk Assessment</span>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            &copy; {year}. Built with{" "}
            <Heart className="w-3.5 h-3.5 text-destructive fill-current" />{" "}
            using{" "}
            <a
              href={utmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
