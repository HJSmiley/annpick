// src/hooks/useHover.ts
import { useState, useRef, useEffect } from 'react';

function useHover<T extends HTMLElement = HTMLElement>() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);

      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        node.removeEventListener('mouseenter', handleMouseEnter);
        node.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return [ref, isHovered] as const;
}

export default useHover;