"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { trackCTAClick, trackUseCaseSelection } from "@/lib/analytics";
import {
  UserCheck,
  Calendar,
  CheckCircle2,
  HeadphonesIcon,
  Bell,
  DollarSign,
  ArrowRight,
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
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-background to-background/50 py-20 sm:py-32 lg:py-40"
      aria-label="Hero section"
    >
      {/* Background decoration - optimized */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 will-change-transform">
          <div className="h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-3xl" />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <div className="h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <div className="absolute left-0 bottom-0">
          <div className="h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-3xl" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Headline with BlurFade */}
          <BlurFade delay={0} duration={0.6}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent leading-tight">
              Transform Your Business with AI Automation
            </h1>
          </BlurFade>

          <BlurFade delay={0.2} duration={0.6}>
            <p className="mt-6 text-lg sm:text-xl leading-8 text-muted-foreground max-w-3xl mx-auto">
              Empower your sales, marketing, and operations teams with intelligent AI agents that work 24/7. Deploy in 7 days, scale effortlessly, trusted by 50,000+ companies worldwide.
            </p>
          </BlurFade>

          {/* CTAs with stagger animation */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6"
          >
            <Link
              href="/sign-up"
              onClick={() => trackCTAClick({
                cta_location: "hero",
                cta_text: "Start for Free",
                cta_type: "primary",
                destination_url: "/sign-up"
              })}
            >
              <ShimmerButton
                className="px-8 py-4 text-base font-semibold shadow-lg"
                shimmerColor="#60a5fa"
                shimmerSize="0.1em"
                background="linear-gradient(to right, #2563eb, #1d4ed8)"
                borderRadius="0.5rem"
              >
                <span className="flex items-center gap-2">
                  Start for Free
                  <ArrowRight className="w-4 h-4" />
                </span>
              </ShimmerButton>
            </Link>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.5 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-2 hover:bg-accent/10 font-semibold"
                asChild
              >
                <Link
                  href="/contact"
                  onClick={() => trackCTAClick({
                    cta_location: "hero",
                    cta_text: "Book a Demo",
                    cta_type: "secondary",
                    destination_url: "/contact"
                  })}
                >
                  Book a Demo
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Visual/Product Screenshot */}
          <BlurFade delay={0.6} duration={0.8}>
            <div className="mt-16 relative">
              <div className="relative rounded-xl border border-border/40 bg-gradient-to-b from-card/50 to-background/80 p-4 shadow-2xl backdrop-blur">
                <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  {/* Placeholder for product screenshot */}
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-500/50 animate-pulse" />
                    </div>
                    <p className="text-sm text-muted-foreground">Product Demo Visual</p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
              </div>
            </div>
          </BlurFade>

          {/* Use Case Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-20"
            role="region"
            aria-label="Use case selector"
          >
            <p
              id="use-case-label"
              className="text-sm font-semibold text-muted-foreground mb-6 tracking-wider"
            >
              SELECT YOUR USE CASE
            </p>

            <div
              className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6"
              role="group"
              aria-labelledby="use-case-label"
            >
              {useCases.map((useCase, idx) => {
                const Icon = useCase.icon;
                return (
                  <motion.button
                    key={useCase.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.9 + idx * 0.05 }}
                    onClick={() => {
                      setSelectedUseCase(useCase);
                      trackUseCaseSelection(useCase.label);
                    }}
                    aria-pressed={selectedUseCase.id === useCase.id}
                    aria-label={`${useCase.label}: ${useCase.description}`}
                    className={`group relative rounded-lg border-2 p-4 text-left transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background ${
                      selectedUseCase.id === useCase.id
                        ? "border-blue-500 bg-blue-500/10 shadow-md"
                        : "border-border bg-card hover:bg-card/80"
                    }`}
                  >
                    <Icon
                      className={`h-8 w-8 mb-2 transition-all duration-300 ${
                        selectedUseCase.id === useCase.id
                          ? "text-blue-500 scale-110"
                          : "text-muted-foreground group-hover:text-blue-500 group-hover:scale-110"
                      }`}
                      aria-hidden="true"
                    />
                    <p
                      className={`text-xs sm:text-sm font-medium transition-colors ${
                        selectedUseCase.id === useCase.id
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {useCase.label}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            {/* Selected Use Case Description */}
            <motion.div
              key={selectedUseCase.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
              className="mt-8 rounded-xl border border-border bg-gradient-to-br from-card/80 to-card/40 p-6 backdrop-blur-sm shadow-lg"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10" aria-hidden="true">
                  <selectedUseCase.icon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold">{selectedUseCase.label}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{selectedUseCase.description}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
