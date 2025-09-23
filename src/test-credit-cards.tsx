import React from 'react';
import { CreditCard } from './components/credit-card';
import { CreditGrid } from './components/credit-grid';
import { CreditStatusBadge } from './components/credit-status-badge';
import type { Credit } from './lib/types';

// Test data
const testCredits: Credit[] = [
  {
    unic_id: "UNIC-VCS-IND-2023-4F7A8C1B",
    project_name: "Mangrove Restoration Project",
    vintage: 2023,
    status: "Active"
  },
  {
    unic_id: "UNIC-GS-IND-2022-8A1B2C3D",
    project_name: "Solar Power Plant Maharashtra",
    vintage: 2022,
    status: "Retired"
  }
];

export function TestCreditCards() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Credit Card Components Test</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Status Badges</h2>
          <div className="flex gap-4">
            <CreditStatusBadge status="Active" />
            <CreditStatusBadge status="Retired" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Individual Credit Card</h2>
          <div className="max-w-sm">
            <CreditCard
              credit={testCredits[0]}
              onViewDetails={(credit) => console.log('View details:', credit)}
              onDownloadCertificate={(credit) => console.log('Download certificate:', credit)}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Credit Grid (Responsive)</h2>
          <CreditGrid
            credits={testCredits}
            onViewDetails={(credit) => console.log('View details:', credit)}
            onDownloadCertificate={(credit) => console.log('Download certificate:', credit)}
          />
        </div>
      </div>
    </div>
  );
}