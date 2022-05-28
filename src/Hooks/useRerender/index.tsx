import React, { useState, useRef, useEffect } from 'react';
import useRerender from './useRerender';

const Example = () => {
    const [count, setCount] = useState(0);
    const reRender = useRerender();
    if (reRender) {
        console.log('后续渲染');
    } else {
        console.log('首次渲染');
    }

    return (
        <div>
            <div>{count}</div>
            <button
                onClick={() => {
                    setCount(count + 1);
                }}
            >
                Add
            </button>
        </div>
    );
};

export default Example;
