import { useEffect, useRef, useState } from 'react';

export function useNotificationDisclosure() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const container = containerRef.current;

      if (!container || !(event.target instanceof Node)) {
        return;
      }

      if (!container.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  return {
    containerRef,
    isOpen,
    toggle: () => setIsOpen((current) => !current),
  };
}
