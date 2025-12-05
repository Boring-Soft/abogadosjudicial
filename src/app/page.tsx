import { PublicHeader } from "@/components/navigation/public-header";
import { PublicFooter } from "@/components/navigation/public-footer";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { SocialProofSection } from "@/components/landing/social-proof-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { CapabilitiesSection } from "@/components/landing/capabilities-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FinalCTASection } from "@/components/landing/final-cta-section";
import { AnalyticsProvider } from "@/components/analytics-provider";

export const metadata = {
  title: "Sistema de Gestión Procesal Judicial - Bolivia",
  description:
    "Plataforma digital integral para la gestión de procesos judiciales en Bolivia. Automatiza demandas, citaciones, audiencias y sentencias con firma digital y notificaciones en tiempo real.",
};

export default function Home() {

  return (
    <AnalyticsProvider>
      <div className="flex flex-col min-h-screen">
        <PublicHeader />

        <main className="flex-grow">
          <HeroSection />
          <FeaturesSection />
          <SocialProofSection />
          <TestimonialsSection />
          <HowItWorksSection />
          <CapabilitiesSection />
          <FAQSection />
          <FinalCTASection />
        </main>

        <PublicFooter />
      </div>
    </AnalyticsProvider>
  );
}
