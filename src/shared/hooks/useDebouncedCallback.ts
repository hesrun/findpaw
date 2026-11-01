'use client';

import { useEffect, useRef } from 'react';

// Delays `callback` until calls stop for `delayMs`. `run` restarts the timer,
// `cancel` drops a pending call. The latest callback is always the one invoked,
// and a pending call is dropped on unmount.
export function useDebouncedCallback<Args extends unknown[]>(
    callback: (...args: Args) => void,
    delayMs: number,
) {
    const callbackRef = useRef(callback);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        callbackRef.current = callback;
    });

    useEffect(() => () => clearTimeout(timerRef.current), []);

    function cancel() {
        clearTimeout(timerRef.current);
    }

    function run(...args: Args) {
        cancel();
        timerRef.current = setTimeout(
            () => callbackRef.current(...args),
            delayMs,
        );
    }

    return { run, cancel };
}
