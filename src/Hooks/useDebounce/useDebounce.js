import { useEffect, useState } from 'react';
function useDebounce(param, delay) {
    const [text, setText] = useState(param);
    useEffect(() => {
        const timer = setTimeout(() => {
            setText(param);
        }, delay);
        return () => {
            clearTimeout(timer);
        };
    }, [param, delay]);
    return text;
}
export default useDebounce;
