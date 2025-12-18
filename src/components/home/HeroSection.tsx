import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import artisanImage from "@/assets/artisan.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <span className="inline-block text-gold/80 font-medium tracking-[0.25em] text-xs uppercase mb-6">
              Est. 2017 • Jaipur, India
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.1] mb-8 tracking-tight">
              Authentic Jaipuri
              <br />
              <span className="text-primary/80">Handcrafted</span> Textiles
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              From the artisan workshops of Sanganer to your home — discover 
              hand block printed bedsheets, quilts, and home décor that carry 
              centuries of Rajasthani heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/shop">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-12 text-sm tracking-wide">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/our-story">
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary/50 px-10 h-12 text-sm tracking-wide">
                  Our Heritage
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="aspect-[4/5] rounded-sm overflow-hidden">
              <img
                src={artisanImage}
                alt="Jaipuri artisan hand block printing textiles"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Subtle accent */}
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-gold/20 rounded-sm" />
            <div className="absolute -top-4 -right-4 w-24 h-24 border border-gold/20 rounded-sm" />
            
            {/* Years badge */}
            <div className="absolute bottom-8 -left-6 bg-background border border-border px-6 py-4 shadow-sm">
              <p className="text-3xl font-serif font-medium text-primary">7+</p>
              <p className="text-xs text-muted-foreground tracking-wide">Years of Heritage</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
