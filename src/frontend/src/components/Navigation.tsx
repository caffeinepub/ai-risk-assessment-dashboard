import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Heart,
  Loader2,
  LogIn,
  LogOut,
  Shield,
  UserCheck,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Navigation() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { identity, login, clear, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const isLoggedIn = !!identity;

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

          {/* Nav Links + Auth */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              data-ocid="nav.patient_link"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                pathname === "/"
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
                pathname === "/admin"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
              <span className="sm:hidden">Admin</span>
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-border mx-1 hidden sm:block" />

            {/* Auth Button */}
            {isInitializing ? (
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="gap-2 text-muted-foreground"
                data-ocid="nav.auth_loading_state"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Loading...</span>
              </Button>
            ) : isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div
                  data-ocid="nav.logged_in_badge"
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Logged In
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  data-ocid="nav.logout_button"
                  className="gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="nav.login_button"
                className="gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Connecting...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Login</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
