"use client";

import { useState } from "react";
import { PublicHeader } from "@/components/navigation/public-header";
import { PublicFooter } from "@/components/navigation/public-footer";
import { AgentsList } from "@/components/agents/agents-list";
import { AgentsStats } from "@/components/agents/agents-stats";
import { AgentsFilters } from "@/components/agents/agents-filters";

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">AI Agents</h1>
            <p className="text-muted-foreground">
              Manage and monitor your AI agents in one place
            </p>
          </div>

          {/* Stats Overview */}
          <AgentsStats />

          {/* Filters and Actions */}
          <AgentsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />

          {/* Agents Grid */}
          <AgentsList
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
          />
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
