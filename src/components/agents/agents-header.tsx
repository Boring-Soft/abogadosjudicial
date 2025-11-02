"use client";

import { Plus, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AgentsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Phone className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Voice Agents</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">
                Create and manage your AI voice agents
              </p>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                8 Active
              </Badge>
            </div>
          </div>
        </div>
      </div>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-semibold">
        <Plus className="mr-2 h-4 w-4" />
        Create Agent
      </Button>
    </div>
  );
}
