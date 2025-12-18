import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import displayImage from "@/assets/display_variety.jpg";

const AboutPreview = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-sm overflow-hidden">
              <img
                src={displayImage}
                alt="Display of Jaipuri textile collection"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground px-8 py-6 shadow-lg">
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-2xl font-serif font-medium text-gold">500+</p>
                  <p className="text-xs text-primary-foreground/70 mt-1">Artisans</p>
                </div>
                <div className="w-px bg-primary-foreground/20" />
                <div className="text-center">
                  <p className="text-2xl font-serif font-medium text-gold">50K+</p>
                  <p className="text-xs text-primary-foreground/70 mt-1">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <span className="text-gold/80 font-medium tracking-[0.2em] text-xs uppercase">
              Our Heritage
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mt-4 mb-8 leading-tight">
              A Legacy of<br />Craftsmanship
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
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
            <Link to="/our-story" className="inline-block mt-10">
              <Button variant="outline" className="border-border text-foreground hover:bg-secondary/50 px-8 h-11 text-sm tracking-wide">
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
