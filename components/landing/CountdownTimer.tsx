'use client';
import React, { useEffect, useState } from 'react';
import { countdownContent } from '@/data/content';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const end = new Date(countdownContent.endDate).getTime();

    function tick() {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setIsExpired(true);
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isExpired) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8 px-4 text-center">
      <p className="text-lg font-bold mb-4">{countdownContent.headline}</p>
      <div className="flex items-center justify-center gap-3">
        {[
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Minutes' },
          { value: timeLeft.seconds, label: 'Seconds' },
        ].map((unit) => (
          <div key={unit.label} className="bg-white/20 backdrop-blur rounded-xl px-5 py-3 min-w-[80px]">
            <span className="block text-3xl font-extrabold tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-xs opacity-80">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
