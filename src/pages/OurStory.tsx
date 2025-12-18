/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - All sections stack on mobile
 * - Floating badges positioned inside containers on mobile
 * - Images use lazy loading for performance
 * - Touch targets minimum 44x44px
 * - Maintain responsive design in all future edits
 */

import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import artisanAnimated from "@/assets/artisan_animated.png";
import artisan2 from "@/assets/artisan_2.jpg";

const OurStory = () => {
  return (
    <Layout>
      <SEO 
        title="Our Story - Jaipur Touch Heritage & Craftsmanship"
        description="Discover the story behind Jaipur Touch. Founded by Suhani Agarwal, we connect Sanganer's artisan families with homes worldwide, preserving centuries-old textile traditions."
        canonical="/our-story"
      />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-gold font-medium tracking-[0.25em] text-xs uppercase">
              Our Heritage
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium mt-4 md:mt-6 mb-6 md:mb-8 leading-tight">
              Weaving Stories Through Generations
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              From the narrow lanes of Sanganer to homes across India and beyond — 
              discover the journey of Jaipur Touch and our commitment to preserving 
              Rajasthan's textile heritage.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-gold/80 font-medium tracking-[0.2em] text-xs uppercase">
                The Beginning
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-foreground mt-4 mb-6 md:mb-8 leading-tight">
                Where It All Started
              </h2>
              <div className="space-y-4 md:space-y-5 text-muted-foreground text-sm md:text-base leading-relaxed">
                <p>
                  Seven years ago, <strong className="text-foreground">Suhani Agarwal</strong> founded 
                  Snare Decor with a dream that felt both ambitious and deeply personal — to share 
                  the breathtaking artistry of Jaipur's textile craftsmen with the world.
                </p>
                <p>
                  Growing up surrounded by the vibrant colors and intricate patterns of Rajasthani 
                  textiles, Suhani witnessed firsthand how skilled artisans poured their hearts into 
                  every piece they created. Yet, she also saw how these master craftspeople struggled 
                  to find markets that valued their work fairly.
                </p>
                <p>
                  <strong className="text-foreground">Jaipur Touch</strong> was born as a bridge — 
                  connecting the talented hands of Sanganer's artisan families to homes that would 
                  cherish their creations. What started as a small collection has grown into a 
                  movement, empowering over 500 artisan families while preserving techniques 
                  passed down through generations.
                </p>
                <p>
                  Today, every Jaipur Touch piece carries not just beautiful patterns, but the 
                  warmth of hands that crafted it and the legacy of a craft that has flourished 
                  for over five centuries.
                </p>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-[4/5] rounded-sm overflow-hidden">
                <img
                  src={artisanAnimated}
                  alt="Jaipuri artisan practicing traditional block printing"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {/* Years badge - responsive positioning */}
              <div className="absolute bottom-4 left-4 lg:static lg:absolute lg:-bottom-6 lg:-left-6 bg-gold text-gold-foreground p-4 lg:p-6 shadow-lg">
                <p className="text-3xl lg:text-4xl font-serif font-medium">7</p>
                <p className="text-xs lg:text-sm mt-1">Years of Snare Decor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-gold/80 font-medium tracking-[0.2em] text-xs uppercase">
              Our Mission
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-foreground mt-4 mb-6 md:mb-8">
              Taking Jaipuri Culture Global
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              Our goal is simple yet profound — to promote local artisans and take Jaipuri 
              culture and designs to every corner of the globe. We believe that when you 
              choose authentic handcrafted textiles, you're not just decorating your home; 
              you're supporting families, preserving traditions, and owning a piece of 
              living history.
            </p>
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12">
              <div className="text-center">
                <p className="text-2xl md:text-4xl font-serif font-medium text-primary">500+</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Artisan Families</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-4xl font-serif font-medium text-primary">50K+</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-4xl font-serif font-medium text-primary">100%</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">Handcrafted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Craft */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-gold/80 font-medium tracking-[0.2em] text-xs uppercase">
              The Art
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-foreground mt-4">
              The Block Printing Process
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "01",
                title: "Design & Carving",
                description: "Master craftsmen hand-carve intricate designs into wooden blocks made from teak. Each block can take up to a week to complete, with patterns passed down through generations.",
              },
              {
                step: "02",
                title: "Natural Dyes",
                description: "We use vegetable and mineral dyes sourced from indigo, pomegranate, turmeric, and other natural sources — gentle on skin and kind to the environment.",
              },
              {
                step: "03",
                title: "Hand Printing",
                description: "Each fabric is printed by hand, one block impression at a time. A single bedsheet can require over 1,000 individual impressions, each placed with practiced precision.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <span className="text-gold font-serif text-4xl md:text-5xl font-medium">{item.step}</span>
                <h3 className="font-serif text-lg md:text-xl font-medium text-foreground mt-3 md:mt-4 mb-3 md:mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <span className="text-gold/80 font-medium tracking-[0.2em] text-xs uppercase">
                Our Values
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-foreground mt-4 mb-8 md:mb-10">
                What We Stand For
              </h2>
              <div className="space-y-6 md:space-y-8">
                {[
                  {
                    title: "Artisan Empowerment",
                    description: "We work directly with artisan families, ensuring fair wages and sustainable livelihoods. Our artisans are partners, not just suppliers.",
                  },
                  {
                    title: "Sustainable Practices",
                    description: "From natural dyes to eco-friendly packaging, we're committed to minimizing our environmental footprint at every step.",
                  },
                  {
                    title: "Heritage Preservation",
                    description: "We're not just selling products — we're keeping a centuries-old art form alive for future generations.",
                  },
                  {
                    title: "Quality Excellence",
                    description: "Every piece undergoes rigorous quality checks. We stand behind our products with complete satisfaction guarantee.",
                  },
                ].map((value, index) => (
                  <div key={index} className="flex gap-4 md:gap-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 md:mt-2.5 shrink-0" />
                    <div>
                      <h3 className="font-serif font-medium text-foreground text-base md:text-lg">{value.title}</h3>
                      <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-sm overflow-hidden">
                <img
                  src={artisan2}
                  alt="Traditional block printing craftsmanship in Jaipur"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium mb-4 md:mb-6">
            Experience the Jaipur Touch
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 md:mb-10 text-sm md:text-base leading-relaxed">
            Each purchase supports traditional artisan families and helps preserve 
            India's textile heritage for generations to come.
          </p>
          <Link to="/shop">
            <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 px-8 md:px-10 h-11 md:h-12 text-sm tracking-wide">
              Shop Our Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default OurStory;
