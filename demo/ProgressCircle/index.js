import React, { useState, useEffect, useRef } from 'react';
import { ProgressCircle } from '@chendap/ui';
const duration = 15;
const ProgressPlayBtn = () => {
    const [currentTime, setCurrentTime] = useState(0);
    const [playState, setPlayState] = useState(3);
    const curTime = useRef(0);
    let timer = useRef(0);
    const onPlay = () => {
        clearInterval(timer.current);
        setPlayState((state) => (state === 0 ? 3 : 0));
    };
    useEffect(() => {
        curTime.current = currentTime;
        if (playState === 3) {
            timer.current = setInterval(() => {
                setCurrentTime((currentTime) => {
                    if (currentTime + 1 >= duration) {
                        clearInterval(timer.current);
                        setPlayState(0);
                        return 0;
                    }
                    return currentTime + 1;
                });
            }, 1000);
        }
        return () => {
            clearInterval(timer.current);
        };
    }, [playState]);
    return (React.createElement("div", { onClick: onPlay },
        React.createElement("span", null,
            "duration: ",
            duration),
        " ",
        React.createElement("br", null),
        "currentTime: ",
        currentTime,
        React.createElement(ProgressCircle, { currentTime: currentTime, duration: duration, radiusLen: 15, strokeLength: 2.5, status: playState, isCurSource: true })));
};
export default ProgressPlayBtn;
