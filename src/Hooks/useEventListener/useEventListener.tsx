import { useRef, useEffect } from 'react';

function useEventListener(eventName: string, handler: Function, element = window): void {
    const saveHandler = useRef<Function>(() => {});
    useEffect(() => {
        saveHandler.current = handler;
    }, [handler]);
    useEffect(() => {
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;
        const eventListener = (event: Event) => saveHandler.current(event);
        element.addEventListener(eventName, eventListener);
        return () => {
            element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
}
export default useEventListener;
