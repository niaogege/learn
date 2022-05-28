import { useRef, useLayoutEffect, useCallback } from 'react';

const useEvent = (handler: any) => {
    const handleRef = useRef();
    useLayoutEffect(() => {
        handleRef.current = handler;
    });
    return useCallback((...args: []) => {
        handleRef && (handleRef as any).current(...args);
    }, []);
};
export default useEvent;
