
import { Badge } from "@/components/ui/badge";
import type { Credit } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CreditStatusBadgeProps {
  status: Credit["status"];
  className?: string;
}

export function CreditStatusBadge({ status, className }: CreditStatusBadgeProps) {
  const isActive = status === "Active";
  
  return (
    <Badge 
      variant={isActive ? "default" : "secondary"}
      className={cn(
        "font-medium",
        isActive 
          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" 
          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700",
        className
      )}
    >
      {status}
    </Badge>
  );
}
