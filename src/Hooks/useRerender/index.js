import React, { useState } from 'react';
import useRerender from './useRerender';
const Example = () => {
    const [count, setCount] = useState(0);
    const reRender = useRerender();
    if (reRender) {
        console.log('后续渲染');
    }
    else {
        console.log('首次渲染');
    }
    return (React.createElement("div", null,
        React.createElement("div", null, count),
        React.createElement("button", { onClick: () => {
                setCount(count + 1);
            } }, "Add")));
};
export default Example;
