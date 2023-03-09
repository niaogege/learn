import { useEffect, useRef } from 'react';
const useInterval = (cb, delay = 1000) => {
    const savedCallback = useRef();
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
