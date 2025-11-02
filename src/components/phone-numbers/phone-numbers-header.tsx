"use client";

import { Plus, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PhoneNumbersHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <PhoneCall className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Phone Numbers</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">
                Manage and configure your phone numbers
              </p>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                12 Numbers
              </Badge>
            </div>
          </div>
        </div>
      </div>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-semibold">
        <Plus className="mr-2 h-4 w-4" />
        Add Number
      </Button>
    </div>
  );
}
