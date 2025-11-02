import { AgentsTable } from "@/components/agents/agents-table";
import { AgentsHeader } from "@/components/agents/agents-header";

export const metadata = {
  title: "Voice Agents - Boring Automation",
  description: "Manage your voice agents",
};

export default function VoiceAgentsPage() {
  return (
    <div className="space-y-6">
      <AgentsHeader />
      <AgentsTable agentType="voice" />
    </div>
  );
}
