"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/testimonials";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { trackTestimonialNavigation } from "@/lib/analytics";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleNext = useCallback(() => {
    setDirection(1);
    const newIndex = (currentIndex + 1) % testimonials.length;
    setCurrentIndex(newIndex);
    trackTestimonialNavigation("next", newIndex);
  }, [currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, handleNext]);

  const handlePrev = () => {
    setDirection(-1);
    const newIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    setCurrentIndex(newIndex);
    trackTestimonialNavigation("previous", newIndex);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    trackTestimonialNavigation("dot", index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: prefersReducedMotion ? 0 : (direction > 0 ? 1000 : -1000),
      opacity: prefersReducedMotion ? 1 : 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: prefersReducedMotion ? 0 : (direction < 0 ? 1000 : -1000),
      opacity: prefersReducedMotion ? 1 : 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section
      className="relative py-20 sm:py-32 bg-gradient-to-b from-background to-background/50"
      aria-label="Customer testimonials"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Trust Indicators Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <BlurFade delay={0} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Star className="w-4 h-4 text-blue-500 fill-blue-500" />
              <span className="text-sm font-semibold text-foreground">
                Trusted by 50,000+ Businesses
              </span>
            </div>
          </BlurFade>

          <BlurFade delay={0.1} duration={0.6}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Loved by Teams Worldwide
            </h2>
          </BlurFade>

          <BlurFade delay={0.2} duration={0.6}>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              See how businesses like yours are transforming their operations
              with AI automation.
            </p>
          </BlurFade>
        </div>

        {/* Carousel Container */}
        <div
          className="relative mx-auto max-w-4xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full w-12 h-12 shadow-lg hover:scale-110 transition-transform"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full w-12 h-12 shadow-lg hover:scale-110 transition-transform"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Testimonial Cards */}
          <div className="relative overflow-hidden min-h-[400px] flex items-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    handleNext();
                  } else if (swipe > swipeConfidenceThreshold) {
                    handlePrev();
                  }
                }}
                className="w-full"
              >
                <Card className="border-2 border-border bg-card shadow-xl">
                  <CardContent className="p-8 sm:p-12">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="p-3 rounded-full bg-blue-500/10">
                        <Quote className="w-8 h-8 text-blue-500" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Rating */}
                    <div
                      className="flex justify-center gap-1 mb-6"
                      role="img"
                      aria-label={`${testimonials[currentIndex].rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonials[currentIndex].rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>

                    {/* Testimonial Content */}
                    <blockquote className="text-center mb-8">
                      <p className="text-lg sm:text-xl leading-relaxed text-foreground font-medium">
                        &ldquo;{testimonials[currentIndex].content}&rdquo;
                      </p>
                    </blockquote>

                    {/* Author Info */}
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="w-16 h-16 border-2 border-blue-500/20">
                        <AvatarFallback className="text-lg font-semibold bg-blue-500/10 text-blue-500">
                          {testimonials[currentIndex].name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="text-center">
                        <p className="font-semibold text-foreground">
                          {testimonials[currentIndex].name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonials[currentIndex].role}
                        </p>
                        <p className="text-sm text-blue-500 font-medium">
                          {testimonials[currentIndex].company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot Indicators */}
          <div
            className="flex justify-center gap-2 mt-8"
            role="tablist"
            aria-label="Testimonial navigation"
          >
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-blue-500"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Row Below Carousel */}
        <BlurFade delay={0.4} duration={0.6}>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">4.9/5</div>
              <p className="text-sm text-muted-foreground">
                Average Customer Rating
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">50K+</div>
              <p className="text-sm text-muted-foreground">
                Active Business Users
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">98%</div>
              <p className="text-sm text-muted-foreground">
                Customer Satisfaction
              </p>
            </div>
          </div>
        </BlurFade>
      </div>

      {/* Background Decoration */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-3xl" />
        </div>
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
