import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Heart, Users, Leaf } from "lucide-react";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-gold font-medium tracking-widest text-sm uppercase">
              About Us
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mt-4 mb-6">
              Bringing Jaipur's Heritage to Your Home
            </h1>
            <p className="text-muted-foreground text-lg">
              We are a passionate team dedicated to preserving and promoting India's rich textile traditions 
              while delivering premium quality home decor to customers across the country.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-2xl">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">Our Mission</h2>
              <p className="text-primary-foreground/80 leading-relaxed">
                To make authentic, handcrafted Jaipur textiles accessible to every Indian home while 
                supporting traditional artisan communities and sustainable practices. We believe that 
                beautiful, quality home decor should tell a story — of heritage, craftsmanship, and care.
              </p>
            </div>
            <div className="bg-secondary p-8 md:p-12 rounded-2xl">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To become India's most trusted name in handcrafted home textiles, recognized for our 
                commitment to quality, authenticity, and artisan welfare. We envision a future where 
                traditional crafts thrive alongside modern commerce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-gold font-medium tracking-widest text-sm uppercase">
              Why Choose Us
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mt-2">
              The Jaipur Touch Difference
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: "Premium Quality",
                description: "100% cotton, color-fast dyes, and rigorous quality checks on every piece.",
              },
              {
                icon: Heart,
                title: "Handcrafted with Love",
                description: "Each product is made by skilled artisans using traditional techniques.",
              },
              {
                icon: Users,
                title: "Direct from Artisans",
                description: "We cut out middlemen, ensuring fair prices for you and better wages for artisans.",
              },
              {
                icon: Leaf,
                title: "Eco-Friendly",
                description: "Natural dyes, sustainable materials, and minimal plastic packaging.",
              },
            ].map((item, index) => (
              <div key={index} className="bg-card p-6 rounded-xl text-center">
                <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "15+", label: "Years Experience" },
              { number: "500+", label: "Artisan Partners" },
              { number: "50K+", label: "Happy Customers" },
              { number: "10K+", label: "Products Sold" },
            ].map((stat, index) => (
              <div key={index}>
                <p className="font-serif text-4xl md:text-5xl font-bold text-gold">{stat.number}</p>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            Ready to Transform Your Home?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Explore our collection of handcrafted bedsheets, quilts, and home decor.
          </p>
          <Link to="/shop">
            <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default About;
