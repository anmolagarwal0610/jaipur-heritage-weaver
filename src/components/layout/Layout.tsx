/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - Layout is flex column with min-h-screen
 * - Main content flexes to fill available space
 * - Header and Footer are responsive components
 * - Maintain responsive design in all future edits
 */

import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
