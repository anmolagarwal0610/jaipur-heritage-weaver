import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl" />
      
      {/* Paisley Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="paisley" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10 2C6 2 2 6 2 10c0 6 8 8 8 8s8-2 8-8c0-4-4-8-8-8z" fill="currentColor" className="text-primary"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#paisley)"/>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <span className="inline-block text-gold font-medium tracking-widest text-sm uppercase mb-4 animate-fade-in">
              Handcrafted with Love
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Bring the Spirit of <span className="text-terracotta">Jaipur</span> to Your Home
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-lg mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Discover our exquisite collection of handblock printed bedsheets, quilts, and home decor — each piece a testament to Rajasthan's rich textile heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/shop">
                <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 px-8">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/our-story">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8">
                  Our Heritage
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image Grid */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80"
                    alt="Handblock printed bedsheet"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-secondary animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <img
                    src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80"
                    alt="Traditional Jaipur quilt"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="aspect-square rounded-2xl overflow-hidden bg-secondary animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80"
                    alt="Home decor cushions"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary animate-fade-in" style={{ animationDelay: "0.5s" }}>
                  <img
                    src="https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=600&q=80"
                    alt="Bedroom with Jaipur textiles"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-4 rounded-xl shadow-xl animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <p className="text-3xl font-serif font-bold">15+</p>
              <p className="text-xs text-primary-foreground/80">Years of Heritage</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
