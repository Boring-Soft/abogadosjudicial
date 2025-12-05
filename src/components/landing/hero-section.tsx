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
  Scale,
  FileText,
  Users,
  Gavel,
  Calendar,
  Shield,
  ArrowRight,
} from "lucide-react";

const useCases = [
  {
    id: "demandas-digitales",
    label: "Demandas Digitales",
    icon: FileText,
    description: "Presenta demandas con validación automática según Art. 110 y firma digital SHA-256",
  },
  {
    id: "citaciones-inteligentes",
    label: "Citaciones Inteligentes",
    icon: Users,
    description: "Gestiona citaciones personales, por cédula o edictos con seguimiento en tiempo real",
  },
  {
    id: "audiencias-virtuales",
    label: "Audiencias Virtuales",
    icon: Calendar,
    description: "Programa audiencias preliminares y complementarias con integración Google Meet",
  },
  {
    id: "resoluciones-plantillas",
    label: "Resoluciones Rápidas",
    icon: Gavel,
    description: "Emite providencias, autos y sentencias con plantillas personalizables",
  },
  {
    id: "sentencias-art-213",
    label: "Sentencias Art. 213",
    icon: Scale,
    description: "Estructura completa: Encabezamiento, Narrativa, Considerandos, Resolutiva y Cierre",
  },
  {
    id: "expediente-digital",
    label: "Expediente Digital",
    icon: Shield,
    description: "Documentos inmutables con hash SHA-256, plazos automáticos y notificaciones in-app",
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
      {/* Background decoration - colores de Bolivia */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 will-change-transform">
          <div className="h-[500px] w-[500px] rounded-full bg-red-600/10 blur-3xl" />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <div className="h-[300px] w-[300px] rounded-full bg-yellow-500/10 blur-3xl" />
        </div>
        <div className="absolute left-0 bottom-0">
          <div className="h-[400px] w-[400px] rounded-full bg-green-600/10 blur-3xl" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Headline with BlurFade */}
          <BlurFade delay={0} duration={0.6}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Scale className="h-12 w-12 text-primary" aria-hidden="true" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent leading-tight">
                Sistema Judicial Digital de Bolivia
              </h1>
            </div>
          </BlurFade>

          <BlurFade delay={0.2} duration={0.6}>
            <p className="mt-6 text-lg sm:text-xl leading-8 text-muted-foreground max-w-3xl mx-auto">
              Plataforma integral para la gestión de procesos judiciales. Conecta juzgados y abogados
              con expedientes digitales, firma digital, audiencias virtuales y cumplimiento del Código Procesal Civil.
            </p>
          </BlurFade>

          {/* Badges de confianza */}
          <BlurFade delay={0.3} duration={0.6}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>Firma Digital SHA-256</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-500" />
                <span>Código Procesal Civil</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-yellow-500" />
                <span>Documentos Inmutables</span>
              </div>
            </div>
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
                cta_text: "Registrarse Ahora",
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
                  Registrarse Ahora
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
                  href="/sign-in"
                  onClick={() => trackCTAClick({
                    cta_location: "hero",
                    cta_text: "Iniciar Sesión",
                    cta_type: "secondary",
                    destination_url: "/sign-in"
                  })}
                >
                  Iniciar Sesión
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Visual/Product Screenshot */}
          <BlurFade delay={0.6} duration={0.8}>
            <div className="mt-16 relative">
              <div className="relative rounded-xl border border-border/40 bg-gradient-to-b from-card/50 to-background/80 p-4 shadow-2xl backdrop-blur">
                <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-blue-500/20 via-slate-500/20 to-green-500/20 flex items-center justify-center">
                  {/* Placeholder for product screenshot */}
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/30 flex items-center justify-center">
                      <Scale className="w-12 h-12 text-blue-500" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Expediente Digital - Vista Previa</p>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      Gestiona demandas, citaciones, audiencias, resoluciones y sentencias desde una interfaz unificada
                    </p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-500/20 rounded-full blur-2xl" />
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
            aria-label="Funcionalidades del sistema"
          >
            <p
              id="use-case-label"
              className="text-sm font-semibold text-muted-foreground mb-6 tracking-wider"
            >
              FUNCIONALIDADES PRINCIPALES
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
