/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Mobile menu via Sheet component
 * - Touch targets minimum 44x44px
 * - Logo and nav icons properly sized for mobile
 * - Maintain responsive design in all future edits
 */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ShoppingBag, Search, User, LogOut, Package, UserCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Our Story", href: "/our-story" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const { getItemCount } = useCart();
  
  const cartCount = getItemCount();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2 md:py-2.5 text-center text-xs md:text-sm">
        <p className="font-sans tracking-wide px-4">
          Free Shipping on Orders Above ₹999 • COD Available
        </p>
      </div>

      {/* Main Header */}
      <nav className="bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-18 lg:h-20">
            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-80">
                  <div className="flex flex-col gap-6 mt-8">
                    <Logo className="mb-4" />
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "text-lg font-serif transition-colors hover:text-gold min-h-[44px] flex items-center",
                          location.pathname === item.href
                            ? "text-gold"
                            : "text-foreground"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}

                    {/* Mobile User Section */}
                    <div className="border-t border-border pt-6 mt-2">
                      {user ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.photoURL || undefined} alt="Profile" />
                              <AvatarFallback className="bg-gold/10 text-gold">
                                {getInitials()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{userProfile?.displayName || 'User'}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <Link
                            to="/dashboard?tab=orders"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 text-foreground hover:text-gold min-h-[44px]"
                          >
                            <Package className="h-5 w-5" />
                            My Orders
                          </Link>
                          <Link
                            to="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 text-foreground hover:text-gold min-h-[44px]"
                          >
                            <UserCircle className="h-5 w-5" />
                            My Account
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-2 text-destructive hover:text-destructive/80 min-h-[44px] w-full"
                          >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                          </button>
                        </div>
                      ) : (
                        <Link
                          to="/auth"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 text-foreground hover:text-gold min-h-[44px]"
                        >
                          <User className="h-5 w-5" />
                          Sign In
                        </Link>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link to="/" className="shrink-0">
                <Logo />
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-gold relative group min-h-[44px] flex items-center",
                    location.pathname === item.href
                      ? "text-gold"
                      : "text-foreground"
                  )}
                >
                  {item.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-full h-0.5 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left",
                    location.pathname === item.href && "scale-x-100"
                  )} />
                </Link>
              ))}
            </div>

            {/* Right: Action Icons */}
            <div className="flex items-center gap-0.5 md:gap-1 lg:gap-2">
              <Button variant="ghost" size="icon" className="hidden md:flex h-10 w-10" aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>

              {/* User Dropdown */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden md:flex h-10 gap-2 px-2" aria-label="Account menu">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user.photoURL || undefined} alt="Profile" />
                        <AvatarFallback className="bg-gold/10 text-gold text-xs">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-background">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {userProfile?.displayName || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard?tab=orders" className="flex items-center cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth" className="hidden md:block">
                  <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Sign in">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              )}

              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative h-10 w-10" aria-label="Shopping cart">
                  <ShoppingBag className="h-4 w-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-gold text-gold-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
