/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Grid is 2 columns on mobile, 3 on tablet+
 * - Images use lazy loading for performance
 * - Touch targets minimum 44x44px
 * - Maintain responsive design in all future edits
 */

import { Link } from "react-router-dom";
import bedsheetsImg from "@/assets/bedsheets.jpg";
import quiltImg from "@/assets/quilt.jpg";
import curtainsImg from "@/assets/curtains.jpg";
import cushionImg from "@/assets/cushion_throws.jpg";
import tableLinenImg from "@/assets/table_linen.jpg";
import bathrobeImg from "@/assets/bathrobe_towels.jpg";

const categories = [
  {
    name: "Bedsheets",
    image: bedsheetsImg,
    href: "/shop?category=bedsheets",
  },
  {
    name: "Quilts & Dohars",
    image: quiltImg,
    href: "/shop?category=quilts",
  },
  {
    name: "Curtains",
    image: curtainsImg,
    href: "/shop?category=curtains",
  },
  {
    name: "Cushions & Throws",
    image: cushionImg,
    href: "/shop?category=cushions",
  },
  {
    name: "Table Linen",
    image: tableLinenImg,
    href: "/shop?category=table-linen",
  },
  {
    name: "Bathrobes & Towels",
    image: bathrobeImg,
    href: "/shop?category=bath",
  },
];

const CategorySection = () => {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-gold font-medium tracking-widest text-xs sm:text-sm uppercase">
            Explore
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mt-2">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mt-2 md:mt-3 max-w-2xl mx-auto text-sm md:text-base">
            From traditional Jaipuri bedsheets to elegant home accents, find the perfect piece for every corner of your home.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative aspect-[4/5] rounded-lg md:rounded-xl overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={category.image}
                alt={`Shop ${category.name} - Handcrafted Jaipuri textiles`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
                <h3 className="font-serif text-base sm:text-lg md:text-xl text-primary-foreground group-hover:text-gold transition-colors">
                  {category.name}
                </h3>
                <span className="text-primary-foreground/70 text-xs sm:text-sm mt-1 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
