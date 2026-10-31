
import { useState, useEffect, useRef, useCallback } from 'react';

export function useCountdown(initialSeconds, onExpire) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current || expiredRef.current) return;

    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);

          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpireRef.current?.();
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }, []);

  const pause = useCallback(() => {
    stop();
  }, [stop]);

  const reset = useCallback((newSeconds = initialSeconds) => {
    stop();
    expiredRef.current = false;
    setSecondsLeft(newSeconds);
  }, [stop, initialSeconds]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return { secondsLeft, isRunning, start, pause, reset };
}
