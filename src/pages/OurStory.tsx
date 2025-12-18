import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const OurStory = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80"
            alt="Heritage background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-gold font-medium tracking-widest text-sm uppercase">
              Our Heritage
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mt-4 mb-6">
              Weaving Stories Through Generations
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              From the narrow lanes of Sanganer to homes across India, discover the journey of Jaipur Touch.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-gold font-medium tracking-widest text-sm uppercase">
                Where It All Began
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mt-2 mb-6">
                The Roots of Tradition
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our story begins in the vibrant city of Jaipur, where the art of block printing has flourished 
                  for over 500 years. In the town of Sanganer, just south of the Pink City, generations of artisan 
                  families have dedicated their lives to this ancient craft.
                </p>
                <p>
                  Jaipur Touch was founded in 2008 by Ramesh Sharma, whose family has been practicing block printing 
                  for four generations. What started as a small workshop with five artisans has grown into a 
                  community of over 500 craftspeople, all united by their passion for preserving this precious heritage.
                </p>
                <p>
                  Today, every piece that carries the Jaipur Touch name is a testament to centuries of accumulated 
                  knowledge, skill, and artistic expression.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80"
                  alt="Artisan at work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gold text-gold-foreground p-6 rounded-xl">
                <p className="text-4xl font-serif font-bold">500+</p>
                <p className="text-sm">Years of Heritage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Craft */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-gold font-medium tracking-widest text-sm uppercase">
              The Art
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mt-2">
              The Block Printing Process
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Design & Carving",
                description: "Master craftsmen hand-carve intricate designs into wooden blocks made from teak. Each block can take up to a week to complete.",
                image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80",
              },
              {
                step: "02",
                title: "Natural Dyes",
                description: "We use vegetable and mineral dyes sourced from indigo, pomegranate, and other natural sources — gentle on skin and the environment.",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
              },
              {
                step: "03",
                title: "Hand Printing",
                description: "Each fabric is printed by hand, one block impression at a time. A single bedsheet can require over 1,000 individual impressions.",
                image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-gold font-serif text-4xl font-bold">{item.step}</span>
                <h3 className="font-serif text-xl font-semibold text-foreground mt-2 mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=400&q=80"
                    alt="Artisan community"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] rounded-xl overflow-hidden mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80"
                    alt="Quality products"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-gold font-medium tracking-widest text-sm uppercase">
                Our Values
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mt-2 mb-6">
                What We Stand For
              </h2>
              <div className="space-y-6">
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
                    description: "Every piece undergoes rigorous quality checks. We stand behind our products with a satisfaction guarantee.",
                  },
                ].map((value, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0" />
                    <div>
                      <h3 className="font-serif font-semibold text-foreground">{value.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            Experience the Jaipur Touch
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Each purchase supports traditional artisan families and helps preserve India's textile heritage.
          </p>
          <Link to="/shop">
            <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              Shop Our Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default OurStory;
