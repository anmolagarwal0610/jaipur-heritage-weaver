/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Grid stacks on mobile (single column)
 * - Floating stats positioned inside image on mobile
 * - Images use lazy loading
 * - Touch targets minimum 44x44px
 * - Maintain responsive design in all future edits
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import displayImage from "@/assets/display_variety.webp";

const AboutPreview = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-sm overflow-hidden">
              <img
                src={displayImage}
                alt="Display of Jaipuri textile collection featuring handblock prints"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            
            {/* Floating Stats - responsive positioning */}
            <div className="absolute bottom-4 right-4 lg:static lg:absolute lg:-bottom-6 lg:-right-6 bg-primary text-primary-foreground px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6 shadow-lg">
              <div className="flex gap-4 sm:gap-6 lg:gap-8">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-serif font-medium text-gold">500+</p>
                  <p className="text-[10px] sm:text-xs text-primary-foreground/70 mt-1">Artisans</p>
                </div>
                <div className="w-px bg-primary-foreground/20" />
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-serif font-medium text-gold">50K+</p>
                  <p className="text-[10px] sm:text-xs text-primary-foreground/70 mt-1">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <span className="text-gold/80 font-medium tracking-[0.2em] text-xs uppercase">
              Our Heritage
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-foreground mt-4 mb-6 md:mb-8 leading-tight">
              A Legacy of<br />Craftsmanship
            </h2>
            <div className="space-y-4 md:space-y-5 text-muted-foreground text-sm md:text-base leading-relaxed">
              <p>
                Jaipur Touch was born from a deep reverence for Rajasthan's centuries-old 
                textile traditions. Founded by Suhani Agarwal under Snare Decor, our journey 
                began with a simple vision — to bring the magic of Jaipuri craftsmanship 
                to homes across the world.
              </p>
              <p>
                Each piece in our collection tells a story — carved wooden blocks dipped 
                in natural dyes, pressed onto fine cotton with practiced precision. It's 
                a dance of patience and passion that transforms fabric into art.
              </p>
            </div>
            <Link to="/our-story" className="inline-block mt-8 md:mt-10">
              <Button variant="outline" className="border-border text-foreground hover:bg-secondary/50 px-6 md:px-8 h-11 text-sm tracking-wide">
                Read Our Story
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
