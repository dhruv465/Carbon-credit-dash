import { Card, CardContent } from "../ui/card";
import type { DashboardStats } from "../../lib/types";

interface DashboardHeaderProps {
  stats: DashboardStats;
  loading?: boolean;
}

export function DashboardHeader({ stats, loading = false }: DashboardHeaderProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <header className="space-y-6 animate-fade-in" role="banner">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground transition-colors-smooth">
          Carbon Credits Dashboard
        </h1>
        <p className="text-muted-foreground transition-colors-smooth">
          Manage and track your carbon offset portfolio with transparency and ease.
        </p>
      </div>
      
      <section 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up"
        aria-label="Dashboard statistics"
      >
        <Card role="region" aria-labelledby="total-credits-label" className="hover-lift transition-smooth">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p id="total-credits-label" className="text-sm font-medium text-muted-foreground">Total Credits</p>
              <p className="text-2xl font-bold text-foreground transition-colors-smooth" aria-describedby="total-credits-label">
                {stats.totalCredits.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card role="region" aria-labelledby="active-credits-label" className="hover-lift transition-smooth">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p id="active-credits-label" className="text-sm font-medium text-muted-foreground">Active Credits</p>
              <p className="text-2xl font-bold text-success transition-colors-smooth" aria-describedby="active-credits-label">
                {stats.activeCredits.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card role="region" aria-labelledby="retired-credits-label" className="hover-lift transition-smooth">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p id="retired-credits-label" className="text-sm font-medium text-muted-foreground">Retired Credits</p>
              <p className="text-2xl font-bold text-muted-foreground transition-colors-smooth" aria-describedby="retired-credits-label">
                {stats.retiredCredits.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card role="region" aria-labelledby="vintage-range-label" className="hover-lift transition-smooth">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p id="vintage-range-label" className="text-sm font-medium text-muted-foreground">Vintage Range</p>
              <p className="text-2xl font-bold text-foreground transition-colors-smooth" aria-describedby="vintage-range-label">
                {stats.vintageRange.min === stats.vintageRange.max 
                  ? stats.vintageRange.min 
                  : `${stats.vintageRange.min}-${stats.vintageRange.max}`}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </header>
  );
}