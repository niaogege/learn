import React, { useCallback, useState } from 'react';
import useEventListener from './useEventListener';
function App() {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const handler = useCallback(({ clientX, clientY }) => {
        setCoords({
            x: clientX,
            y: clientY,
        });
    }, [setCoords]);
    useEventListener('mousemove', handler);
    return (React.createElement("div", null,
        "this is Mousemove AddEventListener: x: ",
        coords.x,
        ", y: ",
        coords.y));
}
export default App;
