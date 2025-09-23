import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Search bar component with real-time filtering capabilities
 * Addresses requirements: 3.1, 3.2, 3.3, 6.3 (performance optimization with React.memo)
 */
const SearchBar = React.memo<SearchBarProps>(({ 
  value, 
  onChange, 
  placeholder = "Search credits by name or ID...",
  className = ""
}) => {
  const handleClear = () => {
    onChange("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && value) {
      handleClear();
    }
  };

  return (
    <div className={`relative ${className}`} role="search">
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 sm:h-4 sm:w-4" 
        aria-hidden="true"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "pl-12 sm:pl-10 pr-12 sm:pr-10",
          "focus-ring-enhanced transition-smooth border-border/50 hover:border-primary/30 focus:border-primary",
          "text-base sm:text-sm", // Larger text on mobile to prevent zoom
          "touch-manipulation" // Optimize for touch
        )}
        aria-label="Search carbon credits by project name or UNIC ID"
        aria-describedby="search-help"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      <div id="search-help" className="sr-only">
        Type to search credits by project name or UNIC ID. Press Escape to clear search.
      </div>
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className={cn(
            "absolute right-1 top-1/2 transform -translate-y-1/2",
            "h-10 w-10 sm:h-8 sm:w-8 p-0", // Larger touch target on mobile
            "hover:bg-muted focus-ring-enhanced transition-smooth hover:text-primary",
            "touch-manipulation active:scale-95"
          )}
          aria-label={`Clear search query: ${value}`}
        >
          <X className="h-5 w-5 sm:h-4 sm:w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export { SearchBar };