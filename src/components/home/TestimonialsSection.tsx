/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Grid stacks to single column on mobile
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
    text: "Arre, what quality yaar! The bedsheet print is so fine-fine, even mummy said 'beta, where you found this?' Cotton is butter soft. Bedroom looking like 5-star hotel now!",
  },
  {
    id: 2,
    name: "Rajesh Gupta",
    location: "Delhi",
    rating: 5,
    text: "Main 2 saal se order kar raha hoon. Delhi ki thand ke liye their quilts are perfect bhai. Design timeless hai - guests always ask where I got it from. 100% recommend!",
  },
  {
    id: 3,
    name: "Anita Reddy",
    location: "Bangalore",
    rating: 5,
    text: "The curtains I ordered na, completely transformed my living room. Colors are so vibrant yet elegant. Customer service was very helpful, they called to confirm everything properly.",
  },
];

const TestimonialsSection = () => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <span className="text-gold font-serif font-semibold text-sm md:text-base">
                    {getInitials(testimonial.name)}
                  </span>
                </div>
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
