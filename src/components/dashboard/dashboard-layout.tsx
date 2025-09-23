import React from "react";
import { cn } from "../../lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-6 sm:space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}

interface DashboardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({ children, className }: DashboardSectionProps) {
  return (
    <section className={cn("space-y-4 sm:space-y-6", className)}>
      {children}
    </section>
  );
}

interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function DashboardGrid({ 
  children, 
  className,
  columns = { default: 1, sm: 2, lg: 3, xl: 4 }
}: DashboardGridProps) {
  const gridClasses = [
    "grid gap-6",
    `grid-cols-${columns.default || 1}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
  ].filter(Boolean).join(" ");

  return (
    <div className={cn(gridClasses, className)}>
      {children}
    </div>
  );
}