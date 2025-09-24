
import { Leaf } from "lucide-react";
import { ThemeToggle } from "../theme/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        {/* Logo and Brand - Hidden on desktop since it's in sidebar */}
        <div className="flex items-center space-x-4 md:hidden">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">EcoOffset</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Carbon Management</span>
            </div>
          </div>
        </div>

        {/* Desktop: Just show page title */}
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
