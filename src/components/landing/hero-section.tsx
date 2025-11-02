"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  UserCheck,
  Calendar,
  CheckCircle2,
  HeadphonesIcon,
  Bell,
  DollarSign,
} from "lucide-react";

const useCases = [
  {
    id: "lead-qualification",
    label: "Lead Qualification",
    icon: UserCheck,
    description: "Automatically qualify and score incoming leads",
  },
  {
    id: "schedule-meetings",
    label: "Schedule Meetings",
    icon: Calendar,
    description: "Book meetings automatically with qualified prospects",
  },
  {
    id: "meeting-confirmation",
    label: "Meeting Confirmation",
    icon: CheckCircle2,
    description: "Confirm and remind attendees about scheduled meetings",
  },
  {
    id: "customer-support",
    label: "Customer Support",
    icon: HeadphonesIcon,
    description: "Provide 24/7 automated customer support",
  },
  {
    id: "send-reminders",
    label: "Send Reminders",
    icon: Bell,
    description: "Automate reminder calls and messages",
  },
  {
    id: "debt-collection",
    label: "Debt Collection",
    icon: DollarSign,
    description: "Handle payment reminders professionally",
  },
];

export function HeroSection() {
  const [selectedUseCase, setSelectedUseCase] = useState(useCases[0]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/50 py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <div className="h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-3xl" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              The fastest way to automate with AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Empower your sales, marketing, and operations teams with AI agents
              that work 24/7. Setup in 7 days, trusted by 50,000+ companies.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              asChild
            >
              <Link href="/sign-up">Start for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Book a Demo</Link>
            </Button>
          </motion.div>

          {/* Use Case Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <p className="text-sm font-semibold text-muted-foreground mb-6">
              SELECT YOUR USE CASE
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {useCases.map((useCase) => {
                const Icon = useCase.icon;
                return (
                  <button
                    key={useCase.id}
                    onClick={() => setSelectedUseCase(useCase)}
                    className={`group relative rounded-lg border-2 p-4 text-left transition-all hover:border-blue-500 ${
                      selectedUseCase.id === useCase.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <Icon
                      className={`h-8 w-8 mb-2 transition-colors ${
                        selectedUseCase.id === useCase.id
                          ? "text-blue-500"
                          : "text-muted-foreground group-hover:text-blue-500"
                      }`}
                    />
                    <p
                      className={`text-sm font-medium ${
                        selectedUseCase.id === useCase.id
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {useCase.label}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Use Case Description */}
            <motion.div
              key={selectedUseCase.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 rounded-lg border border-border bg-card/50 p-6 backdrop-blur"
            >
              <div className="flex items-center gap-3 mb-3">
                <selectedUseCase.icon className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-semibold">{selectedUseCase.label}</h3>
              </div>
              <p className="text-muted-foreground">{selectedUseCase.description}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
