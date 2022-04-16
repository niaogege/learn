import React from 'react';
import useWindowSize from './useWindowSize';

const MyApp = () => {
    const { width, height } = useWindowSize();
    return (
        <p>
            Window size: ({width} x {height})
        </p>
    );
};
// ReactDOM.render(<MyApp />, document.getElementById('root'));
export default MyApp;
