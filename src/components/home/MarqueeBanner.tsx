const MarqueeBanner = () => {
  const items = [
    "✦ Handcrafted with Heritage",
    "✦ Premium Quality Fabrics",
    "✦ Authentic Block Printing",
    "✦ Eco-Friendly Dyes",
    "✦ Made with Love in Jaipur",
    "✦ 100% Cotton",
    "✦ Artisan Crafted",
    "✦ Timeless Designs",
  ];

  return (
    <div className="bg-primary py-3 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, index) => (
          <span
            key={index}
            className="mx-8 text-sm font-medium text-primary-foreground/90 tracking-wide"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeBanner;
