"use client";

import { useState } from "react";
import { MessageSquare, Plus, Search, MoreVertical, Power, PowerOff, Edit, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TextAgent {
  id: string;
  name: string;
  type: "sms" | "whatsapp" | "messenger";
  status: "active" | "inactive";
  messagesSent: number;
  responseRate: number;
  avgResponseTime: string;
  createdAt: string;
}

const mockTextAgents: TextAgent[] = [
  {
    id: "1",
    name: "SMS Support Bot",
    type: "sms",
    status: "active",
    messagesSent: 3420,
    responseRate: 94,
    avgResponseTime: "2.3s",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "WhatsApp Sales Assistant",
    type: "whatsapp",
    status: "active",
    messagesSent: 1890,
    responseRate: 89,
    avgResponseTime: "1.8s",
    createdAt: "2024-02-10",
  },
  {
    id: "3",
    name: "Messenger FAQ Bot",
    type: "messenger",
    status: "active",
    messagesSent: 5620,
    responseRate: 91,
    avgResponseTime: "1.5s",
    createdAt: "2024-01-20",
  },
  {
    id: "4",
    name: "SMS Lead Qualifier",
    type: "sms",
    status: "inactive",
    messagesSent: 987,
    responseRate: 86,
    avgResponseTime: "3.2s",
    createdAt: "2024-03-05",
  },
  {
    id: "5",
    name: "WhatsApp Order Updates",
    type: "whatsapp",
    status: "active",
    messagesSent: 2340,
    responseRate: 97,
    avgResponseTime: "1.2s",
    createdAt: "2024-02-15",
  },
];

export function TextAgentsContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = mockTextAgents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: TextAgent["type"]) => {
    switch (type) {
      case "sms":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "whatsapp":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "messenger":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    }
  };

  const getResponseRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-500";
    if (rate >= 80) return "text-blue-500";
    if (rate >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <MessageSquare className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Text Agents</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  Manage your SMS and messaging bots
                </p>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  4 Active
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-semibold">
          <Plus className="mr-2 h-4 w-4" />
          Create Text Agent
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search text agents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Agents Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Messages Sent</TableHead>
              <TableHead>Response Rate</TableHead>
              <TableHead>Avg Response Time</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="text-muted-foreground">
                    No text agents found. Create your first text agent to get started.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAgents.map((agent) => (
                <TableRow key={agent.id} className="hover:bg-accent/50 group transition-colors">
                  <TableCell className="font-semibold">{agent.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(agent.type)}>
                      {agent.type.toUpperCase()}
                    </Badge>
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
                  <TableCell className="font-semibold">{agent.messagesSent.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${getResponseRateColor(agent.responseRate)}`}>
                      {agent.responseRate}%
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{agent.avgResponseTime}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(agent.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-accent"
                      >
                        {agent.status === "active" ? (
                          <PowerOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Power className="h-4 w-4 text-green-500" />
                        )}
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Agent
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
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
                          <DropdownMenuItem className="text-red-500 focus:text-red-500">
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
