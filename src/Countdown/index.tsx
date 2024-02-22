import React, { FC, useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { durationFor } from '../../src/utils/time';
import './style.scss';
export interface CountdownProp {
    /**
     * @description       到哪一天倒计时结束的字符串
     * @description.zh-CN 到哪一天倒计时结束的字符串
     * @default           阳历明年元旦
     */
    endDate: string;

    /**
     * @description       是否显示日粒度
     * @description.zh-CN 是否显示日粒度
     * @default           true
     */
    showDay: boolean;

    /**
     * @description       倒计时结束之后的回掉函数
     * @description.zh-CN 倒计时结束之后的回掉函数
     * @default           null
     */
    endFn: () => void;
}

const Countdown: FC<CountdownProp> = ({ endFn, endDate, showDay = true }) => {
    const curYear = dayjs().get('year');
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
