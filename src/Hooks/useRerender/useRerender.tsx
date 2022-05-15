import React, { useRef, useEffect } from 'react';

function useRerender() {
    const ref = useRef(false);
    useEffect(() => {
        ref.current = true;
    }, []);
    return ref.current;
}
export default useRerender;
