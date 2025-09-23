
import html2pdf from "html2pdf.js";
import type { Credit } from "@/lib/types";
import { withRetry, AppError, handleError } from "@/lib/error-handling";

/**
 * Downloads a certificate as PDF using html2pdf.js for better quality
 * Enhanced with comprehensive error handling and retry logic
 */
export const downloadCertificateAsPDF = async (credit: Credit): Promise<void> => {
  return withRetry(
    () => new Promise<void>((resolve, reject) => {
      try {
      // Create a temporary container for rendering
      const certificateElement = document.createElement("div");
      certificateElement.style.position = "absolute";
      certificateElement.style.left = "-9999px";
      certificateElement.style.top = "0";
      certificateElement.style.background = "white";
      document.body.appendChild(certificateElement);

      // Import and render the certificate component
      Promise.all([
        import("react-dom/client"),
        import("./certificate-card")
      ]).then(([ReactDOM, { CertificateCard }]) => {
        const root = ReactDOM.createRoot(certificateElement);
        const timestamp = new Date().toISOString();
        
        // Render the certificate with current timestamp
        root.render(<CertificateCard credit={credit} timestamp={timestamp} />);

        // Wait for rendering to complete
        setTimeout(() => {
          const certificateCard = certificateElement.querySelector('#certificate-template') as HTMLElement;
          
          if (!certificateCard) {
            document.body.removeChild(certificateElement);
            reject(new AppError(
              "Certificate template not found",
              { component: 'downloadCertificateAsPDF', action: 'generatePDF', creditId: credit.unic_id },
              false,
              "Failed to generate certificate template. Please try again."
            ));
            return;
          }

          // Configure html2pdf options for high quality
          const options = {
            margin: 0,
            filename: `certificate-${credit.unic_id}-${Date.now()}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { 
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff',
              width: 800,
              height: 600
            },
            jsPDF: { 
              unit: 'px', 
              format: [800, 600] as [number, number], 
              orientation: 'landscape' as const
            }
          };

          // Generate PDF using html2pdf
          html2pdf()
            .set(options)
            .from(certificateCard)
            .save()
            .then(() => {
              // Cleanup
              root.unmount();
              document.body.removeChild(certificateElement);
              resolve();
            })
            .catch((error) => {
              root.unmount();
              document.body.removeChild(certificateElement);
              reject(new AppError(
                `PDF generation failed: ${error.message}`,
                { component: 'downloadCertificateAsPDF', action: 'generatePDF', creditId: credit.unic_id },
                true,
                "PDF generation failed. Please try again."
              ));
            });
        }, 500); // Increased timeout for better rendering
      }).catch(reject);
    } catch (error) {
      reject(new AppError(
        error instanceof Error ? error.message : 'Unknown error during PDF generation',
        { component: 'downloadCertificateAsPDF', action: 'generatePDF', creditId: credit.unic_id },
        true,
        "Certificate generation failed. Please try again."
      ));
    }
  }),
  {
    maxAttempts: 2,
    delay: 1000,
    onRetry: (attempt: number, error: Error) => {
      console.log(`Retrying PDF generation (attempt ${attempt}):`, error.message);
    }
  }
);
};

/**
 * Downloads a certificate as HTML file
 * Enhanced with comprehensive error handling
 */
export const downloadCertificateAsHTML = async (credit: Credit): Promise<void> => {
  return withRetry(
    () => new Promise<void>((resolve, reject) => {
      try {
      const timestamp = new Date().toISOString();
      const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });

      // Create HTML content with embedded styles
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Retirement - ${credit.unic_id}</title>
    <style>
        body {
            font-family: Georgia, serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .certificate {
            background: white;
            width: 800px;
            min-height: 600px;
            padding: 48px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 48px;
            border-bottom: 2px solid #059669;
            padding-bottom: 32px;
        }
        .logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
        }
        .logo {
            width: 64px;
            height: 64px;
            background-color: #059669;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
        }
        .logo svg {
            width: 40px;
            height: 40px;
            color: white;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin: 0;
        }
        .subtitle {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0;
        }
        .title {
            font-size: 32px;
            font-weight: bold;
            color: #047857;
            margin: 8px 0;
        }
        .description {
            font-size: 18px;
            color: #6b7280;
            margin: 0;
        }
        .intro {
            background-color: #ecfdf5;
            border-left: 4px solid #059669;
            padding: 24px;
            margin-bottom: 32px;
        }
        .intro p {
            font-size: 18px;
            color: #374151;
            line-height: 1.6;
            margin: 0;
        }
        .credit-info {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 48px;
        }
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }
        .full-width {
            grid-column: 1 / -1;
        }
        .field-label {
            display: block;
            font-size: 12px;
            font-weight: 500;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }
        .field-value {
            font-size: 18px;
            color: #1f2937;
            background-color: #f9fafb;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
            margin: 0;
        }
        .field-value.mono {
            font-family: 'Courier New', monospace;
        }
        .status-active {
            color: #047857;
            background-color: #ecfdf5;
            border-color: #a7f3d0;
        }
        .status-retired {
            color: #374151;
            background-color: #f9fafb;
            border-color: #e5e7eb;
        }
        .footer {
            border-top: 2px solid #059669;
            padding-top: 24px;
            text-align: center;
        }
        .footer p {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        .cert-id {
            font-size: 12px;
            color: #9ca3af;
            font-family: 'Courier New', monospace;
            margin-bottom: 16px;
        }
        .verification {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #9ca3af;
        }
        .verification svg {
            width: 16px;
            height: 16px;
            margin-right: 4px;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="logo-section">
                <div class="logo">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    </svg>
                </div>
                <div>
                    <h1 class="company-name">Carbon Credits Registry</h1>
                    <p class="subtitle">Official Certificate</p>
                </div>
            </div>
            <h2 class="title">Certificate of Retirement</h2>
            <p class="description">This certifies the permanent retirement of carbon credits</p>
        </div>

        <div class="intro">
            <p>
                This certificate serves as official documentation that the carbon credit(s) listed below 
                have been permanently retired and removed from circulation, representing a verified 
                contribution to global carbon offset efforts.
            </p>
        </div>

        <div class="credit-info">
            <h3 class="section-title">Credit Information</h3>
            <div class="grid">
                <div>
                    <label class="field-label">UNIC Identifier</label>
                    <p class="field-value mono">${credit.unic_id}</p>
                </div>
                <div>
                    <label class="field-label">Status</label>
                    <p class="field-value ${credit.status === 'Active' ? 'status-active' : 'status-retired'}">${credit.status}</p>
                </div>
                <div class="full-width">
                    <label class="field-label">Project Name</label>
                    <p class="field-value">${credit.project_name}</p>
                </div>
                <div>
                    <label class="field-label">Vintage Year</label>
                    <p class="field-value">${credit.vintage}</p>
                </div>
                <div>
                    <label class="field-label">Certificate Issued</label>
                    <p class="field-value">${formattedDate}</p>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>This certificate is digitally generated and serves as proof of carbon credit retirement.</p>
            <p class="cert-id">Certificate ID: CERT-${credit.unic_id}-${Date.now()}</p>
            <div class="verification">
                <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"/>
                </svg>
                Verified and authenticated by Carbon Credits Registry
            </div>
        </div>
    </div>
</body>
</html>`;

      // Create and download the HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${credit.unic_id}-${Date.now()}.html`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);
      resolve();
    } catch (error) {
      reject(new AppError(
        error instanceof Error ? error.message : 'Unknown error during HTML generation',
        { component: 'downloadCertificateAsHTML', action: 'generateHTML', creditId: credit.unic_id },
        true,
        "HTML certificate generation failed. Please try again."
      ));
    }
  }),
  {
    maxAttempts: 2,
    delay: 500,
    onRetry: (attempt: number, error: Error) => {
      console.log(`Retrying HTML generation (attempt ${attempt}):`, error.message);
    }
  }
);
};

// Legacy function for backward compatibility
export const downloadCertificate = downloadCertificateAsPDF;
