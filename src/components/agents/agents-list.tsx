"use client";

import { AgentCard } from "./agent-card";

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

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Sales Qualifier",
    type: "voice",
    status: "active",
    description: "Qualifies inbound sales leads and schedules demos",
    interactions: 324,
    lastActive: "2 minutes ago",
    successRate: 94,
  },
  {
    id: "2",
    name: "Customer Support",
    type: "text",
    status: "active",
    description: "Handles customer inquiries and support tickets 24/7",
    interactions: 892,
    lastActive: "5 minutes ago",
    successRate: 89,
  },
  {
    id: "3",
    name: "Appointment Reminder",
    type: "voice",
    status: "active",
    description: "Sends automated appointment reminders to customers",
    interactions: 156,
    lastActive: "1 hour ago",
    successRate: 97,
  },
  {
    id: "4",
    name: "Lead Follow-up",
    type: "whatsapp",
    status: "inactive",
    description: "Follows up with leads via WhatsApp messaging",
    interactions: 0,
    lastActive: "3 days ago",
    successRate: 0,
  },
  {
    id: "5",
    name: "Onboarding Assistant",
    type: "text",
    status: "active",
    description: "Guides new customers through the onboarding process",
    interactions: 67,
    lastActive: "30 minutes ago",
    successRate: 92,
  },
  {
    id: "6",
    name: "Feedback Collector",
    type: "voice",
    status: "active",
    description: "Collects customer feedback after interactions",
    interactions: 234,
    lastActive: "15 minutes ago",
    successRate: 88,
  },
  {
    id: "7",
    name: "Payment Reminder",
    type: "voice",
    status: "inactive",
    description: "Sends payment reminders to customers",
    interactions: 45,
    lastActive: "1 week ago",
    successRate: 76,
  },
  {
    id: "8",
    name: "Product Recommendations",
    type: "text",
    status: "error",
    description: "Provides personalized product recommendations",
    interactions: 12,
    lastActive: "2 days ago",
    successRate: 0,
  },
  {
    id: "9",
    name: "Meeting Scheduler",
    type: "voice",
    status: "active",
    description: "Books meetings and syncs with calendar",
    interactions: 445,
    lastActive: "10 minutes ago",
    successRate: 95,
  },
  {
    id: "10",
    name: "FAQ Responder",
    type: "text",
    status: "active",
    description: "Answers frequently asked questions instantly",
    interactions: 1203,
    lastActive: "Just now",
    successRate: 91,
  },
  {
    id: "11",
    name: "Order Status Updates",
    type: "whatsapp",
    status: "active",
    description: "Sends order status updates via WhatsApp",
    interactions: 567,
    lastActive: "8 minutes ago",
    successRate: 98,
  },
  {
    id: "12",
    name: "Churn Prevention",
    type: "voice",
    status: "inactive",
    description: "Reaches out to at-risk customers",
    interactions: 23,
    lastActive: "2 weeks ago",
    successRate: 82,
  },
];

interface AgentsListProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
}

export function AgentsList({
  searchQuery,
  statusFilter,
  typeFilter,
}: AgentsListProps) {
  const filteredAgents = mockAgents.filter((agent) => {
    const matchesSearch = agent.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || agent.status === statusFilter;
    const matchesType = typeFilter === "all" || agent.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div>
      {filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No agents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}
