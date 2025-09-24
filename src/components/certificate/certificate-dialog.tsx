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

import { downloadCertificateAsPDF, downloadCertificateAsHTML, downloadCertificateAsText } from "./download-certificate";
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
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF certificate", {
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      });
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
      console.error("Error downloading HTML:", error);
      toast.error("Failed to download HTML certificate", {
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      });
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
          className="h-[70vh] p-0 rounded-t-3xl border-t border-border/30 bg-background"
          aria-describedby="certificate-description-mobile"
        >
          <div className="flex flex-col h-full">
            {/* Drag Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full"></div>
            </div>

            {/* Compact Header */}
            <SheetHeader className="px-6 pb-4 flex-shrink-0">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <SheetTitle className="text-xl font-bold text-left leading-tight">
                    Download Certificate
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {credit.project_name}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>ID: {credit.unic_id.slice(-8)}</span>
                    <span>•</span>
                    <span>{credit.vintage}</span>
                    <span>•</span>
                    <span className={credit.status === 'Active' ? 'text-success' : 'text-gray-500'}>
                      {credit.status}
                    </span>
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Certificate Details */}
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <div className="bg-muted/20 rounded-2xl p-6 border border-border/30">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Certificate Information
                </h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-muted-foreground font-medium block mb-1">Project Name:</span>
                    <p className="font-medium text-foreground leading-relaxed">{credit.project_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium block mb-1">UNIC ID:</span>
                    <p className="font-mono text-foreground bg-muted/50 px-3 py-2 rounded-lg text-xs inline-block break-all">
                      {credit.unic_id}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground font-medium block mb-1">Vintage Year:</span>
                      <p className="font-semibold text-foreground text-lg">{credit.vintage}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium block mb-1">Status:</span>
                      <p className={`font-semibold text-lg ${credit.status === 'Active' ? 'text-success' : 'text-gray-500'}`}>
                        {credit.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Download Instructions */}
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-sm text-muted-foreground text-center">
                  Choose your preferred format to download the certificate for this carbon credit.
                </p>
              </div>
            </div>

            {/* Fixed Footer with Multiple Download Options */}
            <div className="px-6 py-6 border-t border-border/30 bg-background/95 backdrop-blur-sm flex-shrink-0">
              <div className="space-y-3">
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isDownloadingPDF || isDownloadingHTML}
                  className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 focus-ring-enhanced transition-smooth shadow-lg hover:shadow-xl"
                  aria-label={`Download certificate for ${credit.project_name}`}
                >
                  {isDownloadingPDF ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
                      <span>Downloading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Download className="w-6 h-6" aria-hidden="true" />
                      <span>Download Certificate</span>
                    </div>
                  )}
                </Button>
                
                {/* Alternative download options */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleDownloadHTML}
                    disabled={isDownloadingHTML || isDownloadingPDF}
                    className="flex-1 h-10 text-sm font-medium"
                    aria-label={`Download HTML version for ${credit.project_name}`}
                  >
                    {isDownloadingHTML ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    HTML
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        await downloadCertificateAsText(credit);
                        toast.success("Text certificate downloaded!", {
                          description: `Certificate for ${credit.project_name}`,
                        });
                      } catch (error) {
                        toast.error("Download failed", {
                          description: "Please try again",
                        });
                      }
                    }}
                    disabled={isDownloadingHTML || isDownloadingPDF}
                    className="flex-1 h-10 text-sm font-medium"
                    aria-label={`Download text version for ${credit.project_name}`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Text
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop version using Dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0"
        aria-describedby="certificate-description"
      >
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b border-border/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
              <FileText className="w-7 h-7 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-bold leading-tight">
                Download Certificate
              </DialogTitle>
              <p className="text-base text-muted-foreground mt-2 line-clamp-2">
                {credit.project_name}
              </p>
              <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                <span><span className="font-medium">UNIC ID:</span> {credit.unic_id}</span>
                <span><span className="font-medium">Vintage:</span> {credit.vintage}</span>
                <span><span className="font-medium">Status:</span> 
                  <span className={credit.status === 'Active' ? 'text-success font-medium' : 'text-gray-500 font-medium'}>
                    {' '}{credit.status}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Certificate Details */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-muted/20 rounded-2xl p-6 border border-border/30">
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                Certificate Information
              </h4>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-muted-foreground font-medium block mb-1">Project Name:</span>
                  <p className="font-medium text-foreground leading-relaxed">{credit.project_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium block mb-1">UNIC ID:</span>
                  <p className="font-mono text-foreground bg-muted/50 px-3 py-2 rounded-lg text-xs inline-block break-all">
                    {credit.unic_id}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground font-medium block mb-1">Vintage Year:</span>
                    <p className="font-semibold text-foreground text-lg">{credit.vintage}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium block mb-1">Status:</span>
                    <p className={`font-semibold text-lg ${credit.status === 'Active' ? 'text-success' : 'text-gray-500'}`}>
                      {credit.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Download Instructions */}
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl text-center">
              <h5 className="font-semibold text-base mb-2">Download Certificate</h5>
              <p className="text-sm text-muted-foreground">
                Choose your preferred format to download the official certificate for this carbon credit.
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="flex-shrink-0 p-6 pt-4 border-t border-border/30 bg-muted/10">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              onClick={handleDownloadHTML}
              disabled={isDownloadingHTML || isDownloadingPDF}
              className="flex items-center justify-center gap-3 h-12 px-6 focus-ring-enhanced transition-smooth hover:border-primary/50 hover:text-primary hover:bg-primary/5"
              aria-label={`Download HTML certificate for ${credit.project_name}`}
            >
              {isDownloadingHTML ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Downloading HTML...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" aria-hidden="true" />
                  <span>Download HTML Version</span>
                </>
              )}
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPDF || isDownloadingHTML}
              className="flex items-center justify-center gap-3 h-12 px-8 focus-ring-enhanced transition-smooth hover:bg-primary/90 hover:shadow-lg bg-primary"
              aria-label={`Download PDF certificate for ${credit.project_name}`}
            >
              {isDownloadingPDF ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Downloading PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" aria-hidden="true" />
                  <span>Download PDF Certificate</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}