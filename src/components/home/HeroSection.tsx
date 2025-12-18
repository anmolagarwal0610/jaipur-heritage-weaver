/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Hero image visible on all screen sizes
 * - Stack layout on mobile: image above, text below
 * - Touch targets minimum 44x44px
 * - Decorative elements hidden on mobile
 * - Maintain responsive design in all future edits
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import artisanImage from "@/assets/artisan_3.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <span className="inline-block text-gold/80 font-medium tracking-[0.25em] text-xs uppercase mb-4 md:mb-6">
              Est. 2017 • Jaipur, India
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.1] mb-6 md:mb-8 tracking-tight">
              Authentic Jaipuri
              <br />
              <span className="text-primary/80">Handcrafted</span> Textiles
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 md:mb-10">
              From the artisan workshops of Sanganer to your home — discover 
              hand block printed bedsheets, quilts, and home décor that carry 
              centuries of Rajasthani heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link to="/shop">
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 md:px-10 h-12 text-sm tracking-wide">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/our-story">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-border text-foreground hover:bg-secondary/50 px-8 md:px-10 h-12 text-sm tracking-wide">
                  Our Heritage
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image - Now visible on all screens */}
          <div className="relative w-full max-w-md lg:max-w-none mx-auto">
            <div className="aspect-[4/5] rounded-sm overflow-hidden">
              <img
                src={artisanImage}
                alt="Jaipuri artisan hand block printing textiles"
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
            
            {/* Subtle accent - hidden on mobile */}
            <div className="hidden lg:block absolute -bottom-4 -left-4 w-32 h-32 border border-gold/20 rounded-sm" />
            <div className="hidden lg:block absolute -top-4 -right-4 w-24 h-24 border border-gold/20 rounded-sm" />
            
            {/* Years badge - responsive positioning */}
            <div className="absolute bottom-4 left-4 lg:bottom-8 lg:-left-6 bg-background border border-border px-4 py-3 lg:px-6 lg:py-4 shadow-sm">
              <p className="text-2xl lg:text-3xl font-serif font-medium text-primary">7+</p>
              <p className="text-[10px] lg:text-xs text-muted-foreground tracking-wide">Years of Heritage</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
