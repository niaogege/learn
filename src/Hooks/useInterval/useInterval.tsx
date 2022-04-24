import { useEffect, useRef } from 'react';

type cbT = () => any;
const useInterval = (cb: cbT, delay: number = 1000) => {
    const savedCallback = useRef<cbT>();
    useEffect(() => {
        savedCallback.current = cb;
    }, [cb]);
    useEffect(() => {
        const tick = () => {
            savedCallback && savedCallback.current && savedCallback.current();
        };
        if (delay != null) {
            const id = setInterval(tick, delay);
            return () => {
                clearInterval(id);
            };
        }
    }, [delay]);
};

export default useInterval;
