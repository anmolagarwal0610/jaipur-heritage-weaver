/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Logo text scales responsively
 * - Tagline hidden or smaller on mobile if needed
 * - Maintain responsive design in all future edits
 */

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
      <h1 className={cn("font-serif text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide", textColor)}>
        Jaipur<span className="text-gold">Touch</span>
      </h1>
      
      {showTagline && (
        <p className={cn("text-[10px] sm:text-xs tracking-[0.3em] uppercase mt-0.5 md:mt-1 font-sans", 
          variant === "light" ? "text-background/80" : "text-muted-foreground"
        )}>
          Handcrafted Heritage
        </p>
      )}
    </div>
  );
};

export default Logo;
