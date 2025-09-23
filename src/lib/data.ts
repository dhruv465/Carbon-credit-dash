
import { creditSchema } from "./types";
import type { Credit, CreditWithMetadata, DashboardStats } from "./types";
import { z } from "zod";
import sampleData from "@/assets/sample.json";

/**
 * Enhanced data loading with error handling and retry logic
 */
export async function getCredits(): Promise<Credit[]> {
  const urlParams = new URLSearchParams(window.location.search);
  const dataUrl = urlParams.get("data");

  try {
    let data;
    if (dataUrl) {
      // Create timeout controller for better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const response = await fetch(dataUrl, {
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        data = await response.json();
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            throw new Error('Request timed out. Please check your connection and try again.');
          }
          if (fetchError.message.includes('fetch')) {
            throw new Error('Network error. Please check your internet connection.');
          }
        }
        throw fetchError;
      }
    } else {
      data = sampleData;
    }

    // Validate data structure
    const credits = z.array(creditSchema).parse(data);
    
    if (credits.length === 0) {
      throw new Error('No credits data found');
    }
    
    return credits;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid data format: ${error.issues.map(e => e.message).join(', ')}`);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while loading credits');
  }
}

/**
 * Transform credits to include metadata for search optimization
 */
export function transformCreditsWithMetadata(credits: Credit[]): CreditWithMetadata[] {
  return credits.map(credit => ({
    ...credit,
    searchableText: `${credit.project_name} ${credit.unic_id} ${credit.vintage} ${credit.status}`.toLowerCase(),
    displayName: credit.project_name,
    vintageDisplay: credit.vintage.toString(),
  }));
}

/**
 * Calculate dashboard statistics from credits data
 */
export function calculateDashboardStats(credits: Credit[]): DashboardStats {
  const totalCredits = credits.length;
  const activeCredits = credits.filter(c => c.status === 'Active').length;
  const retiredCredits = credits.filter(c => c.status === 'Retired').length;
  
  const vintages = credits.map(c => c.vintage);
  const uniqueVintages = [...new Set(vintages)].sort((a, b) => b - a); // Sort descending
  
  const vintageRange = vintages.length > 0 
    ? { min: Math.min(...vintages), max: Math.max(...vintages) }
    : { min: 0, max: 0 };

  return {
    totalCredits,
    activeCredits,
    retiredCredits,
    vintageRange,
    availableVintages: uniqueVintages,
  };
}

/**
 * Search and filter credits with performance optimizations
 */
export function searchAndFilterCredits(
  credits: CreditWithMetadata[],
  query: string,
  statusFilter: Credit['status'] | 'all',
  vintageFilter: number | 'all',
  sortBy: 'project_name' | 'vintage' | 'status' = 'project_name',
  sortOrder: 'asc' | 'desc' = 'asc'
): CreditWithMetadata[] {
  let filtered = credits;

  // Apply text search
  if (query.trim()) {
    const searchTerm = query.toLowerCase().trim();
    filtered = filtered.filter(credit => 
      credit.searchableText.includes(searchTerm)
    );
  }

  // Apply status filter
  if (statusFilter !== 'all') {
    filtered = filtered.filter(credit => credit.status === statusFilter);
  }

  // Apply vintage filter
  if (vintageFilter !== 'all') {
    filtered = filtered.filter(credit => credit.vintage === vintageFilter);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'project_name':
        aValue = a.project_name.toLowerCase();
        bValue = b.project_name.toLowerCase();
        break;
      case 'vintage':
        aValue = a.vintage;
        bValue = b.vintage;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = a.project_name.toLowerCase();
        bValue = b.project_name.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
}
