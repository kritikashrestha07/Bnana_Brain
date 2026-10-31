// AI assistance: Google Gemini (Antigravity) helped scaffold this countdown timer hook.
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useCountdown — counts down from initialSeconds to zero.
 * Calls onExpire when the timer reaches 0.
 * Returns { secondsLeft, isRunning, start, pause, reset }.
 */
export function useCountdown(initialSeconds, onExpire) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning,   setIsRunning]   = useState(false);
  const intervalRef = useRef(null);
  const expiredRef  = useRef(false);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) return; // already running
    expiredRef.current = false;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpire?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [onExpire]);

  const pause = useCallback(() => stop(), [stop]);

  const reset = useCallback((newSeconds) => {
    stop();
    expiredRef.current = false;
    setSecondsLeft(newSeconds ?? initialSeconds);
  }, [stop, initialSeconds]);

  // Clean up on unmount
  useEffect(() => () => stop(), [stop]);

  return { secondsLeft, isRunning, start, pause, reset };
}

