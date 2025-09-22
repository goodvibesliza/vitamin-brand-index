import { useEffect } from 'react';

export default function MethodologyLink() {
  useEffect(() => {
    const link = document.getElementById('footer-methodology-link');
    if (!link) return;

    const handleClick = (e: MouseEvent) => {
      // Don't intercept if opening in new tab/window
      if (e.shiftKey || e.metaKey || e.ctrlKey || e.button === 1) {
        return;
      }

      // Prevent default navigation
      e.preventDefault();

      // Try to find and open the methodology modal
      const modal = document.querySelector('[data-methodology-modal]') as any;
      if (modal && typeof modal.open === 'function') {
        modal.open();
      } else {
        // Fallback: navigate normally if modal not found
        window.location.href = '/methodology';
      }
    };

    link.addEventListener('click', handleClick);

    return () => {
      link.removeEventListener('click', handleClick);
    };
  }, []);

  return null; // This component only provides behavior, no UI
}