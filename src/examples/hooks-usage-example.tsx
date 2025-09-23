import React from 'react';
import { useCredits, useSearch } from '@/hooks';

/**
 * Example component demonstrating the usage of our custom hooks
 * This shows how the hooks work together for credit management and search
 */
export function HooksUsageExample() {
  // Load credits data with loading states and error handling
  const { credits, stats, loading, error, refetch } = useCredits();
  
  // Set up search and filter functionality with debouncing
  const {
    searchState,
    filteredResults,
    setQuery,
    setStatusFilter,
    setVintageFilter,
    clearFilters,
  } = useSearch(credits);

  if (loading) {
    return <div>Loading credits...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Credits Dashboard</h2>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-semibold">Total Credits</h3>
          <p className="text-2xl">{stats.totalCredits}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-semibold">Active Credits</h3>
          <p className="text-2xl">{stats.activeCredits}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Retired Credits</h3>
          <p className="text-2xl">{stats.retiredCredits}</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search credits..."
          value={searchState.query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <div className="flex gap-4">
          <select
            value={searchState.statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-2 border rounded"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Retired">Retired</option>
          </select>
          
          <select
            value={searchState.vintageFilter}
            onChange={(e) => setVintageFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="p-2 border rounded"
          >
            <option value="all">All Vintages</option>
            {stats.availableVintages.map(vintage => (
              <option key={vintage} value={vintage}>{vintage}</option>
            ))}
          </select>
          
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p>
          Showing {filteredResults.filteredCount} of {filteredResults.totalCount} credits
          {filteredResults.hasActiveFilters && ' (filtered)'}
        </p>
      </div>

      {/* Credits List */}
      <div className="grid gap-4">
        {filteredResults.credits.map(credit => (
          <div key={credit.unic_id} className="border p-4 rounded">
            <h3 className="font-semibold">{credit.displayName}</h3>
            <p className="text-sm text-gray-600">ID: {credit.unic_id}</p>
            <p className="text-sm text-gray-600">Vintage: {credit.vintageDisplay}</p>
            <span className={`inline-block px-2 py-1 rounded text-sm ${
              credit.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {credit.status}
            </span>
          </div>
        ))}
      </div>

      {filteredResults.filteredCount === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No credits found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}