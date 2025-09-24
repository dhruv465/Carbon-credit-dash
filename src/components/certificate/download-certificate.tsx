
import html2pdf from "html2pdf.js";
import type { Credit } from "@/lib/types";
import { withRetry, AppError, handleError } from "@/lib/error-handling";

/**
 * Downloads a certificate as PDF - simplified approach
 */
export const downloadCertificateAsPDF = async (credit: Credit): Promise<void> => {
  try {
    console.log('Starting PDF download for credit:', credit.unic_id);
    
    // Check if html2pdf is available
    if (typeof html2pdf === 'undefined') {
      console.warn('html2pdf not available, falling back to HTML download');
      await downloadCertificateAsHTML(credit);
      return;
    }
    
    // Generate HTML content for PDF conversion
    const htmlContent = generateCertificateHTML(credit);
    
    // Create a temporary element
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '-9999px';
    element.style.width = '800px';
    document.body.appendChild(element);
    
    // Configure html2pdf options
    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `certificate-${credit.unic_id}-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { 
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
        width: 800,
        height: 600
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait' 
      }
    };
    
    // Generate and download PDF
    try {
      await html2pdf().set(options).from(element).save();
      console.log('PDF download completed successfully');
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError);
      throw pdfError;
    } finally {
      // Cleanup
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
    }
    
  } catch (error) {
    console.error('PDF download error:', error);
    // Fallback to HTML download if PDF fails
    console.log('Falling back to HTML download...');
    await downloadCertificateAsHTML(credit);
  }
};

/**
 * Generate certificate HTML content
 */
function generateCertificateHTML(credit: Credit): string {
  const timestamp = new Date().toISOString();
  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return `
    <div style="
      background: white;
      width: 800px;
      min-height: 600px;
      padding: 48px;
      font-family: Georgia, serif;
      color: #1f2937;
    ">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 48px; border-bottom: 2px solid #059669; padding-bottom: 32px;">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <div style="
            width: 64px;
            height: 64px;
            background-color: #059669;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
          ">
            <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div>
            <h1 style="font-size: 24px; font-weight: bold; margin: 0;">Carbon Credits Registry</h1>
            <p style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Official Certificate</p>
          </div>
        </div>
        <h2 style="font-size: 32px; font-weight: bold; color: #047857; margin: 8px 0;">Certificate of Retirement</h2>
        <p style="font-size: 18px; color: #6b7280; margin: 0;">This certifies the permanent retirement of carbon credits</p>
      </div>

      <!-- Content -->
      <div style="background-color: #ecfdf5; border-left: 4px solid #059669; padding: 24px; margin-bottom: 32px;">
        <p style="font-size: 18px; color: #374151; line-height: 1.6; margin: 0;">
          This certificate serves as official documentation that the carbon credit(s) listed below 
          have been permanently retired and removed from circulation, representing a verified 
          contribution to global carbon offset efforts.
        </p>
      </div>

      <!-- Credit Details -->
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 48px;">
        <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
          Credit Information
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div>
            <label style="display: block; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
              UNIC Identifier
            </label>
            <p style="font-size: 18px; color: #1f2937; background-color: #f9fafb; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb; margin: 0; font-family: 'Courier New', monospace;">
              ${credit.unic_id}
            </p>
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
              Status
            </label>
            <p style="
              font-size: 18px; 
              margin: 0;
              background-color: ${credit.status === 'Active' ? '#ecfdf5' : '#f9fafb'};
              color: ${credit.status === 'Active' ? '#047857' : '#374151'};
              border: 1px solid ${credit.status === 'Active' ? '#a7f3d0' : '#e5e7eb'};
              padding: 8px;
              border-radius: 4px;
            ">
              ${credit.status}
            </p>
          </div>
          <div style="grid-column: 1 / -1;">
            <label style="display: block; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
              Project Name
            </label>
            <p style="font-size: 18px; color: #1f2937; background-color: #f9fafb; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb; margin: 0;">
              ${credit.project_name}
            </p>
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
              Vintage Year
            </label>
            <p style="font-size: 18px; color: #1f2937; background-color: #f9fafb; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb; margin: 0;">
              ${credit.vintage}
            </p>
          </div>
          <div>
            <label style="display: block; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
              Certificate Issued
            </label>
            <p style="font-size: 18px; color: #1f2937; background-color: #f9fafb; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb; margin: 0;">
              ${formattedDate}
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top: 2px solid #059669; padding-top: 24px; text-align: center;">
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
          This certificate is digitally generated and serves as proof of carbon credit retirement.
        </p>
        <p style="font-size: 12px; color: #9ca3af; font-family: 'Courier New', monospace; margin-bottom: 16px;">
          Certificate ID: CERT-${credit.unic_id}-${Date.now()}
        </p>
        <div style="display: flex; align-items: center; justify-content: center; font-size: 12px; color: #9ca3af;">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 4px;">
            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"/>
          </svg>
          Verified and authenticated by Carbon Credits Registry
        </div>
      </div>
    </div>
  `;
}

/**
 * Downloads a certificate as HTML file
 * Enhanced with comprehensive error handling
 */
export const downloadCertificateAsHTML = async (credit: Credit): Promise<void> => {
  try {
    console.log('Starting HTML download for credit:', credit.unic_id);
    
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
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate-${credit.unic_id}-${Date.now()}.html`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Cleanup
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log('HTML download completed successfully');
    
  } catch (error) {
    console.error('HTML download error:', error);
    throw new Error(`Failed to download HTML certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Simple text certificate download as backup
 */
export const downloadCertificateAsText = async (credit: Credit): Promise<void> => {
  try {
    console.log('Starting text certificate download for:', credit.unic_id);
    
    const timestamp = new Date().toISOString();
    const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
    
    // Create formatted text content
    const content = `
CARBON CREDITS REGISTRY
Official Certificate of Retirement

═══════════════════════════════════════════════════════════════

This certificate serves as official documentation that the 
carbon credit(s) listed below have been permanently retired 
and removed from circulation, representing a verified 
contribution to global carbon offset efforts.

═══════════════════════════════════════════════════════════════

CREDIT INFORMATION:

UNIC Identifier: ${credit.unic_id}
Project Name: ${credit.project_name}
Vintage Year: ${credit.vintage}
Status: ${credit.status}
Certificate Issued: ${formattedDate}

═══════════════════════════════════════════════════════════════

Certificate ID: CERT-${credit.unic_id}-${Date.now()}

This certificate is digitally generated and serves as proof 
of carbon credit retirement.

Verified and authenticated by Carbon Credits Registry
    `.trim();
    
    // Create and download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate-${credit.unic_id}-${Date.now()}.txt`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log('Text certificate download completed');
  } catch (error) {
    console.error('Text certificate download failed:', error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const downloadCertificate = downloadCertificateAsPDF;
