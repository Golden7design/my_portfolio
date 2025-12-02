// TimeDisplay.tsx
import { useCurrentTime } from '@/src/lib/useCurrentHour';
import { useEffect, useState, useRef } from 'react';

export const TimeDisplay = () => {
  const { timeChars } = useCurrentTime();
  const [animateStates, setAnimateStates] = useState<boolean[]>(
    Array(timeChars.length).fill(false)
  );
  const prevCharsRef = useRef<string[]>([]);

  useEffect(() => {
    // Détermine quels indices ont changé
    const prevChars = prevCharsRef.current;
    const newAnimateStates = timeChars.map((char, i) => {
      return prevChars[i] !== char;
    });

    setAnimateStates(newAnimateStates);
    prevCharsRef.current = [...timeChars];

    // Réinitialise l'animation après 300ms
    const timer = setTimeout(() => {
      setAnimateStates(Array(timeChars.length).fill(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [timeChars]);

  return (
    <div className="time-container">
      {timeChars.map((char, index) => (
        <div
          key={index}
          className={`digit ${animateStates[index] ? 'animate' : ''}`}
          aria-hidden="true"
        >
          <span className="digit-inner">{char}</span>
        </div>
      ))}
    </div>
  );
};

const prevCharsRef = { current: [] as string[] };