import React, { useEffect, useState } from 'react';

export function useDetectScroll() {
  const [scrollDir, setScrollDir] = useState('scrolling down');
  const [scrollingUp, setScrollingUp] = useState(true);
  const [top, setTop] = useState(true);

  useEffect(() => {
    const threshold = 0;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      setScrollDir(scrollY > lastScrollY ? 'scrolling down' : 'scrolling up');
      setScrollingUp(scrollY > lastScrollY ? false : true);

      //When ScrollY = 0 =>
      setTop(scrollY === 0 ? true : false);
      //end ScrollY = 0
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollDir]);
  return { scrollDir, setScrollDir, scrollingUp, setScrollingUp, top, setTop };
}
