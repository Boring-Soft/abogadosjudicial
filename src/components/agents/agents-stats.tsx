"use client";

import { motion } from "framer-motion";
import { Bot, Play, Pause, Activity } from "lucide-react";

const stats = [
  {
    label: "Total Agents",
    value: "12",
    icon: Bot,
    change: "+2 this month",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Active",
    value: "8",
    icon: Play,
    change: "66% uptime",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    label: "Inactive",
    value: "4",
    icon: Pause,
    change: "Ready to deploy",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    label: "Interactions",
    value: "1,234",
    icon: Activity,
    change: "+12% this week",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

export function AgentsStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="relative overflow-hidden rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
