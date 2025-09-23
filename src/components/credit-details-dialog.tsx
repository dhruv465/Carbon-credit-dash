
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import type { Credit } from "@/lib/types";
import { downloadCertificate } from "./certificate/download-certificate";
import { cn } from "@/lib/utils";
import { CalendarIcon, FileTextIcon, TagIcon, DownloadIcon, XIcon } from "lucide-react";

interface CreditDetailsDialogProps {
  credit: Credit | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CreditDetailsDialog({ credit, isOpen, onClose }: CreditDetailsDialogProps) {
  if (!credit) return null;

  const isActive = credit.status === "Active";
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleDownloadCertificate = () => {
    downloadCertificate(credit);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        aria-describedby="credit-details-description"
      >
        <DialogHeader className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold leading-tight text-left">
                {credit.project_name}
              </DialogTitle>
              <DialogDescription id="credit-details-description" className="text-sm text-muted-foreground mt-1">
                Detailed information about this carbon credit including UNIC ID {credit.unic_id}, vintage {credit.vintage}, and current status
              </DialogDescription>
            </div>
            <Badge 
              variant={isActive ? "default" : "secondary"}
              className={cn(
                "shrink-0 font-medium text-xs px-3 py-1",
                isActive 
                  ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" 
                  : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700"
              )}
              aria-label={`Credit status: ${credit.status}`}
            >
              {credit.status}
            </Badge>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-6">
          {/* Credit Information Card */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileTextIcon className="h-5 w-5 text-primary" />
                Credit Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TagIcon className="h-4 w-4" />
                    <span className="font-medium">UNIC ID</span>
                  </div>
                  <div className="font-mono text-sm bg-muted/50 px-3 py-2 rounded-md border">
                    {credit.unic_id}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium">Vintage Year</span>
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {credit.vintage}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-sm text-muted-foreground font-medium">
                  Project Name
                </div>
                <div className="text-base font-medium text-foreground">
                  {credit.project_name}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-sm text-muted-foreground font-medium">
                  Current Status
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isActive ? "bg-green-500" : "bg-gray-400"
                  )} />
                  <span className="text-base font-medium">
                    {credit.status}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {isActive ? "Available for retirement" : "Already retired"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Credit Type</span>
                  <span className="font-medium">Verified Carbon Standard (VCS)</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Registry</span>
                  <span className="font-medium">Universal Carbon Registry</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground">Methodology</span>
                  <span className="font-medium">Renewable Energy</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">{currentDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Close credit details dialog"
          >
            <XIcon className="h-4 w-4" aria-hidden="true" />
            Close
          </Button>
          <Button
            onClick={handleDownloadCertificate}
            className="flex-1 sm:flex-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={`Download retirement certificate for ${credit.project_name}`}
          >
            <DownloadIcon className="h-4 w-4" aria-hidden="true" />
            Download Certificate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
