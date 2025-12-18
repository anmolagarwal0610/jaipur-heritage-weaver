/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Grid is 2 columns on mobile, 4 on desktop
 * - Icons and text scale appropriately
 * - Maintain responsive design in all future edits
 */

import { Truck, CreditCard, Shield, Leaf } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above ₹999",
  },
  {
    icon: CreditCard,
    title: "COD Available",
    description: "Pay on delivery",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "100% secure checkout",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Natural dyes & fabrics",
  },
];

const TrustBadges = () => {
  return (
    <section className="py-6 md:py-8 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center"
            >
              <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-gold mb-1.5 md:mb-2" strokeWidth={1.5} />
              <h3 className="font-medium text-xs md:text-sm text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-[10px] md:text-xs mt-0.5">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
