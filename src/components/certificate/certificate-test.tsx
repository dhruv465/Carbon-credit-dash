import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CertificateDialog } from "./certificate-dialog";
import type { Credit } from "@/lib/types";

// Sample credit for testing
const sampleCredit: Credit = {
  unic_id: "UNIC-VCS-IND-2023-4F7A8C1B",
  project_name: "Mangrove Restoration Project",
  vintage: 2023,
  status: "Active"
};

export function CertificateTest() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">Certificate Generation Test</h2>
      <p className="text-gray-600">
        Test the certificate generation system with a sample credit.
      </p>
      
      <Button onClick={() => setIsDialogOpen(true)}>
        Open Certificate Preview
      </Button>

      <CertificateDialog
        credit={sampleCredit}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}