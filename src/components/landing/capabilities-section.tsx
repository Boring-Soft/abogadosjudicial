"use client";

import { motion } from "framer-motion";
import {
  Clock,
  RefreshCw,
  MessageCircle,
  Filter,
  CalendarCheck,
  Globe2,
  Zap,
  Shield,
} from "lucide-react";

const capabilities = [
  {
    icon: Clock,
    title: "24/7 AI Availability",
    description:
      "Your AI agents never sleep. Handle inquiries, qualify leads, and book meetings around the clock.",
  },
  {
    icon: RefreshCw,
    title: "Real-time CRM Sync",
    description:
      "Automatically update your CRM with every interaction. Keep your data fresh and accurate.",
  },
  {
    icon: MessageCircle,
    title: "Natural Conversations",
    description:
      "Advanced AI that understands context, nuance, and intent. Sounds human, works like magic.",
  },
  {
    icon: Filter,
    title: "Auto Lead Qualification",
    description:
      "Intelligent scoring and routing. Focus your team on the hottest opportunities.",
  },
  {
    icon: CalendarCheck,
    title: "Calendar Integration",
    description:
      "Seamlessly schedule meetings across Google, Outlook, and more. Eliminate back-and-forth.",
  },
  {
    icon: Globe2,
    title: "Multi-language Support",
    description:
      "Communicate with prospects in their language. Support for 50+ languages globally.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Setup",
    description:
      "From signup to first automation in under 30 minutes. No dev team required.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 compliant with enterprise-grade encryption. Your data is always protected.",
  },
];

export function CapabilitiesSection() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Platform Capabilities
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to automate your business processes with AI
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability, idx) => {
              const Icon = capability.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-blue-500/50 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <Icon className="h-10 w-10 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {capability.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
