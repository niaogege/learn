import React, { FC } from 'react';
import Loading from './Loading';
import Pause from './Pause';
import Playing from './Playing';
import PauseCur from './PauseCur';

interface IconProps {
    type: string;
    width?: number;
    [key: string]: any;
}
const Icon: FC<IconProps> = (props) => {
    switch (props.type) {
        case 'loading':
            return <Loading {...props} />;
        case 'playing':
            return <Playing />;
        case 'pause':
            return <Pause />;
        case 'pause-cur':
            return <PauseCur />;
        default:
            return <Loading />;
    }
};

export default Icon;
