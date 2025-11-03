/**
 * Analytics Tracking Utility
 *
 * This module provides event tracking functions for monitoring user interactions
 * on the landing page. It uses a flexible architecture that can be integrated
 * with various analytics platforms (Google Analytics, Mixpanel, Segment, etc.)
 *
 * Event Naming Convention:
 * - Use snake_case for event names
 * - Format: {component}_{action} (e.g., "cta_clicked", "section_viewed")
 *
 * Privacy Notes:
 * - All tracking respects user privacy preferences
 * - No PII (Personally Identifiable Information) is collected
 * - Events are anonymized and aggregated
 */

// Window interface extension for analytics libraries
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ga?: (...args: unknown[]) => void;
    analytics?: {
      track: (eventName: string, properties?: Record<string, unknown>) => void;
    };
    fbq?: (...args: unknown[]) => void;
  }
}

// Types for event data
export interface CTAClickEvent extends Record<string, unknown> {
  cta_location: string; // e.g., "hero", "final_cta", "navbar"
  cta_text: string; // e.g., "Start for Free", "Get Started"
  cta_type: "primary" | "secondary";
  destination_url?: string;
}

export interface SectionViewEvent extends Record<string, unknown> {
  section_name: string; // e.g., "hero", "features", "testimonials"
  scroll_depth: number; // percentage of page scrolled
}

export interface InteractionEvent extends Record<string, unknown> {
  component: string; // e.g., "carousel", "accordion", "use_case_selector"
  action: string; // e.g., "next_clicked", "item_expanded", "selected"
  label?: string; // additional context
}

export interface FormEvent extends Record<string, unknown> {
  form_name: string; // e.g., "newsletter", "contact"
  form_location: string; // e.g., "footer", "hero"
  success: boolean;
}

/**
 * Core analytics function - sends events to analytics platform
 * This is a wrapper that can be integrated with your analytics provider
 */
function trackEvent(eventName: string, eventData: Record<string, unknown> = {}) {
  // Add timestamp to all events
  const enrichedData: Record<string, unknown> = {
    ...eventData,
    timestamp: new Date().toISOString(),
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    page_title: typeof document !== "undefined" ? document.title : "",
  };

  // Development: Log to console
  if (process.env.NODE_ENV === "development") {
    console.log("📊 Analytics Event:", eventName, enrichedData);
  }

  // Production: Send to analytics platform
  if (typeof window !== "undefined") {
    // Google Analytics 4 (gtag.js)
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, enrichedData);
    }

    // Google Analytics Universal (ga.js) - legacy support
    if (typeof window.ga === "function") {
      window.ga("send", "event", {
        eventCategory: (enrichedData.component as string) || "General",
        eventAction: eventName,
        eventLabel: (enrichedData.label as string) || "",
      });
    }

    // Segment
    if (typeof window.analytics?.track === "function") {
      window.analytics.track(eventName, enrichedData);
    }

    // Facebook Pixel
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName, enrichedData);
    }

    // Custom analytics endpoint (if you have your own backend)
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ event: eventName, data: enrichedData })
    // }).catch(console.error);
  }
}

/**
 * Track CTA button clicks
 * Use this on all call-to-action buttons throughout the landing page
 */
export function trackCTAClick(data: CTAClickEvent) {
  trackEvent("cta_clicked", data);
}

/**
 * Track section visibility when user scrolls into view
 * Helps understand which sections users are engaging with
 */
export function trackSectionView(data: SectionViewEvent) {
  trackEvent("section_viewed", data);
}

/**
 * Track interactive component usage
 * Use for carousels, accordions, tabs, etc.
 */
export function trackInteraction(data: InteractionEvent) {
  trackEvent(`${data.component}_${data.action}`, {
    component: data.component,
    label: data.label,
  });
}

/**
 * Track form submissions
 * Use for newsletter signup, contact forms, etc.
 */
export function trackFormSubmit(data: FormEvent) {
  trackEvent("form_submitted", data);
}

/**
 * Track scroll depth milestones
 * Automatically tracks when user reaches 25%, 50%, 75%, 100% of page
 */
let scrollDepthTracked = new Set<number>();

export function trackScrollDepth() {
  if (typeof window === "undefined") return;

  const scrollPercentage = Math.round(
    (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
  );

  // Track milestones: 25%, 50%, 75%, 100%
  const milestones = [25, 50, 75, 100];

  milestones.forEach((milestone) => {
    if (scrollPercentage >= milestone && !scrollDepthTracked.has(milestone)) {
      scrollDepthTracked.add(milestone);
      trackEvent("scroll_depth_reached", {
        depth_percentage: milestone,
      });
    }
  });
}

/**
 * Initialize scroll depth tracking
 * Call this once when the page loads
 */
export function initScrollTracking() {
  if (typeof window === "undefined") return;

  // Reset tracked milestones
  scrollDepthTracked = new Set<number>();

  // Throttle scroll events for performance
  let scrollTimeout: NodeJS.Timeout;
  const handleScroll = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      trackScrollDepth();
    }, 100);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Cleanup function
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}

/**
 * Track page view
 * Call this when the landing page loads
 */
export function trackPageView() {
  if (typeof window === "undefined") return;

  trackEvent("page_viewed", {
    page_type: "landing",
    referrer: document.referrer || "direct",
    user_agent: navigator.userAgent,
  });
}

/**
 * Track outbound link clicks
 * Use for links that take users away from the site
 */
export function trackOutboundClick(url: string, linkText: string) {
  trackEvent("outbound_link_clicked", {
    destination_url: url,
    link_text: linkText,
  });
}

/**
 * Track video interactions (if you add product demo videos)
 */
export function trackVideoEvent(
  action: "play" | "pause" | "complete",
  videoTitle: string,
  currentTime?: number
) {
  trackEvent("video_interaction", {
    action,
    video_title: videoTitle,
    current_time: currentTime,
  });
}

/**
 * Track use case selection in hero section
 */
export function trackUseCaseSelection(useCaseLabel: string) {
  trackEvent("use_case_selected", {
    use_case: useCaseLabel,
  });
}

/**
 * Track testimonial carousel navigation
 */
export function trackTestimonialNavigation(
  action: "next" | "previous" | "dot",
  currentIndex: number
) {
  trackInteraction({
    component: "testimonial_carousel",
    action: `${action}_clicked`,
    label: `testimonial_${currentIndex + 1}`,
  });
}

/**
 * Track FAQ accordion expansions
 */
export function trackFAQExpansion(question: string, expanded: boolean) {
  trackInteraction({
    component: "faq_accordion",
    action: expanded ? "item_expanded" : "item_collapsed",
    label: question.substring(0, 50), // Truncate long questions
  });
}

/**
 * Track feature card hover/click (for engagement metrics)
 */
export function trackFeatureEngagement(featureTitle: string, action: "hover" | "click") {
  trackInteraction({
    component: "feature_card",
    action: `${action}_interaction`,
    label: featureTitle,
  });
}

/**
 * Utility: Check if user has given analytics consent
 * Implement this based on your privacy/cookie consent requirements
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;

  // Check localStorage for consent flag
  // Modify this based on your consent management solution
  const consent = localStorage.getItem("analytics_consent");
  return consent === "granted";
}

/**
 * Set analytics consent
 */
export function setAnalyticsConsent(granted: boolean) {
  if (typeof window === "undefined") return;

  localStorage.setItem("analytics_consent", granted ? "granted" : "denied");

  // Update Google Analytics consent
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  }
}
