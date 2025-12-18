/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Grid is 3 columns on mobile, 6 on desktop
 * - Images use lazy loading for performance
 * - Touch targets minimum 44x44px
 * - Maintain responsive design in all future edits
 */

import { Instagram } from "lucide-react";

const instagramPosts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80",
    likes: 234,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80",
    likes: 189,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80",
    likes: 312,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=400&q=80",
    likes: 156,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
    likes: 278,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=400&q=80",
    likes: 198,
  },
];

const InstagramFeed = () => {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-gold font-medium tracking-widest text-xs sm:text-sm uppercase">
            @jaipurtouch
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mt-2">
            Follow Us on Instagram
          </h2>
          <p className="text-muted-foreground mt-2 md:mt-3 text-sm md:text-base">
            Get inspired by our latest collections and customer styles
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2 md:gap-4">
          {instagramPosts.map((post, index) => (
            <a
              key={post.id}
              href="https://instagram.com/jaipurtouch"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-md md:rounded-lg animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              aria-label={`View Instagram post ${post.id}`}
            >
              <img
                src={post.image}
                alt={`Jaipur Touch Instagram post ${post.id} - Handcrafted textiles`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-6 md:mt-8">
          <a
            href="https://instagram.com/jaipurtouch"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-gold transition-colors font-medium text-sm md:text-base min-h-[44px]"
          >
            <Instagram className="w-4 h-4 md:w-5 md:h-5" />
            Follow @jaipurtouch
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
