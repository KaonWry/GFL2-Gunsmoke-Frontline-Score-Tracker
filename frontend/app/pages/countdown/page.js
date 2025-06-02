'use client';
import { useEffect, useState } from "react";

const GUNSMOKE_START = Date.UTC(2025, 5, 15, 9, 0, 0); // 15 June 2025 16:00 UTC+7 == 09:00 UTC
const GUNSMOKE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const GUNSMOKE_INTERVAL_MS = 21 * 24 * 60 * 60 * 1000; // 21 days (7 days event + 14 days break)
const RESET_HOUR_UTC = 9; // 16:00 UTC+7 == 09:00 UTC

function formatTime(ms) {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function getCurrentSession(now) {
  // Find the most recent Gunsmoke start (15 June 2025 at the time of the writing)
  let cycleStart = GUNSMOKE_START;
  while (now >= cycleStart + GUNSMOKE_INTERVAL_MS) {
    cycleStart += GUNSMOKE_INTERVAL_MS;
  }

  if (now < cycleStart) {
    return {
      phase: "to_next",
      label: "Countdown to next Gunsmoke Frontline",
      day: null,
      resetCountdown: null,
      nextCountdown: cycleStart - now,
    };
  } else if (now < cycleStart + GUNSMOKE_DURATION_MS) {
    const msSinceStart = now - cycleStart;
    const day = Math.floor(msSinceStart / (24 * 60 * 60 * 1000)) + 1;

    const nowDate = new Date(now);
    let reset = Date.UTC(
      nowDate.getUTCFullYear(),
      nowDate.getUTCMonth(),
      nowDate.getUTCDate(),
      RESET_HOUR_UTC, 0, 0
    );
    if (now >= reset) {
      reset += 24 * 60 * 60 * 1000;
    }
    const resetCountdown = reset - now;

    return {
      phase: "in_session",
      label: `Day ${day} of Gunsmoke Frontline`,
      day,
      resetCountdown,
    };
  } else {
    return {
      phase: "to_next",
      label: "Countdown to next Gunsmoke Frontline",
      day: null,
      resetCountdown: null,
      nextCountdown: cycleStart + GUNSMOKE_INTERVAL_MS - now,
    };
  }
}

export default function CountdownPage() {
  const [session, setSession] = useState({ phase: null, label: "", day: null, resetCountdown: null });

  useEffect(() => {
    function update() {
      const now = Date.now();
      setSession(getCurrentSession(now));
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">{session.label}</h1>
      {session.phase === "in_session" && (
        <div className="text-2xl font-mono">
          {session.resetCountdown === null
            ? "Loading..."
            : `${formatTime(session.resetCountdown)} until server reset`}
        </div>
      )}
      {session.phase === "to_next" && (
        <div className="text-4xl font-mono">
          {session.nextCountdown !== undefined && session.nextCountdown !== null
            ? `${formatTime(session.nextCountdown)}`
            : "Loading..."}
        </div>
      )}
    </div>
  );
}