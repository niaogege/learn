import React, { FC } from 'react'
import Playing from './playing.svg'
import InitReady from './pause.svg'
import PauseCur from './pause-cur.svg'
import { PlayState } from '../utils/const';
import './style.less'
import Loading from './loading'

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
  strokeLength: number;

  /**
  * @description       弧度背景色
  * @description.zh-CN 弧度背景色
  * @default           #F3F4F5
  */
  defaultStroke: string;

  /**
  * @description       当前高亮弧度背景色
  * @description.zh-CN 当前高亮弧度背景色
  * @default           #FF4646
  */
  highStroke: string;

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

const Progress: FC<PropgressCircleProp> = ({
  duration = 0,
  currentTime = 0,
  status,
  setPlayStatus,
  radiusLen, // 半径
  strokeLength = 2, // 弧形宽度
  defaultStroke = '#F3F4F5', // 默认弧度背景色
  highStroke = '#FF4646', // 当前高亮的颜色
  isCurSource = false, // 是否是当前播放的音频
}) => {
  const roundRadius = radiusLen;
  const roundPath = roundRadius * Math.PI * 2;
  // const currentProgress = Number(Math.floor(100 * currentTime / duration)); // 当前百分比
  return (
    <section
      className='progress-circle'
      onClick={setPlayStatus}
      style={{
        width: `${(radiusLen + strokeLength) * 2}px`,
        height: `${(radiusLen + strokeLength) * 2}px`
      }}
    >
      <div className='progerss-cicle-percent'>
        <svg
          className='progress-circle-svg'
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle className="progress-circle__circle"
            cx={roundRadius}
            cy={roundRadius}
            r={roundRadius}
            style={{
              strokeDasharray: roundPath,
              strokeWidth: strokeLength,
              stroke: isCurSource ? defaultStroke : 'transparent',
              transform: `translate(${strokeLength}px, ${strokeLength}px)`,
            }}
          ></circle>
          <circle className="progress-circle__circle"
            cx={roundRadius}
            cy={roundRadius}
            r={roundRadius}
            style={{
              strokeDasharray: roundPath,
              strokeDashoffset: String(roundPath * (1 - (currentTime / duration))),
              strokeWidth: strokeLength,
              stroke: isCurSource ? highStroke : 'transparent',
              transform: `translate(${strokeLength}px, ${strokeLength}px)`,
            }}
          ></circle>
        </svg>
      </div>
      {
        status === PlayState.LOADING
          ? (
            <Loading height={`${(radiusLen + strokeLength) * 2}px`} />
          )
          : status === PlayState.PLAYING
            ? <img src={Playing} alt='playing' />
            : status === PlayState.PAUSED && isCurSource
              ? <img src={PauseCur} alt={`pause-${isCurSource}`} style={{
                transform: 'translate(-50%, -50%)'
              }} />
              : <img src={InitReady} alt='ready' style={{
                transform: 'translate(-50%, -50%)'
              }} />
      }
    </section>
  )
}

export default (Progress)