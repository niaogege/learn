import React, { useState } from 'react';
import useInterval from './useInterval';

const MyApp = () => {
    const [seconds, setSeconds] = useState(0);
    useInterval(() => {
        setSeconds(seconds + 1);
    }, 1000);
    return <p>seconds: ({seconds})</p>;
};
export default MyApp;
