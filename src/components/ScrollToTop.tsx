import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Scrolls to top of page on every route change (including query string changes)
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);
  
  return null;
};

export default ScrollToTop;
