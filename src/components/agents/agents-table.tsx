"use client";

import { useState } from "react";
import { Search, MoreVertical, Power, PowerOff, Edit, Trash2, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Agent {
  id: string;
  name: string;
  type: "voice" | "text" | "whatsapp";
  status: "active" | "inactive";
  isPublic: boolean;
  credits: number;
  createdAt: string;
  lastActive: string;
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Sales Qualifier",
    type: "voice",
    status: "active",
    isPublic: true,
    credits: 1250,
    createdAt: "2024-01-15",
    lastActive: "2 minutes ago",
  },
  {
    id: "2",
    name: "Appointment Reminder",
    type: "voice",
    status: "active",
    isPublic: false,
    credits: 890,
    createdAt: "2024-01-20",
    lastActive: "1 hour ago",
  },
  {
    id: "3",
    name: "Customer Support",
    type: "voice",
    status: "inactive",
    isPublic: true,
    credits: 2340,
    createdAt: "2024-02-01",
    lastActive: "3 days ago",
  },
  {
    id: "4",
    name: "Lead Follow-up",
    type: "voice",
    status: "active",
    isPublic: false,
    credits: 560,
    createdAt: "2024-02-10",
    lastActive: "30 minutes ago",
  },
  {
    id: "5",
    name: "Feedback Collector",
    type: "voice",
    status: "active",
    isPublic: true,
    credits: 1780,
    createdAt: "2024-02-15",
    lastActive: "15 minutes ago",
  },
  {
    id: "6",
    name: "Payment Reminder",
    type: "voice",
    status: "inactive",
    isPublic: false,
    credits: 450,
    createdAt: "2024-03-01",
    lastActive: "1 week ago",
  },
  {
    id: "7",
    name: "Meeting Scheduler",
    type: "voice",
    status: "active",
    isPublic: true,
    credits: 3200,
    createdAt: "2024-03-05",
    lastActive: "10 minutes ago",
  },
  {
    id: "8",
    name: "Onboarding Assistant",
    type: "voice",
    status: "active",
    isPublic: false,
    credits: 920,
    createdAt: "2024-03-12",
    lastActive: "Just now",
  },
];

interface AgentsTableProps {
  agentType: "voice" | "text" | "whatsapp";
}

export function AgentsTable({ agentType }: AgentsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = mockAgents
    .filter((agent) => agent.type === agentType)
    .filter((agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const toggleAgentStatus = (agentId: string) => {
    console.log("Toggle agent status:", agentId);
  };

  const deleteAgent = (agentId: string) => {
    console.log("Delete agent:", agentId);
  };

  const duplicateAgent = (agentId: string) => {
    console.log("Duplicate agent:", agentId);
  };

  const editAgent = (agentId: string) => {
    console.log("Edit agent:", agentId);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search agents by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Credits Used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="text-muted-foreground">
                    No agents found. Create your first agent to get started.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAgents.map((agent) => (
                <TableRow key={agent.id} className="hover:bg-accent/50 group transition-colors">
                  <TableCell className="font-semibold">{agent.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(agent.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className="font-semibold text-base">{agent.credits.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">credits</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {agent.status === "active" ? (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20 font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-500 mr-1.5" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {agent.isPublic ? (
                      <Badge variant="outline" className="font-medium">Public</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted font-medium">
                        Private
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {agent.lastActive}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Quick Toggle */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleAgentStatus(agent.id)}
                        className="h-8 w-8 hover:bg-accent"
                      >
                        {agent.status === "active" ? (
                          <PowerOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Power className="h-4 w-4 text-green-500" />
                        )}
                      </Button>

                      {/* More Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => editAgent(agent.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Agent
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateAgent(agent.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => toggleAgentStatus(agent.id)}
                          >
                            {agent.status === "active" ? (
                              <>
                                <PowerOff className="mr-2 h-4 w-4" />
                                Turn Off
                              </>
                            ) : (
                              <>
                                <Power className="mr-2 h-4 w-4" />
                                Turn On
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteAgent(agent.id)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
