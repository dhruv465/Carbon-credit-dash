
import { z } from "zod";

export const creditSchema = z.object({
  unic_id: z.string(),
  project_name: z.string(),
  vintage: z.number(),
  status: z.enum(["Active", "Retired"]),
});

export type Credit = z.infer<typeof creditSchema>;

// Extended interface for internal use with search optimization
export interface CreditWithMetadata extends Credit {
  searchableText: string;    // Combined searchable content
  displayName: string;       // Formatted display name
  vintageDisplay: string;    // Formatted vintage display
}

// Search and filter state interfaces
export interface SearchState {
  query: string;
  statusFilter: Credit['status'] | 'all';
  vintageFilter: number | 'all';
  sortBy: 'project_name' | 'vintage' | 'status';
  sortOrder: 'asc' | 'desc';
}

export interface FilteredResults {
  credits: CreditWithMetadata[];
  totalCount: number;
  filteredCount: number;
  hasActiveFilters: boolean;
}

// Dashboard statistics interface
export interface DashboardStats {
  totalCredits: number;
  activeCredits: number;
  retiredCredits: number;
  vintageRange: { min: number; max: number };
  availableVintages: number[];
}

// Hook return types
export interface UseCreditsReturn {
  credits: CreditWithMetadata[];
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  retryCount: number;
}

export interface UseSearchReturn {
  searchState: SearchState;
  filteredResults: FilteredResults;
  setQuery: (query: string) => void;
  setStatusFilter: (status: Credit['status'] | 'all') => void;
  setVintageFilter: (vintage: number | 'all') => void;
  setSortBy: (sortBy: SearchState['sortBy']) => void;
  setSortOrder: (sortOrder: SearchState['sortOrder']) => void;
  clearFilters: () => void;
}
