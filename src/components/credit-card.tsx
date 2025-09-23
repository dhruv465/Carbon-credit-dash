import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Credit } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CreditCardProps {
  credit: Credit;
  onViewDetails?: (credit: Credit) => void;
  onDownloadCertificate?: (credit: Credit) => void;
  className?: string;
}

const CreditCard = React.memo<CreditCardProps>(({ 
  credit, 
  onViewDetails, 
  onDownloadCertificate, 
  className 
}) => {
  const isActive = credit.status === "Active";
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onViewDetails?.(credit);
    }
  };
  
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden cursor-pointer",
        "border-border/50 hover:border-primary/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring",
        "bg-card/50 hover:bg-card backdrop-blur-sm",
        "transition-smooth hover-lift animate-fade-in",
        "hover:shadow-lg hover:shadow-primary/5",
        // Mobile touch optimizations
        "touch-manipulation select-none",
        "active:scale-[0.98] active:shadow-sm",
        "min-h-[200px] sm:min-h-[180px]", // Ensure consistent height
        className
      )}
      onClick={() => onViewDetails?.(credit)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`Carbon credit: ${credit.project_name}, Status: ${credit.status}, Vintage: ${credit.vintage}`}
      aria-describedby={`credit-${credit.unic_id}-details`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle 
            className="text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors-smooth"
            id={`credit-${credit.unic_id}-title`}
          >
            {credit.project_name}
          </CardTitle>
          <Badge 
            variant={isActive ? "default" : "secondary"}
            className={cn(
              "shrink-0 font-medium transition-colors-smooth",
              isActive 
                ? "bg-success/10 text-success border-success/20 hover:bg-success/15 dark:bg-success/20 dark:text-success dark:border-success/30" 
                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
            )}
            aria-label={`Credit status: ${credit.status}`}
          >
            {credit.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-2" id={`credit-${credit.unic_id}-details`}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">UNIC ID:</span>
            <span 
              className="font-mono text-foreground bg-muted/50 px-2 py-1 rounded text-xs"
              aria-label={`Unique identifier: ${credit.unic_id}`}
            >
              {credit.unic_id}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Vintage:</span>
            <span 
              className="font-semibold text-foreground"
              aria-label={`Vintage year: ${credit.vintage}`}
            >
              {credit.vintage}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 gap-2 flex-col sm:flex-row">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-full sm:flex-1 text-xs sm:text-sm font-medium",
            "h-10 sm:h-8", // Larger touch targets on mobile
            "focus-ring-enhanced transition-smooth hover:border-primary/50 hover:text-primary",
            "touch-manipulation active:scale-95"
          )}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onViewDetails?.(credit);
          }}
          aria-label={`View details for ${credit.project_name}`}
          aria-describedby={`credit-${credit.unic_id}-title`}
        >
          View Details
        </Button>
        <Button
          variant="default"
          size="sm"
          className={cn(
            "w-full sm:flex-1 text-xs sm:text-sm font-medium",
            "h-10 sm:h-8", // Larger touch targets on mobile
            "focus-ring-enhanced transition-smooth hover:bg-primary/90 hover:shadow-md",
            "touch-manipulation active:scale-95"
          )}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onDownloadCertificate?.(credit);
          }}
          aria-label={`Download retirement certificate for ${credit.project_name}`}
          aria-describedby={`credit-${credit.unic_id}-title`}
        >
          <span className="hidden sm:inline">Download Certificate</span>
          <span className="sm:hidden">Download</span>
        </Button>
      </CardFooter>

      {/* Enhanced gradient overlay with environmental theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/10 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-primary/5 opacity-0 group-focus-within:opacity-100 transition-smooth pointer-events-none" />
    </Card>
  );
});

CreditCard.displayName = "CreditCard";

export { CreditCard };