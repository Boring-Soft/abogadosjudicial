"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faq";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { trackFAQExpansion } from "@/lib/analytics";
import { HelpCircle } from "lucide-react";

export function FAQSection() {
  const prefersReducedMotion = useReducedMotion();
  const [openItem, setOpenItem] = useState<string>("");
  return (
    <section
      className="relative py-20 sm:py-32 bg-background"
      aria-label="Frequently asked questions"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <BlurFade delay={0} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <HelpCircle className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold text-foreground">
                Got Questions?
              </span>
            </div>
          </BlurFade>

          <BlurFade delay={0.1} duration={0.6}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </BlurFade>

          <BlurFade delay={0.2} duration={0.6}>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Everything you need to know about deploying AI agents for your
              business. Can&apos;t find an answer? Contact our support team.
            </p>
          </BlurFade>
        </div>

        {/* FAQ Accordion */}
        <motion.div
          className="mx-auto max-w-3xl"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.3 }}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4"
            value={openItem}
            onValueChange={(value) => {
              const faq = faqs.find((f) => f.id === value);
              if (faq) {
                trackFAQExpansion(faq.question, value !== "");
              }
              setOpenItem(value);
            }}
          >
            {faqs.map((faq, idx) => (
              <motion.div
                key={faq.id}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.4 + idx * 0.05 }}
              >
                <AccordionItem
                  value={faq.id}
                  className="border border-border rounded-lg px-6 bg-card hover:bg-card/80 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-semibold text-base sm:text-lg pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA Below FAQ */}
        <BlurFade delay={0.8} duration={0.6}>
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Still have questions?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-105 shadow-lg"
            >
              Contact Our Team
            </a>
          </div>
        </BlurFade>
      </div>

      {/* Background Decoration */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2">
          <div className="h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-3xl" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2">
          <div className="h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
