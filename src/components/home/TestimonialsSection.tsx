/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Grid stacks to single column on mobile
 * - Images use lazy loading for performance
 * - Touch targets minimum 44x44px
 * - Maintain responsive design in all future edits
 */

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The quality of the bedsheets is exceptional! The block print is so intricate and the cotton is incredibly soft. My bedroom feels like a royal chamber now.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 2,
    name: "Rajesh Gupta",
    location: "Delhi",
    rating: 5,
    text: "I've been buying from Jaipur Touch for over 2 years. Their quilts are perfect for Delhi winters and the designs are timeless. Highly recommended!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 3,
    name: "Anita Reddy",
    location: "Bangalore",
    rating: 5,
    text: "The curtains I ordered transformed my living room completely. The colors are vibrant yet elegant. Customer service was also very helpful.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-gold font-medium tracking-widest text-xs sm:text-sm uppercase">
            Testimonials
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mt-2">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card border border-border rounded-lg md:rounded-xl p-4 md:p-6 relative animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="absolute top-3 right-3 md:top-4 md:right-4 w-6 h-6 md:w-8 md:h-8 text-gold/20" />
              
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <img
                  src={testimonial.image}
                  alt={`${testimonial.name} - Jaipur Touch customer`}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h4 className="font-serif font-semibold text-foreground text-sm md:text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              <div className="flex gap-0.5 md:gap-1 mb-2 md:mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
