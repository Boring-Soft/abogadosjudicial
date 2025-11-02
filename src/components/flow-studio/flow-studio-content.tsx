"use client";

import { useState } from "react";
import { Workflow, Plus, Search, MoreVertical, Play, Edit, Copy, Trash2, GitBranch, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Flow {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "draft";
  triggers: number;
  actions: number;
  executions: number;
  successRate: number;
  lastModified: string;
}

const mockFlows: Flow[] = [
  {
    id: "1",
    name: "Lead Qualification Flow",
    description: "Automatically qualify and route leads based on criteria",
    status: "active",
    triggers: 3,
    actions: 8,
    executions: 1247,
    successRate: 96,
    lastModified: "2 hours ago",
  },
  {
    id: "2",
    name: "Customer Onboarding",
    description: "Welcome new customers with automated email sequence",
    status: "active",
    triggers: 2,
    actions: 12,
    executions: 892,
    successRate: 94,
    lastModified: "1 day ago",
  },
  {
    id: "3",
    name: "Support Ticket Routing",
    description: "Route support tickets to appropriate team members",
    status: "active",
    triggers: 4,
    actions: 6,
    executions: 3421,
    successRate: 98,
    lastModified: "3 days ago",
  },
  {
    id: "4",
    name: "Follow-up Campaign",
    description: "Automated follow-up with prospects after initial contact",
    status: "inactive",
    triggers: 2,
    actions: 5,
    executions: 567,
    successRate: 89,
    lastModified: "1 week ago",
  },
  {
    id: "5",
    name: "Payment Reminder System",
    description: "Send payment reminders and handle responses",
    status: "draft",
    triggers: 1,
    actions: 4,
    executions: 0,
    successRate: 0,
    lastModified: "2 weeks ago",
  },
];

export function FlowStudioContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFlows = mockFlows.filter((flow) =>
    flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Flow["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "inactive":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return "text-green-500";
    if (rate >= 85) return "text-blue-500";
    if (rate >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Workflow className="h-6 w-6 text-violet-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Flow Studio</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  Design and build automation workflows
                </p>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  3 Active
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-semibold">
          <Plus className="mr-2 h-4 w-4" />
          Create Flow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <GitBranch className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Flows</p>
              <p className="text-2xl font-bold">15</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Zap className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Executions Today</p>
              <p className="text-2xl font-bold">2,847</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Play className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">94.2%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search flows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Flows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFlows.map((flow) => (
          <Card key={flow.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/10 to-blue-500/10">
                  <Workflow className="h-5 w-5 text-violet-500" />
                </div>
                <Badge variant="outline" className={getStatusColor(flow.status)}>
                  {flow.status === "active" && (
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                  )}
                  {flow.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold leading-tight group-hover:text-blue-500 transition-colors">
                  {flow.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {flow.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Triggers</p>
                  <p className="text-lg font-semibold">{flow.triggers}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Actions</p>
                  <p className="text-lg font-semibold">{flow.actions}</p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Executions</span>
                  <span className="font-semibold">{flow.executions.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Success Rate</span>
                  <span className={`font-semibold ${getSuccessRateColor(flow.successRate)}`}>
                    {flow.successRate}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-xs text-muted-foreground">{flow.lastModified}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Flow
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Play className="mr-2 h-4 w-4" />
                      Test Run
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
