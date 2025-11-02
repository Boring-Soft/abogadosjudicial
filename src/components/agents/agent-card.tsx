"use client";

import { motion } from "framer-motion";
import {
  Phone,
  MessageSquare,
  MoreVertical,
  Play,
  Pause,
  Settings,
  Trash2,
  Copy,
  TestTube2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Agent {
  id: string;
  name: string;
  type: "voice" | "text" | "whatsapp";
  status: "active" | "inactive" | "error";
  description: string;
  interactions: number;
  lastActive: string;
  successRate: number;
}

interface AgentCardProps {
  agent: Agent;
}

const typeIcons = {
  voice: Phone,
  text: MessageSquare,
  whatsapp: MessageSquare,
};

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  },
  error: {
    label: "Error",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export function AgentCard({ agent }: AgentCardProps) {
  const TypeIcon = typeIcons[agent.type];
  const statusStyle = statusConfig[agent.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-blue-500/50 transition-all"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/10 p-2">
            <TypeIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{agent.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">
              {agent.type} Agent
            </p>
          </div>
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TestTube2 className="mr-2 h-4 w-4" />
              Test Agent
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {agent.status === "active" ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Agent
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Activate Agent
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status Badge */}
      <Badge variant="outline" className={`mb-3 ${statusStyle.className}`}>
        {statusStyle.label}
      </Badge>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {agent.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Interactions</p>
          <p className="text-lg font-semibold">{agent.interactions.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Success Rate</p>
          <p className="text-lg font-semibold">{agent.successRate}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Last Active</p>
          <p className="text-xs font-medium mt-1">{agent.lastActive}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => console.log("View details", agent.id)}
        >
          View Details
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => console.log("Test agent", agent.id)}
        >
          <TestTube2 className="mr-2 h-4 w-4" />
          Test
        </Button>
      </div>
    </motion.div>
  );
}
