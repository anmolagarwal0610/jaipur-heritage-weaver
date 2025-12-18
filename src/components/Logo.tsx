import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "light" | "dark";
  showTagline?: boolean;
}

const Logo = ({ className, variant = "default", showTagline = false }: LogoProps) => {
  const textColor = variant === "light" 
    ? "text-background" 
    : variant === "dark" 
    ? "text-primary" 
    : "text-primary";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative">
        {/* Decorative paisley element */}
        <svg 
          className={cn("absolute -left-6 -top-1 w-5 h-5 opacity-80", 
            variant === "light" ? "text-gold" : "text-gold"
          )} 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 2C8 2 4 6 4 10c0 6 8 12 8 12s8-6 8-12c0-4-4-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
        
        <h1 className={cn("font-serif text-2xl md:text-3xl font-semibold tracking-wide", textColor)}>
          Jaipur<span className="text-gold">Touch</span>
        </h1>
        
        {/* Decorative paisley element */}
        <svg 
          className={cn("absolute -right-6 -top-1 w-5 h-5 opacity-80 rotate-180", 
            variant === "light" ? "text-gold" : "text-gold"
          )} 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 2C8 2 4 6 4 10c0 6 8 12 8 12s8-6 8-12c0-4-4-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
      </div>
      
      {showTagline && (
        <p className={cn("text-xs tracking-[0.3em] uppercase mt-1 font-sans", 
          variant === "light" ? "text-background/80" : "text-muted-foreground"
        )}>
          Handcrafted Heritage
        </p>
      )}
    </div>
  );
};

export default Logo;
