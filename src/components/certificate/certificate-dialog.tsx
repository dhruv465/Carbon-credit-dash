import { useState, useEffect } from "react";
import type { Credit } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CertificateCard } from "./certificate-card";
import { downloadCertificateAsPDF, downloadCertificateAsHTML } from "./download-certificate";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { handleAsyncError } from "@/lib/error-handling";

interface CertificateDialogProps {
  credit: Credit | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateDialog({ credit, isOpen, onClose }: CertificateDialogProps) {
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingHTML, setIsDownloadingHTML] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!credit) return null;

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      await downloadCertificateAsPDF(credit);
      toast.success("PDF certificate downloaded successfully!", {
        description: `Certificate for ${credit.project_name} (${credit.unic_id})`,
      });
    } catch (error) {
      // Error handling is done in the download function
      console.error("Error downloading PDF:", error);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleDownloadHTML = async () => {
    setIsDownloadingHTML(true);
    try {
      await downloadCertificateAsHTML(credit);
      toast.success("HTML certificate downloaded successfully!", {
        description: `Certificate for ${credit.project_name} (${credit.unic_id})`,
      });
    } catch (error) {
      // Error handling is done in the download function
      console.error("Error downloading HTML:", error);
    } finally {
      setIsDownloadingHTML(false);
    }
  };

  // Mobile version using Sheet (bottom sheet pattern)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent 
          side="bottom" 
          className="h-[85vh] p-0 rounded-t-xl border-t-2 border-primary/20"
          aria-describedby="certificate-description-mobile"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="px-6 py-4 border-b border-border/50">
              <SheetTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
                Certificate Preview
              </SheetTitle>
              <SheetDescription id="certificate-description-mobile" className="text-left">
                Preview and download the retirement certificate for {credit.project_name}. 
                The certificate includes project details, UNIC ID {credit.unic_id}, and vintage {credit.vintage}.
              </SheetDescription>
            </SheetHeader>

            {/* Certificate Preview - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div 
                className="flex justify-center"
                role="img"
                aria-label={`Certificate preview for ${credit.project_name}`}
              >
                <div className="transform scale-90 origin-top w-full max-w-md">
                  <CertificateCard credit={credit} />
                </div>
              </div>
            </div>

            {/* Fixed Footer with Touch-Friendly Buttons */}
            <SheetFooter className="px-6 py-4 border-t border-border/50 bg-background/95 backdrop-blur-sm">
              <div className="flex flex-col gap-3 w-full">
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isDownloadingPDF || isDownloadingHTML}
                  className="flex items-center justify-center gap-2 h-12 text-base font-medium focus-ring-enhanced transition-smooth hover:shadow-lg"
                  aria-label={`Download PDF certificate for ${credit.project_name}`}
                >
                  {isDownloadingPDF ? (
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Download className="w-5 h-5" aria-hidden="true" />
                  )}
                  Download PDF Certificate
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadHTML}
                  disabled={isDownloadingHTML || isDownloadingPDF}
                  className="flex items-center justify-center gap-2 h-12 text-base font-medium focus-ring-enhanced transition-smooth hover:border-primary/50 hover:text-primary"
                  aria-label={`Download HTML certificate for ${credit.project_name}`}
                >
                  {isDownloadingHTML ? (
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Download className="w-5 h-5" aria-hidden="true" />
                  )}
                  Download HTML Version
                </Button>
              </div>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop version using Dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        aria-describedby="certificate-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" aria-hidden="true" />
            Certificate Preview
          </DialogTitle>
          <DialogDescription id="certificate-description">
            Preview and download the retirement certificate for {credit.project_name}. 
            The certificate includes project details, UNIC ID {credit.unic_id}, and vintage {credit.vintage}.
          </DialogDescription>
        </DialogHeader>

        {/* Certificate Preview */}
        <div 
          className="flex justify-center py-4"
          role="img"
          aria-label={`Certificate preview for ${credit.project_name}`}
        >
          <div className="transform scale-75 origin-top">
            <CertificateCard credit={credit} />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadHTML}
            disabled={isDownloadingHTML || isDownloadingPDF}
            className="flex items-center gap-2 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={`Download HTML certificate for ${credit.project_name}`}
          >
            {isDownloadingHTML ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="w-4 h-4" aria-hidden="true" />
            )}
            Download HTML
          </Button>
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloadingPDF || isDownloadingHTML}
            className="flex items-center gap-2 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={`Download PDF certificate for ${credit.project_name}`}
          >
            {isDownloadingPDF ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="w-4 h-4" aria-hidden="true" />
            )}
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}