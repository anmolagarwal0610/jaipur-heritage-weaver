import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import TrustBadges from "@/components/home/TrustBadges";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutPreview from "@/components/home/AboutPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import InstagramFeed from "@/components/home/InstagramFeed";

const Index = () => {
  return (
    <Layout>
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
