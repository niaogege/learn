import React from 'react';
import { PlayState } from '../utils/const';
import './style.scss';
import Loading from './loading';
import Icon from '../Icon';
const Progress = ({ duration = 0, currentTime = 0, status, setPlayStatus, radiusLen, // 半径
strokeLength = 2, // 弧形宽度
defaultStroke = '#F3F4F5', // 默认弧度背景色
highStroke = '#FF4646', // 当前高亮的颜色
isCurSource = false, // 是否是当前播放的音频
 }) => {
    const roundRadius = radiusLen;
    const roundPath = roundRadius * Math.PI * 2;
    // const currentProgress = Number(Math.floor(100 * currentTime / duration)); // 当前百分比
    return (React.createElement("section", { className: "progress-circle", onClick: setPlayStatus, style: {
            width: `${(radiusLen + strokeLength) * 2}px`,
            height: `${(radiusLen + strokeLength) * 2}px`,
        } },
        React.createElement("div", { className: "progerss-cicle-percent" },
            React.createElement("svg", { className: "progress-circle-svg", version: "1.1", xmlns: "http://www.w3.org/2000/svg" },
                React.createElement("circle", { className: "progress-circle__circle", cx: roundRadius, cy: roundRadius, r: roundRadius, style: {
                        strokeDasharray: roundPath,
                        strokeWidth: strokeLength,
                        stroke: isCurSource ? defaultStroke : 'transparent',
                        transform: `translate(${strokeLength}px, ${strokeLength}px)`,
                    } }),
                React.createElement("circle", { className: "progress-circle__circle", cx: roundRadius, cy: roundRadius, r: roundRadius, style: {
                        strokeDasharray: roundPath,
                        strokeDashoffset: String(roundPath * (1 - currentTime / duration)),
                        strokeWidth: strokeLength,
                        stroke: isCurSource ? highStroke : 'transparent',
                        transform: `translate(${strokeLength}px, ${strokeLength}px)`,
                    } }))),
        React.createElement("div", { className: "icon" }, status === PlayState.LOADING ? (React.createElement(Loading, { height: `${(radiusLen + strokeLength) * 2}px` })) : status === PlayState.PLAYING ? (React.createElement(Icon, { type: "playing" })) : status === PlayState.PAUSED && isCurSource ? (React.createElement(Icon, { type: "pause-cur" })) : (React.createElement(Icon, { type: "pause" })))));
};
export default Progress;
