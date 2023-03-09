import React, { FC } from 'react';
import './style.scss';
export interface PropgressCircleProp {
    /**
     * @description       播放总时长
     * @description.zh-CN 播放总时长
     * @default           0
     */
    duration: number;
    /**
     * @description       当前时间进度
     * @description.zh-CN 当前时间进度
     * @default           0
     */
    currentTime: number;
    /**
     * @description       当前状态
     * @description.zh-CN 当前状态
     * @default           -1
     */
    status: number;
    /**
     * @description       设置当前状态
     * @description.zh-CN 设置当前状态
     * @default           Function
     */
    setPlayStatus: () => void;
    /**
     * @description       半径
     * @description.zh-CN 半径
     * @default           14
     */
    radiusLen: number;
    /**
     * @description       弧形宽度
     * @description.zh-CN 弧形宽度
     * @default           2
     */
    strokeLength?: number;
    /**
     * @description       弧度背景色
     * @description.zh-CN 弧度背景色
     * @default           #F3F4F5
     */
    defaultStroke?: string;
    /**
     * @description       当前高亮弧度背景色
     * @description.zh-CN 当前高亮弧度背景色
     * @default           #FF4646
     */
    highStroke?: string;
    /**
     * @description       是否是当前播放的音频
     * @description.zh-CN 是否是当前播放的音频
     * @default           true
     */
    isCurSource: boolean;
    /**
     * @description       自定义style
     * @description.zh-CN 自定义style
     * @default           null
     */
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
declare const Progress: FC<PropgressCircleProp>;
export default Progress;
