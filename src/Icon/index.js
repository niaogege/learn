import React from 'react';
import Loading from './Loading';
import Pause from './Pause';
import Playing from './Playing';
import PauseCur from './PauseCur';
const Icon = (props) => {
    switch (props.type) {
        case 'loading':
            return React.createElement(Loading, { ...props });
        case 'playing':
            return React.createElement(Playing, null);
        case 'pause':
            return React.createElement(Pause, null);
        case 'pause-cur':
            return React.createElement(PauseCur, null);
        default:
            return React.createElement(Loading, null);
    }
};
export default Icon;
