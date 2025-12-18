import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AboutPreview = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80"
                  alt="Artisan at work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] rounded-xl overflow-hidden mt-8">
                <img
                  src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80"
                  alt="Block printing process"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-8 py-4 rounded-xl shadow-xl flex gap-8">
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-gold">500+</p>
                <p className="text-xs text-primary-foreground/70">Artisans</p>
              </div>
              <div className="w-px bg-primary-foreground/20" />
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-gold">50K+</p>
                <p className="text-xs text-primary-foreground/70">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <span className="text-gold font-medium tracking-widest text-sm uppercase">
              Our Heritage
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mt-2 mb-6">
              A Legacy of Craftsmanship
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Jaipur Touch was born from a deep reverence for Rajasthan's centuries-old textile traditions. 
                Our journey began in the narrow lanes of Sanganer, where master artisans have been practicing 
                the art of hand block printing for generations.
              </p>
              <p>
                Each piece in our collection tells a story — carved wooden blocks dipped in natural dyes, 
                pressed onto fine cotton with practiced precision. It's a dance of patience and passion 
                that transforms fabric into art.
              </p>
              <p>
                Today, we work directly with over 500 artisan families, ensuring fair wages and preserving 
                these ancient techniques for future generations.
              </p>
            </div>
            <Link to="/our-story" className="inline-block mt-8">
              <Button className="bg-gold text-gold-foreground hover:bg-gold/90">
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
