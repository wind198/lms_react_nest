/**
 * TODO: This hook should run a callback on specific interval
 * TODO: This hook should allow delay an amount of time before start running callback
 * TODO: This hook should allow to start in deactived state(not run callback) until user activate it
 * TODO: This hook should allow pause and resume its execution
 * TODO: This hook should be able to run immediately on mount
 */

import { useCallback, useEffect, useRef, useState } from "react";

type IUseIntervalHookProps = {
  interval: number;
  callback: (...args: any[]) => void | Promise<void>;
  // delay?: number;
  deactivedAtFirst?: boolean;
  shouldRunImmediately?: boolean;
};
export default function useIntervalHook(props: IUseIntervalHookProps) {
  const { callback, interval, deactivedAtFirst, shouldRunImmediately } = props;

  const [isPaused, setIsPaused] = useState(!!deactivedAtFirst);

  /**
   * Reactivate the paused hook
   */
  const activate = useCallback(() => {
    setIsPaused(false);
  }, []);

  /**
   * Temporarily pause the hook, callbacks wil not be called, but timelapse still get updated
   */
  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const timerRef = useRef<number>();

  const ranImmediately = useRef<boolean>();

  /*
   * The internal counter of interval hook
   */
  // const [timeTick, setTimeTick] = useState(0);

  /**
   * Clear the timer, timelapse stop updating, callback will not be called anymore
   */
  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  // useEffect(() => {
  //   if (isPaused) {
  //     return;
  //   }
  //   if (!timeTick && !shouldRunImmediately) {
  //     return;
  //   }
  //   callback();
  // }, [timeTick, shouldRunImmediately]);

  useEffect(() => {
    if (shouldRunImmediately && !ranImmediately.current) {
      callback();
      ranImmediately.current = true;
    }
    const timer = setInterval(() => {
      if (!isPaused) {
        // setTimeTick((c) => c + interval);
        callback();
      }
    }, interval);

    timerRef.current = timer;

    return () => {
      stop();
    };
  }, [interval, isPaused, callback, shouldRunImmediately]);

  return {
    pause,
    activate,
    stop,
    isPaused,
    timerRef,
  };
}
