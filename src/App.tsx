
import { useState, useMemo, useCallback, useEffect } from "react";
import type { Credit } from "./lib/types";
import { useCredits, useSearch } from "./hooks";
import { NetworkMonitor } from "./lib/error-handling";
import { columns } from "./components/data-table/columns";
import { DataTable } from "./components/data-table/data-table";
import { Header } from "./components/layout/header";
import { CreditDetailsDialog } from "./components/credit-details-dialog";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { CreditGrid } from "./components/credit-grid";
import { VirtualCreditGrid } from "./components/virtual-credit-grid";
import { CertificateDialog } from "./components/certificate/certificate-dialog";
import { SearchFilters } from "./components/search/search-filters";
import { PerformanceMonitor } from "./components/performance-monitor";
import { 
  DashboardLayout, 
  DashboardSection, 
  DashboardHeader 
} from "./components/dashboard";
import { EnhancedErrorBoundary, GlobalErrorHandler } from "./components/error/global-error-handler";
import { DashboardLoading } from "./components/dashboard/loading-states";
import { cn } from "./lib/utils";

// Import accessibility checker for development
import "./lib/accessibility-checker";

function App() {
  const { credits, stats, loading, error, refetch, retryCount } = useCredits();
  const { 
    searchState, 
    filteredResults, 
    setQuery, 
    setStatusFilter, 
    setVintageFilter, 
    clearFilters 
  } = useSearch(credits);
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
  const [certificateCredit, setCertificateCredit] = useState<Credit | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [isOnline, setIsOnline] = useState(true);

  // Initialize network monitoring
  useEffect(() => {
    const networkMonitor = NetworkMonitor.getInstance();
    const unsubscribe = networkMonitor.addListener(setIsOnline);
    setIsOnline(networkMonitor.getStatus());

    // Listen for retry events
    const handleRetry = (event: CustomEvent) => {
      if (event.detail.context?.component === 'useCredits') {
        refetch();
      }
    };

    window.addEventListener('error-retry', handleRetry as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('error-retry', handleRetry as EventListener);
    };
  }, [refetch]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleViewDetails = useCallback((credit: Credit) => {
    setSelectedCredit(credit);
  }, []);

  const handleDownloadCertificate = useCallback((credit: Credit) => {
    setCertificateCredit(credit);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedCredit(null);
  }, []);

  const handleCloseCertificate = useCallback(() => {
    setCertificateCredit(null);
  }, []);

  const handleViewModeChange = useCallback((mode: 'table' | 'cards') => {
    setViewMode(mode);
  }, []);

  // Determine if virtual scrolling should be used for large datasets
  const shouldUseVirtualScrolling = useMemo(() => {
    return filteredResults.credits.length > 100;
  }, [filteredResults.credits.length]);

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-destructive">Error Loading Dashboard</h2>
            <p className="text-muted-foreground">{error}</p>
            
            {!isOnline && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                <p className="text-yellow-800">
                  You appear to be offline. Please check your internet connection.
                </p>
              </div>
            )}
            
            {retryCount > 0 && (
              <p className="text-sm text-muted-foreground">
                Retry attempt: {retryCount}
              </p>
            )}
            
            <div className="flex gap-2 justify-center">
              <button 
                onClick={refetch}
                disabled={loading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth hover:shadow-md focus-ring-enhanced disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Retrying...' : 'Try Again'}
              </button>
              
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-smooth hover:shadow-md focus-ring-enhanced"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <EnhancedErrorBoundary>
      <GlobalErrorHandler />
      <div className="min-h-screen bg-background">
        {/* Skip Links for keyboard navigation */}
        <div className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:p-2 focus:rounded">
          <a href="#main-content" className="mr-4 underline">Skip to main content</a>
          <a href="#search-section" className="underline">Skip to search</a>
        </div>
        
        <Header />
        <main role="main" aria-label="Carbon Credits Dashboard" id="main-content">
          <DashboardLayout>
            <DashboardSection>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <DashboardHeader stats={stats} loading={loading} />
                <div className="flex gap-2 animate-fade-in self-start sm:self-auto" role="group" aria-label="View mode selection">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleViewModeChange('cards')}
                    className={cn(
                      "h-10 sm:h-9 px-4 text-sm font-medium",
                      "focus-ring-enhanced transition-smooth hover:shadow-md",
                      "touch-manipulation active:scale-95"
                    )}
                    aria-pressed={viewMode === 'cards'}
                    aria-label="Switch to card view"
                  >
                    <span className="hidden sm:inline">Card View</span>
                    <span className="sm:hidden">Cards</span>
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleViewModeChange('table')}
                    className={cn(
                      "h-10 sm:h-9 px-4 text-sm font-medium",
                      "focus-ring-enhanced transition-smooth hover:shadow-md",
                      "touch-manipulation active:scale-95"
                    )}
                    aria-pressed={viewMode === 'table'}
                    aria-label="Switch to table view"
                  >
                    <span className="hidden sm:inline">Table View</span>
                    <span className="sm:hidden">Table</span>
                  </Button>
                </div>
              </div>
            </DashboardSection>
            
            <DashboardSection>
              {!loading && (
                <SearchFilters
                  searchState={searchState}
                  onSearch={setQuery}
                  onFilterStatus={setStatusFilter}
                  onFilterVintage={setVintageFilter}
                  onClearFilters={clearFilters}
                  availableVintages={stats.availableVintages}
                  resultCount={filteredResults.filteredCount}
                  totalCount={filteredResults.totalCount}
                  className="mb-4 sm:mb-6"
                />
              )}
              
              {loading ? (
                <DashboardLoading />
              ) : viewMode === 'cards' ? (
                shouldUseVirtualScrolling ? (
                  <VirtualCreditGrid
                    credits={filteredResults.credits}
                    onViewDetails={handleViewDetails}
                    onDownloadCertificate={handleDownloadCertificate}
                    hasActiveFilters={filteredResults.hasActiveFilters}
                    onClearFilters={clearFilters}
                    searchQuery={searchState.query}
                    enableVirtualScrolling={true}
                    virtualScrollThreshold={100}
                  />
                ) : (
                  <CreditGrid
                    credits={filteredResults.credits}
                    onViewDetails={handleViewDetails}
                    onDownloadCertificate={handleDownloadCertificate}
                    hasActiveFilters={filteredResults.hasActiveFilters}
                    onClearFilters={clearFilters}
                    searchQuery={searchState.query}
                  />
                )
              ) : (
                <DataTable 
                  columns={columns(handleViewDetails)} 
                  data={filteredResults.credits}
                  allData={credits}
                  stats={stats}
                />
              )}
            </DashboardSection>
          </DashboardLayout>
        </main>
        
        <CreditDetailsDialog 
          credit={selectedCredit} 
          isOpen={!!selectedCredit}
          onClose={handleCloseDetails} 
        />
        
        <CertificateDialog
          credit={certificateCredit}
          isOpen={!!certificateCredit}
          onClose={handleCloseCertificate}
        />
        
        <Toaster />
        
        {/* Performance monitoring in development */}
        <PerformanceMonitor 
          componentName="App" 
          enabled={process.env.NODE_ENV === 'development'}
        />
      </div>
    </EnhancedErrorBoundary>
  );
}

export default App;

