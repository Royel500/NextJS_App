'use client'
import React, { useState, useEffect } from 'react';

export default function CountdownForHome({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (10000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex justify-center space-x-4">
      {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
        <div key={unit} className="bg-white rounded-lg p-4 shadow-md text-center">
          <span className="text-2xl font-bold text-blue-600">
            {timeLeft[unit].toString().padStart(2, '0')}
          </span>
          <p className="capitalize">{unit}</p>
        </div>
      ))}
    </div>
  );
}
