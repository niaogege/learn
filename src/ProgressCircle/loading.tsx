/*
 * @Author: Chendapeng
 * @Date: 2022-03-28 11:00:55
 * @LastEditors: Chendapeng
 * @LastEditTime: 2022-04-14 22:30:51
 * @Description: 播放加载音频
 */

import React from 'react';
import Icon from '../Icon';

const ABLoading = ({ height }: { height: string }) => {
    return (
        <div
            style={{
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
                bottom: '0',
            }}
        >
            <Icon type="loading" width={80} />
        </div>
    );
};

export default ABLoading;
