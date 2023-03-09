import React, { useState } from 'react';
import useEvent from './useEvent';
const SendButton = ({ onClick, text }) => {
    return React.createElement("button", { onClick: onClick }, text);
};
const MyApp = () => {
    const [text, setText] = useState('TEXT');
    const onClick = useEvent(() => {
        setText('NEW Text');
    });
    return React.createElement(SendButton, { onClick: onClick, text: text });
};
export default MyApp;
