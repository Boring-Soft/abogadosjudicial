"use client";

import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProSection() {
  const creditsUsed = 0;
  const creditsTotal = 10000;
  const progressPercentage = (creditsUsed / creditsTotal) * 100;

  return (
    <div className="px-3 py-2">
      <Card className="border-0 bg-sidebar-accent/50 p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-1">Become a Pro</h3>
            <p className="text-xs text-muted-foreground">
              Unlock exclusive benefits and premium features.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Credits used</span>
              <span className="font-medium">{creditsUsed} / {creditsTotal.toLocaleString()}</span>
            </div>
            <Progress value={progressPercentage} className="h-1" />
          </div>

          <Button
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Flame className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Button>
        </div>
      </Card>

      <Card className="border-0 bg-sidebar-accent/30 p-4 mt-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Refer and earn $50</h3>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
          >
            Refer a friend
          </Button>
        </div>
      </Card>
    </div>
  );
}
