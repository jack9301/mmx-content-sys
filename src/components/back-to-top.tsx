'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={handleClick}
      className={
        'fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full ' +
        'border border-neutral-200 bg-white text-neutral-700 shadow-sm backdrop-blur ' +
        'transition-all duration-200 hover:border-neutral-300 hover:text-neutral-900:text-neutral-100 hover:shadow-md ' +
        'focus:outline-none focus:ring-2 focus:ring-[#0f766e]/30 ' +
        (visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-2 pointer-events-none')
      }
    >
      <ArrowUp className="h-5 w-5" strokeWidth={1.75} />
    </button>
  );
}
