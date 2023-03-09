import React from 'react';
import useWindowSize from './useWindowSize';
const MyApp = () => {
    const { width, height } = useWindowSize();
    return (React.createElement("p", null,
        "Window size: (",
        width,
        " x ",
        height,
        ")"));
};
// ReactDOM.render(<MyApp />, document.getElementById('root'));
export default MyApp;
