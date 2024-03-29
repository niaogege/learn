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

    return (
        <div onClick={onPlay}>
            <span>duration: {duration}</span> <br />
            currentTime: {currentTime}
            <ProgressCircle
                currentTime={currentTime}
                duration={duration}
                radiusLen={15} // 半径
                strokeLength={2.5} // 弧度宽度
                status={playState} // 播放状态
                isCurSource={true} // 是否是当前的这个音频
            />
        </div>
    );
};
export default ProgressPlayBtn;
