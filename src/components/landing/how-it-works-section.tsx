"use client";

import { motion } from "framer-motion";
import { FileText, Brain, Plug, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Provide business context",
    description:
      "Tell us about your business, goals, and processes. Our AI learns what makes your business unique.",
  },
  {
    number: "02",
    icon: Brain,
    title: "Train your agent",
    description:
      "Customize your AI agent's personality, responses, and workflows to match your brand perfectly.",
  },
  {
    number: "03",
    icon: Plug,
    title: "Integrate with 1,000+ tools",
    description:
      "Connect seamlessly with your CRM, calendar, and favorite tools. Start automating in minutes.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in three simple steps. No technical knowledge required.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative"
                >
                  {/* Connector line (desktop only) */}
                  {idx < steps.length - 1 && (
                    <div className="absolute top-16 left-full hidden w-full lg:block">
                      <ArrowRight className="h-6 w-6 text-muted-foreground mx-auto -translate-x-1/2" />
                    </div>
                  )}

                  <div className="relative overflow-hidden rounded-lg border border-border bg-card p-8 h-full">
                    {/* Step number */}
                    <div className="absolute top-4 right-4 text-6xl font-bold text-muted opacity-20">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                      <Icon className="h-8 w-8 text-blue-500" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              asChild
            >
              <Link href="/sign-up">Get Started Now</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
