import React from 'react';
import usePortal from './usePortal';

let container: Element;
const TestPortal = () => {
    if (!container) {
        container = document.createElement('div');
        container.setAttribute('id', 'cpp-ui');
        document.body.appendChild(container);
    } else {
        document.body.appendChild(container);
    }
    const Portal = container && usePortal(container);
    return (
        <>
            <h2>
                元素查看<code>document.getElementById('cpp-ui')</code>
            </h2>
            <Portal> Hello UsePortal</Portal>
        </>
    );
};

export default TestPortal;
