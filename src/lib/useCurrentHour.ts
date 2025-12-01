// lib/useCurrentHour.ts
import { useState, useEffect } from 'react';

export const useCurrentHour = () => {
  const [hour, setHour] = useState<string>('--:--');

  useEffect(() => {
    const updateHour = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      setHour(now.toLocaleTimeString([], options));
    };

    updateHour();
    const interval = setInterval(updateHour, 60000); // mise à jour chaque minute

    return () => clearInterval(interval);
  }, []);

  return hour;
};