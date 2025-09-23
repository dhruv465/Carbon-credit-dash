import React from 'react';
import { CertificateCard } from './components/certificate/certificate-card';
import { CertificateDialog } from './components/certificate/certificate-dialog';
import { downloadCertificateAsPDF, downloadCertificateAsHTML } from './components/certificate/download-certificate';
import type { Credit } from './lib/types';

// Test data
const testCredit: Credit = {
  unic_id: "UNIC-VCS-IND-2023-4F7A8C1B",
  project_name: "Mangrove Restoration Project",
  vintage: 2023,
  status: "Active"
};

export function TestCertificate() {
  const [showDialog, setShowDialog] = React.useState(false);

  const handleTestPDF = async () => {
    try {
      await downloadCertificateAsPDF(testCredit);
      console.log('PDF download successful');
    } catch (error) {
      console.error('PDF download failed:', error);
    }
  };

  const handleTestHTML = async () => {
    try {
      await downloadCertificateAsHTML(testCredit);
      console.log('HTML download successful');
    } catch (error) {
      console.error('HTML download failed:', error);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Certificate System Test</h1>
      
      <div className="space-y-4">
        <button 
          onClick={() => setShowDialog(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Certificate Dialog
        </button>
        
        <button 
          onClick={handleTestPDF}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test PDF Download
        </button>
        
        <button 
          onClick={handleTestHTML}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test HTML Download
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Certificate Preview:</h2>
        <div className="border border-gray-200 p-4 bg-gray-50">
          <CertificateCard credit={testCredit} />
        </div>
      </div>

      <CertificateDialog
        credit={showDialog ? testCredit : null}
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </div>
  );
}

export default TestCertificate;