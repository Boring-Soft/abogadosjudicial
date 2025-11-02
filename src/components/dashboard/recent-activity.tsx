"use client";

import { useState } from "react";
import { Search, Plus, Phone, MessageSquare, Megaphone, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Activity {
  id: string;
  name: string;
  type: "voice" | "text" | "campaign";
  action: string;
  timestamp: string;
  agent: string;
  status: "success" | "failed" | "pending";
}

const mockActivities: Activity[] = [
  {
    id: "1",
    name: "Sales Qualifier",
    type: "voice",
    action: "Completed call with John Doe",
    timestamp: "2 minutes ago",
    agent: "SQ",
    status: "success",
  },
  {
    id: "2",
    name: "Lead Follow-up",
    type: "voice",
    action: "Initiated outbound call",
    timestamp: "15 minutes ago",
    agent: "LF",
    status: "pending",
  },
  {
    id: "3",
    name: "Summer Campaign",
    type: "campaign",
    action: "Sent 50 messages",
    timestamp: "1 hour ago",
    agent: "SC",
    status: "success",
  },
  {
    id: "4",
    name: "Customer Support",
    type: "text",
    action: "Responded to inquiry",
    timestamp: "2 hours ago",
    agent: "CS",
    status: "success",
  },
  {
    id: "5",
    name: "Appointment Reminder",
    type: "voice",
    action: "Failed to reach contact",
    timestamp: "3 hours ago",
    agent: "AR",
    status: "failed",
  },
];

export function RecentActivity() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivities = mockActivities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "voice":
        return <Phone className="h-4 w-4" />;
      case "text":
        return <MessageSquare className="h-4 w-4" />;
      case "campaign":
        return <Megaphone className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Recent Activity</h2>
            <p className="text-sm text-muted-foreground mt-1">Track your latest agent activities</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20">
            <Plus className="mr-2 h-4 w-4" />
            Create Agent
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No recent activity found</p>
              <p className="text-sm">Activity will appear here once your agents start working</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
              >
                <Avatar className="h-10 w-10 border-2 border-blue-500/20">
                  <AvatarFallback className="bg-blue-500/10 text-blue-500 font-semibold">
                    {activity.agent}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm truncate">{activity.name}</p>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {getIcon(activity.type)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{activity.action}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
