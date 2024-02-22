import React, { FC, useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { durationFor } from '../../src/utils/time';
interface CountdownProp {
    endFn: () => void;
    endDate: string;
    showDay: boolean;
}

const Countdown: FC<CountdownProp> = ({ endFn, endDate, showDay = true }) => {
    const curYear = dayjs().format('YYYY');
    const nextYearStart = +curYear + 1;
    const [time, setTimeLeft] = useState(
        endDate && dayjs(endDate).isValid()
            ? dayjs(endDate).diff(dayjs(Date.now()), 'seconds')
            : dayjs(`${nextYearStart}-01-01`).diff(dayjs(Date.now()), 'seconds'),
    );
    const [str, setStr] = useState('');
    let timer = useRef<number>(0);
    useEffect(() => {
        const fn = () => {
            timer.current = +setTimeout(() => {
                if (time >= 0) {
                    setTimeLeft((val) => {
                        let cur = val - 1;
                        return cur;
                    });
                    fn(); // 递归调用
                } else {
                    endFn();
                }
            }, 1000);
        };
        fn();
        return () => {
            // 避免重复执行 setTimeout
            timer && clearTimeout(timer.current);
        };
    }, [time, endFn]);

    useEffect(() => {
        const { dd, hh, mm, ss } = durationFor(time);
        setStr(
            showDay
                ? `距离${nextYearStart}-01-01: ${dd}天${hh}时${mm}分${ss}秒`
                : `距离明天: ${hh}时${mm}分${ss}秒`,
        );
    }, [time]);
    return <span>{str}后消失</span>;
};
export default Countdown;
