"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, Users } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: "120x",
    label: "Faster reach",
    description: "Connect with leads instantly",
  },
  {
    icon: Clock,
    value: "7 days",
    label: "Setup time",
    description: "From zero to automated",
  },
  {
    icon: Users,
    value: "50K+",
    label: "Users",
    description: "Trusted by companies worldwide",
  },
];

const logos = [
  { name: "Company 1", width: 120 },
  { name: "Company 2", width: 100 },
  { name: "Company 3", width: 140 },
  { name: "Company 4", width: 110 },
  { name: "Company 5", width: 130 },
  { name: "Company 6", width: 120 },
];

export function SocialProofSection() {
  return (
    <section className="py-20 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Trusted by banner */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-muted-foreground mb-8">
            TRUSTED BY 50,000+ COMPANIES
          </p>

          {/* Logo grid */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50">
            {logos.map((logo, idx) => (
              <div
                key={idx}
                className="h-12 bg-muted rounded"
                style={{ width: logo.width }}
              />
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative overflow-hidden rounded-lg border border-border bg-card p-8 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent" />
                <Icon className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
