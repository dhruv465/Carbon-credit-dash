
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Credit } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { downloadCertificate } from "../certificate/download-certificate.tsx";

export const columns = (setSelectedCredit: (credit: Credit) => void): ColumnDef<Credit>[] => [
  {
    accessorKey: "unic_id",
    header: "UNIC ID",
  },
  {
    accessorKey: "project_name",
    header: "Project Name",
  },
  {
    accessorKey: "vintage",
    header: "Vintage",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.status === "Active";
      return (
        <Badge 
          variant={isActive ? "default" : "secondary"}
          className={
            isActive 
              ? "bg-success/10 text-success border-success/20" 
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
          }
        >
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const credit = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(credit.unic_id)}
            >
              Copy UNIC ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedCredit(credit)}>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => downloadCertificate(credit)}>Download Certificate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
