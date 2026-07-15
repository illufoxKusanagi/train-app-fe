import { useState, useEffect } from 'react';

export function useSlopeOptions(): number[] {
  const [slopes, setSlopes] = useState<number[]>([0, 5, 10, 25]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('form_track-params');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSlopes([
          parsed.slope_option1 ?? 0,
          parsed.slope_option2 ?? 5,
          parsed.slope_option3 ?? 10,
          parsed.slope_option4 ?? 25,
        ]);
      }
    } catch (e) {
      console.error('Failed to load slope options:', e);
    }
  }, []);

  return slopes;
}
