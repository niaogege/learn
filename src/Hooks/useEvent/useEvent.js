import { useRef, useLayoutEffect, useCallback } from 'react';
const useEvent = (handler) => {
    const handleRef = useRef();
    useLayoutEffect(() => {
        handleRef.current = handler;
    });
    return useCallback((...args) => {
        handleRef && handleRef.current(...args);
    }, []);
};
export default useEvent;
