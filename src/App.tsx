
import { useState, useMemo, useCallback, useEffect } from "react";
import type { Credit } from "./lib/types";
import { useCredits, useSearch } from "./hooks";
import { NetworkMonitor } from "./lib/error-handling";
import { columns } from "./components/data-table/columns";
import { DataTable } from "./components/data-table/data-table";

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
import { ThemeProvider } from "./components/theme/theme-provider";
import { Activity, Loader2 } from "lucide-react";
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
      <ThemeProvider defaultTheme="system" storageKey="eco-offset-theme">
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center space-y-6 max-w-lg mx-auto p-8">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <Activity className="h-8 w-8 text-destructive" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-destructive">Dashboard Error</h2>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
              
              {!isOnline && (
                <div className="bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    You appear to be offline. Please check your internet connection.
                  </p>
                </div>
              )}
              
              {retryCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  Retry attempt: {retryCount}
                </p>
              )}
              
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={refetch}
                  disabled={loading}
                  className="min-w-[120px] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    'Try Again'
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="cursor-pointer"
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="eco-offset-theme">
      <EnhancedErrorBoundary>
        <GlobalErrorHandler />
        <div className="min-h-screen">
          {/* Skip Links for keyboard navigation */}
          <div className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:p-2 focus:rounded">
            <a href="#main-content" className="mr-4 underline">Skip to main content</a>
            <a href="#search-section" className="underline">Skip to search</a>
          </div>
          
          <DashboardLayout>
            {/* Dashboard Header Section */}
            <DashboardSection>
              <DashboardHeader stats={stats} loading={loading} />
            </DashboardSection>

            {/* View Mode Controls */}
            <DashboardSection>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold">Credit Portfolio</h2>
                  {!loading && (
                    <span className="text-sm text-muted-foreground">
                      {filteredResults.filteredCount} of {filteredResults.totalCount} credits
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2 animate-fade-in" role="group" aria-label="View mode selection">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleViewModeChange('cards')}
                    className={cn(
                      "h-9 px-4 text-sm font-medium",
                      "focus-ring-enhanced transition-smooth hover:shadow-md",
                      "touch-manipulation active:scale-95"
                    )}
                    aria-pressed={viewMode === 'cards'}
                    aria-label="Switch to card view"
                  >
                    Card View
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleViewModeChange('table')}
                    className={cn(
                      "h-9 px-4 text-sm font-medium",
                      "focus-ring-enhanced transition-smooth hover:shadow-md",
                      "touch-manipulation active:scale-95"
                    )}
                    aria-pressed={viewMode === 'table'}
                    aria-label="Switch to table view"
                  >
                    Table View
                  </Button>
                </div>
              </div>
            </DashboardSection>
            
            {/* Search and Filters */}
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
                />
              )}
            </DashboardSection>

            {/* Main Content */}
            <DashboardSection>
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
          

        </div>
      </EnhancedErrorBoundary>
    </ThemeProvider>
  );
}

export default App;

