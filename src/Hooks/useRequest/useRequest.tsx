import { useState, useEffect } from 'react';
const useRequest = (url: string, options: any) => {
    const [abort, setAbort] = useState(() => { });
    const [res, setResponse] = useState(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const abortController = new AbortController();
                const signal = abortController.signal;
                setAbort(() => abortController.abort());
                const res = await window.fetch(url, { ...options, signal, method: 'get' });
                setResponse(res);
            } catch (error) {
                setError(error as any);
            }
        };
        fetchData();
        return () => {
            if (typeof abort === 'function') {
                abort();
            }
        }
    }, []);
    return {
        res, error, abort
    }
};
export default useRequest;
