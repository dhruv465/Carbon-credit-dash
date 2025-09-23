# Certificate Generation System

This directory contains the complete certificate generation system for the carbon credits dashboard.

## Components

### CertificateCard (`certificate-card.tsx`)
- Professional certificate template with proper branding and layout
- Includes company logo, header, and footer sections
- Displays all required credit information: UNIC ID, project name, vintage, status, and timestamp
- Responsive design with environmental color theme
- Proper typography and spacing for professional appearance

### CertificateDialog (`certificate-dialog.tsx`)
- Modal dialog for certificate preview
- Scaled preview of the certificate (75% size for better viewing)
- Download buttons for both HTML and PDF formats
- Loading states and error handling
- Responsive design for mobile devices

### Download Functions (`download-certificate.tsx`)
- `downloadCertificateAsPDF()` - Generates high-quality PDF using html2pdf.js
- `downloadCertificateAsHTML()` - Creates standalone HTML file with embedded styles
- Proper filename generation with UNIC ID and timestamp
- Error handling and cleanup
- Backward compatibility with legacy `downloadCertificate()` function

## Features

### Professional Design
- Clean, modern layout with environmental branding
- Forest green color scheme reflecting carbon offset theme
- Professional typography using serif fonts
- Proper spacing and visual hierarchy
- Company logo and branding elements

### Certificate Content
- **UNIC Identifier**: Displayed in monospace font for clarity
- **Project Name**: Prominently featured as main content
- **Vintage Year**: Clearly labeled and formatted
- **Status**: Color-coded badges (green for Active, gray for Retired)
- **Certificate Issued**: Formatted timestamp with timezone
- **Certificate ID**: Unique identifier for authenticity

### Download Formats

#### PDF Format
- High-quality PDF generation using html2pdf.js
- Landscape orientation optimized for certificates
- 2x scale for crisp rendering
- Proper filename: `certificate-{UNIC_ID}-{timestamp}.pdf`

#### HTML Format
- Standalone HTML file with embedded CSS
- No external dependencies
- Print-friendly styling
- Proper filename: `certificate-{UNIC_ID}-{timestamp}.html`

## Usage

### Basic Usage
```tsx
import { CertificateDialog } from '@/components/certificate';

function MyComponent() {
  const [showCertificate, setShowCertificate] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowCertificate(true)}>
        View Certificate
      </button>
      
      <CertificateDialog
        credit={selectedCredit}
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
      />
    </>
  );
}
```

### Direct Download
```tsx
import { downloadCertificateAsPDF, downloadCertificateAsHTML } from '@/components/certificate';

// Download PDF
await downloadCertificateAsPDF(credit);

// Download HTML
await downloadCertificateAsHTML(credit);
```

## Requirements Compliance

This implementation fully satisfies all requirements from the specification:

- **4.1**: ✅ Generates certificate with UNIC ID, project name, vintage, status, and timestamp
- **4.2**: ✅ Professional-looking document with proper branding
- **4.3**: ✅ Supports both HTML and PDF formats
- **4.4**: ✅ Includes current timestamp when certificate is issued
- **4.5**: ✅ Uses filename that includes UNIC ID for easy identification

## Dependencies

- `html2pdf.js` - For high-quality PDF generation
- `html2canvas` - For HTML to canvas conversion (used by html2pdf.js)
- `jspdf` - PDF library (used by html2pdf.js)
- `sonner` - For toast notifications
- `lucide-react` - For icons
- `@radix-ui/react-dialog` - For modal dialog

## Testing

A test component is available at `src/test-certificate.tsx` for manual testing of all certificate functionality.