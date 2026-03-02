import { cn } from "@/lib/utils";
import { Activity, Heart, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.brand_link"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary shadow-medical">
              <Heart className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Health<span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              data-ocid="nav.patient_link"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                location.pathname === "/"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Patient Assessment</span>
              <span className="sm:hidden">Assess</span>
            </Link>

            <Link
              to="/admin"
              data-ocid="nav.admin_link"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                location.pathname === "/admin"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
              <span className="sm:hidden">Admin</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
