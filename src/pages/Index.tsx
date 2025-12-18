/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - All sections are fully responsive (tested 375px+)
 * - Touch targets minimum 44x44px
 * - Images use lazy loading for performance
 * - Maintain responsive design in all future edits
 */

import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import TrustBadges from "@/components/home/TrustBadges";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutPreview from "@/components/home/AboutPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import InstagramFeed from "@/components/home/InstagramFeed";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <Layout>
      <SEO 
        title="Jaipur Touch - Premium Handcrafted Bedsheets & Home Decor"
        description="Discover authentic Jaipur handblock printed bedsheets, quilts, and home decor. Premium quality, heritage craftsmanship, delivered to your doorstep."
        canonical="/"
      />
      <HeroSection />
      <TrustBadges />
      <CategorySection />
      <FeaturedProducts />
      <AboutPreview />
      <TestimonialsSection />
      <InstagramFeed />
    </Layout>
  );
};

export default Index;
