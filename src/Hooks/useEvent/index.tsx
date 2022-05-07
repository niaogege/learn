import React, { useState, FC } from 'react';
import useEvent from './useEvent';

interface DataProp {
    onClick: () => void;
    text: string;
}
const SendButton: FC<DataProp> = ({ onClick, text }) => {
    return <button onClick={onClick}>{text}</button>;
};
const MyApp = () => {
    const [text, setText] = useState('TEXT');
    const onClick = useEvent(() => {
        setText('NEW Text');
    });

    return <SendButton onClick={onClick} text={text} />;
};
export default MyApp;
