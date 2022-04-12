/*
 * @Author: Chendapeng
 * @Date: 2022-03-25 16:54:33
 * @LastEditors: Chendapeng
 * @LastEditTime: 2022-03-30 12:34:21
 * @Description: 播放进度svg
 */
import React, {memo} from 'react'
import Playing from './playing.svg'
import InitReady from './pause.svg'
import PauseCur from './pause-cur.svg'
import { PlayState } from '../../packages/player/consts';
import './style.scss'
import Loading from './loading'

const Progress = ({
  duration = 0,
  currentTime = 0,
  status,
  setPlayStatus,
  radiusLen, // 半径
  strokeLength = 2, // 弧形宽度
  defaultStroke='#F3F4F5', // 默认弧度背景色
  highStroke='#FF4646', // 当前高亮的颜色
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
            <Loading height={`${(radiusLen + strokeLength) * 2}px`}/>
          )
          : status === PlayState.PLAYING
            ? <img src={Playing} alt='playing' /> 
            : status === PlayState.PAUSED && isCurSource
              ?  <img src={PauseCur} alt={`pause-${isCurSource}`} style={{
                transform: 'translate(-50%, -50%)'
              }} /> 
              :  <img src={InitReady} alt='ready' style={{
                  transform: 'translate(-50%, -50%)'
                }} /> 
        }
      </section>
  )
}

export default memo(Progress)