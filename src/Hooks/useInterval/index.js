import React, { useState } from 'react';
import useInterval from './useInterval';
const MyApp = () => {
    const [seconds, setSeconds] = useState(0);
    useInterval(() => {
        setSeconds(seconds + 1);
    }, 1000);
    return React.createElement("p", null,
        "seconds: (",
        seconds,
        ")");
};
export default MyApp;
