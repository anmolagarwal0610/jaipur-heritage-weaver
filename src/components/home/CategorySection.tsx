import { Link } from "react-router-dom";

const categories = [
  {
    name: "Bedsheets",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
    href: "/shop?category=bedsheets",
  },
  {
    name: "Quilts & Dohars",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
    href: "/shop?category=quilts",
  },
  {
    name: "Curtains",
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80",
    href: "/shop?category=curtains",
  },
  {
    name: "Cushions & Throws",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
    href: "/shop?category=cushions",
  },
  {
    name: "Table Linen",
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=600&q=80",
    href: "/shop?category=table-linen",
  },
  {
    name: "Bathrobes & Towels",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=600&q=80",
    href: "/shop?category=bath",
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-gold font-medium tracking-widest text-sm uppercase">
            Explore
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mt-2">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            From traditional Jaipuri bedsheets to elegant home accents, find the perfect piece for every corner of your home.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="font-serif text-lg md:text-xl text-primary-foreground group-hover:text-gold transition-colors">
                  {category.name}
                </h3>
                <span className="text-primary-foreground/70 text-sm mt-1 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
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
