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
    <section className="py-12 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center mb-3">
                <feature.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-serif font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
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
