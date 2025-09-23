
"use client";

import { useState, useRef } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useVirtualizer } from '@tanstack/react-virtual';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { CreditFilters } from '../credit-filters';
import { EmptyState } from '../search/empty-state';
import type { CreditWithMetadata, DashboardStats } from "@/lib/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  allData?: CreditWithMetadata[];
  stats?: DashboardStats;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  allData,
  stats,
}: DataTableProps<TData, TValue>) {
  const [filteredData, setFilteredData] = useState<TData[]>(data);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35, // Adjust this to your estimated row height
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  const handleFilteredResults = (filtered: CreditWithMetadata[]) => {
    setFilteredData(filtered as TData[]);
  };

  const [clearFiltersFunction, setClearFiltersFunction] = useState<(() => void) | null>(null);

  const handleSearchStateChange = (hasFilters: boolean, query: string, clearFilters: () => void) => {
    setHasActiveFilters(hasFilters);
    setSearchQuery(query);
    setClearFiltersFunction(() => clearFilters);
  };

  const handleClearFilters = () => {
    if (clearFiltersFunction) {
      clearFiltersFunction();
    }
  };

  return (
    <div role="region" aria-label="Carbon credits data table">
      {allData && stats && (
        <CreditFilters 
          credits={allData} 
          stats={stats}
          onFilteredResults={handleFilteredResults}
          onSearchStateChange={handleSearchStateChange}
        />
      )}
      <div 
        ref={tableContainerRef} 
        className='rounded-md border h-[600px] overflow-auto'
        role="region"
        aria-label="Scrollable table content"
        tabIndex={0}
      >
        <Table role="table" aria-label={`Carbon credits table with ${rows.length} rows`}>
          <TableHeader className='sticky top-0 bg-background'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} role="row">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id}
                      role="columnheader"
                      scope="col"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {paddingTop > 0 && (
              <TableRow>
                <TableCell style={{ height: `${paddingTop}px` }} />
              </TableRow>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 data-[state=selected]:bg-muted focus-within:bg-muted/30"
                  role="row"
                  tabIndex={-1}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell 
                      key={cell.id}
                      role="gridcell"
                      tabIndex={cellIndex === 0 ? 0 : -1}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {paddingBottom > 0 && (
                <TableRow>
                    <TableCell style={{ height: `${paddingBottom}px` }} />
                </TableRow>
            )}
            {rows.length === 0 && (
                <TableRow>
                    <TableCell colSpan={columns.length} className="p-0">
                        <EmptyState 
                          hasActiveFilters={hasActiveFilters}
                          onClearFilters={handleClearFilters}
                          searchQuery={searchQuery}
                        />
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <nav 
        className="flex items-center justify-end space-x-2 py-4"
        role="navigation"
        aria-label="Table pagination"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Go to previous page"
          aria-disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Go to next page"
          aria-disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </nav>
    </div>
  );
}
