/*
 * @Author: Chendapeng
 * @Date: 2022-03-28 11:00:55
 * @LastEditors: Chendapeng
 * @LastEditTime: 2022-03-28 14:24:08
 * @Description: 播放加载音频
 */

import React from 'react';
import loading from '@/src/assets/loading.svg';

const ABLoading = ({height}) => {
  return (
    <div style={{
      maxHeight: height,
      width: '100%',
      minHeight: height,
      backgroundColor: '#ffffff',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      position: 'absolute',
      top: '0',
      right: '0',
      left: '0',
      bottom: '0'
    }}>
      <img style={{
        width: '80px'
      }} src={loading} alt="loading" />
    </div>
  );
};

export default ABLoading;
