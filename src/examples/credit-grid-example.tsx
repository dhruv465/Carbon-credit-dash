import { useState } from "react";
import { CreditGrid, CreditGridSkeleton } from "@/components";
import { SearchFilters } from "@/components/search";
import { useCredits, useSearch } from "@/hooks";
import type { Credit } from "@/lib/types";

/**
 * Example component demonstrating the enhanced CreditGrid with search and pagination
 * Shows how to integrate all the components built in task 5
 */
export function CreditGridExample() {
  const { credits, stats, loading, error } = useCredits();
  const search = useSearch(credits);
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);

  const handleViewDetails = (credit: Credit) => {
    setSelectedCredit(credit);
    console.log('View details for:', credit.project_name);
  };

  const handleDownloadCertificate = (credit: Credit) => {
    console.log('Download certificate for:', credit.project_name);
    // Certificate download logic would go here
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Credits</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Carbon Credits Dashboard</h1>
        <p className="text-muted-foreground">
          Enhanced grid with search, filtering, and pagination
        </p>
      </div>

      {/* Search and Filter Controls */}
      <SearchFilters
        searchState={search.searchState}
        onSearch={search.setQuery}
        onFilterStatus={search.setStatusFilter}
        onFilterVintage={search.setVintageFilter}
        onClearFilters={search.clearFilters}
        availableVintages={stats.availableVintages}
        resultCount={search.filteredResults.filteredCount}
        totalCount={search.filteredResults.totalCount}
      />

      {/* Credit Grid with Loading State */}
      {loading ? (
        <CreditGridSkeleton count={12} />
      ) : (
        <CreditGrid
          credits={search.filteredResults.credits}
          onViewDetails={handleViewDetails}
          onDownloadCertificate={handleDownloadCertificate}
          hasActiveFilters={search.filteredResults.hasActiveFilters}
          onClearFilters={search.clearFilters}
          searchQuery={search.searchState.query}
          itemsPerPage={12}
        />
      )}

      {/* Simple modal for demonstration */}
      {selectedCredit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">{selectedCredit.project_name}</h3>
            <div className="space-y-2 text-sm">
              <p><strong>UNIC ID:</strong> {selectedCredit.unic_id}</p>
              <p><strong>Vintage:</strong> {selectedCredit.vintage}</p>
              <p><strong>Status:</strong> {selectedCredit.status}</p>
            </div>
            <button
              onClick={() => setSelectedCredit(null)}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}