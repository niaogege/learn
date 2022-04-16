import React from 'react';
import { render } from 'react-dom';
import usePortal from './usePortal';

const TestPortal = () => {
    const Portal = usePortal(document.querySelector('title') as HTMLElement);
    return (
        <>
            查看当前的title: Hello UsePortal
            {
                // Portal && <Portal> Hello UsePortal</Portal>
            }
        </>
    );
};

// render(<TestPortal />, document.getElementById('root'));

export default TestPortal;
