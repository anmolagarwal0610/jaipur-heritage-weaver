/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - This component manages page-specific SEO meta tags
 * - Ensure all images referenced are optimized for mobile
 * - Keep meta descriptions under 160 characters
 */

import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  type?: "website" | "article" | "product";
}

const SEO = ({
  title = "Jaipur Touch - Premium Handcrafted Bedsheets & Home Decor",
  description = "Discover authentic Jaipur handblock printed bedsheets, quilts, and home decor. Premium quality, heritage craftsmanship, delivered to your doorstep.",
  canonical,
  ogImage = "/og-image.jpg",
  type = "website",
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute("content", description);
    }

    const ogImageTag = document.querySelector('meta[property="og:image"]');
    if (ogImageTag) {
      ogImageTag.setAttribute("content", ogImage);
    }

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) {
      ogType.setAttribute("content", type);
    }

    // Update canonical
    if (canonical) {
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (canonicalTag) {
        canonicalTag.setAttribute("href", `https://jaipurtouch.in${canonical}`);
      }
    }

    // Update Twitter tags
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute("content", ogImage);
    }
  }, [title, description, canonical, ogImage, type]);

  return null;
};

export default SEO;
