
import { useState, useEffect, useRef } from 'react';

/**
 * Hook to track user inactivity and trigger a callback after specified timeout
 * @param timeout Timeout in milliseconds
 * @param onInactive Function to call when user becomes inactive
 * @param onActive Function to call when user becomes active again
 */
export function useInactivityTimer(
  timeout: number = 20000, 
  onInactive?: () => void,
  onActive?: () => void
) {
  const [inactive, setInactive] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    if (inactive) {
      setInactive(false);
      onActive?.();
    }

    timeoutRef.current = window.setTimeout(() => {
      setInactive(true);
      onInactive?.();
    }, timeout);
  };

  useEffect(() => {
    // Events that reset the inactivity timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Initial setup
    resetTimer();
    
    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [timeout, onInactive, onActive]);

  return { inactive, resetTimer };
}
