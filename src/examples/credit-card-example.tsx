import { CreditCard } from "@/components/credit-card";
import { CreditGrid } from "@/components/credit-grid";
import { CreditStatusBadge } from "@/components/credit-status-badge";
import type { Credit } from "@/lib/types";

// Sample data for testing
const sampleCredits: Credit[] = [
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
  },
  {
    unic_id: "UNIC-VCS-IND-2021-9D4E7F8G",
    project_name: "Wind Farm Rajasthan",
    vintage: 2021,
    status: "Active"
  }
];

export function CreditCardExample() {
  const handleViewDetails = (credit: Credit) => {
    console.log("View details for:", credit.project_name);
  };

  const handleDownloadCertificate = (credit: Credit) => {
    console.log("Download certificate for:", credit.project_name);
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Credit Card Components</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Individual Credit Card</h3>
            <div className="max-w-sm">
              <CreditCard
                credit={sampleCredits[0]}
                onViewDetails={handleViewDetails}
                onDownloadCertificate={handleDownloadCertificate}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Status Badges</h3>
            <div className="flex gap-4">
              <CreditStatusBadge status="Active" />
              <CreditStatusBadge status="Retired" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Responsive Credit Grid</h3>
            <CreditGrid
              credits={sampleCredits}
              onViewDetails={handleViewDetails}
              onDownloadCertificate={handleDownloadCertificate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}