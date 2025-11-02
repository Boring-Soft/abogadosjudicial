"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PublicHeader } from "@/components/navigation/public-header";
import { PublicFooter } from "@/components/navigation/public-footer";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annually: 0 },
    description: "Perfect for testing and small projects",
    features: [
      "10,000 credits/month",
      "1 AI agent",
      "1 user",
      "Basic integrations",
      "Email support",
    ],
    limitations: [
      "Limited to 1 agent",
      "Basic features only",
      "Community support",
    ],
    cta: "Start Free",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: { monthly: 99, annually: 79 },
    description: "For growing teams and businesses",
    features: [
      "100,000 credits/month",
      "Unlimited AI agents",
      "5 users",
      "All integrations",
      "Priority support",
      "Custom workflows",
      "Advanced analytics",
    ],
    limitations: [],
    cta: "Start Free Trial",
    href: "/sign-up?plan=pro",
    highlighted: true,
  },
  {
    name: "Business",
    price: { monthly: 249, annually: 199 },
    description: "For established businesses scaling fast",
    features: [
      "250,000 credits/month",
      "Unlimited AI agents",
      "12 users",
      "Premium integrations",
      "24/7 priority support",
      "Custom workflows",
      "Advanced analytics",
      "Dedicated account manager",
      "Custom training",
    ],
    limitations: [],
    cta: "Start Free Trial",
    href: "/sign-up?plan=business",
    highlighted: false,
  },
  {
    name: "Scale Up",
    price: { monthly: 499, annually: 399 },
    description: "For enterprises with high-volume needs",
    features: [
      "500,000 credits/month",
      "Unlimited AI agents",
      "Unlimited users",
      "All integrations + custom",
      "24/7 dedicated support",
      "Custom workflows",
      "Enterprise analytics",
      "Dedicated success manager",
      "Custom SLA",
      "On-premise option",
    ],
    limitations: [],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "What are credits?",
    answer:
      "Credits represent the number of AI interactions (calls, messages, etc.) your agents can make. Each interaction consumes credits based on duration and complexity.",
  },
  {
    question: "Can I upgrade or downgrade anytime?",
    answer:
      "Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the end of your current billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes, all paid plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "What happens if I run out of credits?",
    answer:
      "Your agents will pause until the next billing cycle or you can purchase additional credit packs at any time.",
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly"
  );

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Choose the perfect plan for your business. All plans include a 14-day
              free trial.
            </p>
          </div>

          {/* Billing toggle */}
          <div className="mt-12 flex justify-center">
            <Tabs
              value={billingCycle}
              onValueChange={(value) =>
                setBillingCycle(value as "monthly" | "annually")
              }
            >
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annually">
                  Annually
                  <span className="ml-2 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-500">
                    Save 20%
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Pricing cards */}
          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-lg border p-8 ${
                  plan.highlighted
                    ? "border-blue-500 ring-2 ring-blue-500 shadow-lg scale-105"
                    : "border-border"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>

                  <div className="mt-6">
                    <div className="flex items-baseline gap-x-2">
                      <span className="text-4xl font-bold">
                        ${plan.price[billingCycle]}
                      </span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                    {billingCycle === "annually" && plan.price.monthly > 0 && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        ${plan.price.annually * 12} billed annually
                      </p>
                    )}
                  </div>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <li
                        key={`limit-${idx}`}
                        className="flex items-start gap-3 opacity-50"
                      >
                        <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={`mt-8 w-full ${
                    plan.highlighted
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : ""
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mx-auto mt-32 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently asked questions
            </h2>
            <div className="space-y-8">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-border pb-8">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mx-auto mt-32 max-w-2xl rounded-2xl border border-border bg-card/50 backdrop-blur p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                asChild
              >
                <Link href="/sign-up">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
