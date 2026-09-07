'use client';

import { useEffect, useState } from 'react';

function remaining(target: string) {
  const milliseconds = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(milliseconds / 86_400_000),
    hours: Math.floor((milliseconds % 86_400_000) / 3_600_000),
    minutes: Math.floor((milliseconds % 3_600_000) / 60_000),
  };
}

export function Countdown({ target }: { target: string }) {
  const [time, setTime] = useState(() => remaining(target));
  useEffect(() => {
    const timer = window.setInterval(() => setTime(remaining(target)), 60_000);
    return () => window.clearInterval(timer);
  }, [target]);
  return <div className="countdown" aria-label={`Mancano ${time.days} giorni, ${time.hours} ore e ${time.minutes} minuti`}>
    <span><b>{time.days}</b>giorni</span><span><b>{time.hours}</b>ore</span><span><b>{time.minutes}</b>min</span>
  </div>;
}
