import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Credit } from "@/lib/types";

interface FilterDropdownProps {
  label: string;
  value: string | number | 'all';
  options: Array<{ value: string | number | 'all'; label: string }>;
  onChange: (value: string | number | 'all') => void;
  className?: string;
}

/**
 * Generic filter dropdown component for status and vintage filtering
 * Addresses requirements: 3.2, 3.4, 3.5, 6.3 (performance optimization with React.memo)
 */
const FilterDropdown = React.memo<FilterDropdownProps>(({ 
  label, 
  value, 
  options, 
  onChange, 
  className = "" 
}) => {
  const hasActiveFilter = value !== 'all';
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`justify-between focus-ring-enhanced transition-smooth hover:border-primary/50 hover:text-primary touch-manipulation active:scale-95 ${className}`}
          aria-label={`Filter by ${label.toLowerCase()}. Current selection: ${selectedOption?.label || 'All'}`}
          aria-expanded="false"
          aria-haspopup="menu"
        >
          <span className="flex items-center gap-2">
            {label}
            {hasActiveFilter && (
              <Badge 
                variant="secondary" 
                className="ml-1 px-1 py-0 text-xs bg-primary/10 text-primary border-primary/20 transition-colors-smooth"
                aria-label="1 filter applied"
              >
                1
              </Badge>
            )}
          </span>
          <ChevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-48 sm:w-56 animate-scale-in max-h-60 overflow-y-auto"
        role="menu"
        aria-label={`${label} filter options`}
        sideOffset={4}
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex items-center justify-between focus:bg-accent focus:text-accent-foreground transition-colors-smooth hover:bg-primary/5 h-10 sm:h-9 text-base sm:text-sm touch-manipulation"
            role="menuitem"
            aria-selected={value === option.value}
          >
            <span>{option.label}</span>
            {value === option.value && (
              <Check className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

FilterDropdown.displayName = "FilterDropdown";

interface StatusFilterProps {
  value: Credit['status'] | 'all';
  onChange: (value: Credit['status'] | 'all') => void;
  className?: string;
}

/**
 * Status filter dropdown component
 * Addresses requirements: 3.2, 3.4, 6.3 (performance optimization with React.memo)
 */
const StatusFilter = React.memo<StatusFilterProps>(({ value, onChange, className }) => {
  const statusOptions = [
    { value: 'all' as const, label: 'All Status' },
    { value: 'Active' as const, label: 'Active' },
    { value: 'Retired' as const, label: 'Retired' },
  ];

  return (
    <FilterDropdown
      label="Status"
      value={value}
      options={statusOptions}
      onChange={onChange}
      className={className}
    />
  );
});

StatusFilter.displayName = "StatusFilter";

interface VintageFilterProps {
  value: number | 'all';
  onChange: (value: number | 'all') => void;
  availableVintages: number[];
  className?: string;
}

/**
 * Vintage filter dropdown component
 * Addresses requirements: 3.2, 3.4, 6.3 (performance optimization with React.memo)
 */
const VintageFilter = React.memo<VintageFilterProps>(({ 
  value, 
  onChange, 
  availableVintages, 
  className 
}) => {
  const vintageOptions = [
    { value: 'all' as const, label: 'All Vintages' },
    ...availableVintages.map(vintage => ({
      value: vintage,
      label: vintage.toString(),
    })),
  ];

  return (
    <FilterDropdown
      label="Vintage"
      value={value}
      options={vintageOptions}
      onChange={(val) => onChange(val as number | 'all')}
      className={className}
    />
  );
});

VintageFilter.displayName = "VintageFilter";

export { FilterDropdown, StatusFilter, VintageFilter };