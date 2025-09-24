import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const CreditCard = React.memo<CreditCardProps>(
  ({ credit, onViewDetails, onDownloadCertificate, className }) => {
    const isActive = credit.status === "Active";

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onViewDetails?.(credit);
      }
    };

    return (
      <Card
        className={cn(
          "group relative overflow-hidden",
          "border border-border/40 hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          "bg-card hover:bg-card/90 backdrop-blur-sm",
          "transition-all duration-200 ease-out",
          "hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-0.5",
          // Mobile touch optimizations
          "touch-manipulation select-none",
          "active:scale-[0.98]",
          // Better height management - min height with flexible growth
          "min-h-[260px] flex flex-col",
          // Explicit cursor pointer
          "cursor-pointer",
          // Modern rounded corners
          "rounded-lg",
          className
        )}
        onClick={() => onViewDetails?.(credit)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="article"
        aria-label={`Carbon credit: ${credit.project_name}, Status: ${credit.status}, Vintage: ${credit.vintage}`}
        aria-describedby={`credit-${credit.unic_id}-details`}
        style={{ cursor: "pointer" }}
      >
        {/* Clean header with proper spacing */}
        <CardHeader className="p-4 pb-2 flex-shrink-0">
          <div className="flex items-start justify-between gap-2">
            <CardTitle
              className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 flex-1 pr-2"
              id={`credit-${credit.unic_id}-title`}
              title={credit.project_name}
            >
              {credit.project_name}
            </CardTitle>
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={cn(
                "shrink-0 font-medium text-xs px-2 py-0.5 rounded-full",
                isActive
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-700"
                  : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
              )}
              aria-label={`Credit status: ${credit.status}`}
            >
              {credit.status}
            </Badge>
          </div>
        </CardHeader>

        {/* Content with clean spacing */}
        <CardContent className="px-4 pb-2 flex-1 flex flex-col justify-center">
          <div className="space-y-2.5" id={`credit-${credit.unic_id}-details`}>
            <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-md">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                UNIC ID
              </span>
              <span
                className="font-mono text-xs text-foreground font-medium max-w-[100px] truncate"
                aria-label={`Unique identifier: ${credit.unic_id}`}
                title={credit.unic_id}
              >
                {credit.unic_id.split("-").pop() || credit.unic_id}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-md">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Vintage
              </span>
              <span
                className="text-sm font-bold text-foreground"
                aria-label={`Vintage year: ${credit.vintage}`}
              >
                {credit.vintage}
              </span>
            </div>
          </div>
        </CardContent>

        {/* Clean footer with horizontal buttons - guaranteed to be visible */}
        <CardFooter className="p-4 pt-3 flex-shrink-0 mt-auto">
          <div className="flex gap-2 w-full">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex-1 text-xs font-medium",
                "h-9 px-3",
                "hover:bg-muted/50 hover:text-foreground",
                "transition-colors duration-200",
                "cursor-pointer rounded-md"
              )}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onViewDetails?.(credit);
              }}
              aria-label={`View details for ${credit.project_name}`}
              style={{ cursor: "pointer" }}
            >
              Details
            </Button>
            <Button
              variant="default"
              size="sm"
              className={cn(
                "flex-1 text-xs font-medium",
                "h-9 px-3",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "transition-colors duration-200",
                "cursor-pointer rounded-md"
              )}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDownloadCertificate?.(credit);
              }}
              aria-label={`Download retirement certificate for ${credit.project_name}`}
              style={{ cursor: "pointer" }}
            >
              Certificate
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
);

CreditCard.displayName = "CreditCard";

export { CreditCard };
