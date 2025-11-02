"use client";

import { useState } from "react";
import { Megaphone, Plus, Search, MoreVertical, Play, Pause, Edit, Copy, Trash2, TrendingUp, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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

interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "voice";
  status: "active" | "paused" | "completed" | "draft";
  sent: number;
  delivered: number;
  opened: number;
  converted: number;
  startDate: string;
  endDate: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Sale 2024",
    type: "email",
    status: "active",
    sent: 5000,
    delivered: 4850,
    opened: 2425,
    converted: 485,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
  },
  {
    id: "2",
    name: "Product Launch",
    type: "voice",
    status: "active",
    sent: 1200,
    delivered: 1150,
    opened: 920,
    converted: 184,
    startDate: "2024-07-15",
    endDate: "2024-09-15",
  },
  {
    id: "3",
    name: "Customer Re-engagement",
    type: "sms",
    status: "paused",
    sent: 3500,
    delivered: 3480,
    opened: 2784,
    converted: 417,
    startDate: "2024-05-01",
    endDate: "2024-12-31",
  },
  {
    id: "4",
    name: "Holiday Special",
    type: "email",
    status: "draft",
    sent: 0,
    delivered: 0,
    opened: 0,
    converted: 0,
    startDate: "2024-12-01",
    endDate: "2024-12-31",
  },
  {
    id: "5",
    name: "Webinar Invites",
    type: "voice",
    status: "completed",
    sent: 800,
    delivered: 792,
    opened: 634,
    converted: 127,
    startDate: "2024-03-01",
    endDate: "2024-03-31",
  },
];

export function CampaignsContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = mockCampaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "paused":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getTypeIcon = (type: Campaign["type"]) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <Users className="h-4 w-4" />;
      case "voice":
        return <Megaphone className="h-4 w-4" />;
    }
  };

  const calculateRate = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Megaphone className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  Create and manage your marketing campaigns
                </p>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  2 Active
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-semibold">
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Sent</p>
              <p className="text-2xl font-bold">10,500</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold">10,272</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Opened</p>
              <p className="text-2xl font-bold">6,763</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Converted</p>
              <p className="text-2xl font-bold">1,213</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Campaigns Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Open Rate</TableHead>
              <TableHead>Conversion</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="text-muted-foreground">
                    No campaigns found. Create your first campaign to get started.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id} className="hover:bg-accent/50 group transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-semibold">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(campaign.type)}
                      <span className="capitalize">{campaign.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(campaign.status)}>
                      {campaign.status === "active" && (
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                      )}
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{campaign.sent.toLocaleString()}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{campaign.delivered.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {calculateRate(campaign.delivered, campaign.sent)}%
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{calculateRate(campaign.opened, campaign.delivered)}%</p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.opened.toLocaleString()} opened
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-green-600">{calculateRate(campaign.converted, campaign.opened)}%</p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.converted.toLocaleString()} conv.
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {campaign.status === "active" ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                          <Pause className="h-4 w-4 text-yellow-500" />
                        </Button>
                      ) : campaign.status !== "completed" ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                          <Play className="h-4 w-4 text-green-500" />
                        </Button>
                      ) : null}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
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
