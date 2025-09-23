
import type { Credit } from "@/lib/types";

interface CertificateCardProps {
  credit: Credit;
  timestamp?: string;
}

export function CertificateCard({ credit, timestamp }: CertificateCardProps) {
  const certificateTimestamp = timestamp || new Date().toISOString();
  const formattedDate = new Date(certificateTimestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <div className="bg-white w-[800px] min-h-[600px] p-12 font-serif" id="certificate-template">
      {/* Header with branding */}
      <div className="text-center mb-12 border-b-2 border-green-600 pb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mr-4">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Carbon Credits Registry</h1>
            <p className="text-sm text-gray-600 uppercase tracking-wide">Official Certificate</p>
          </div>
        </div>
        <h2 className="text-4xl font-bold text-green-700 mb-2">Certificate of Retirement</h2>
        <p className="text-lg text-gray-600">This certifies the permanent retirement of carbon credits</p>
      </div>

      {/* Certificate body */}
      <div className="mb-12">
        <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            This certificate serves as official documentation that the carbon credit(s) listed below 
            have been permanently retired and removed from circulation, representing a verified 
            contribution to global carbon offset efforts.
          </p>
        </div>

        {/* Credit details in a professional layout */}
        <div className="grid grid-cols-1 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Credit Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                  UNIC Identifier
                </label>
                <p className="text-lg font-mono text-gray-900 bg-gray-50 p-2 rounded border">
                  {credit.unic_id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Status
                </label>
                <p className={`text-lg font-semibold p-2 rounded border inline-block ${
                  credit.status === 'Active' 
                    ? 'text-green-700 bg-green-50 border-green-200' 
                    : 'text-gray-700 bg-gray-50 border-gray-200'
                }`}>
                  {credit.status}
                </p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Project Name
                </label>
                <p className="text-lg text-gray-900 bg-gray-50 p-2 rounded border">
                  {credit.project_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Vintage Year
                </label>
                <p className="text-lg text-gray-900 bg-gray-50 p-2 rounded border">
                  {credit.vintage}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Certificate Issued
                </label>
                <p className="text-lg text-gray-900 bg-gray-50 p-2 rounded border">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with authenticity information */}
      <div className="border-t-2 border-green-600 pt-6 text-center">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            This certificate is digitally generated and serves as proof of carbon credit retirement.
          </p>
          <p className="text-xs text-gray-500 font-mono">
            Certificate ID: CERT-{credit.unic_id}-{Date.now()}
          </p>
        </div>
        <div className="flex justify-center items-center text-xs text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"/>
          </svg>
          Verified and authenticated by Carbon Credits Registry
        </div>
      </div>
    </div>
  );
}
