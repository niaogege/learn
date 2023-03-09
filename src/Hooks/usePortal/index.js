import React from 'react';
import usePortal from './usePortal';
let container;
const TestPortal = () => {
    if (!container) {
        container = document.createElement('div');
        container.setAttribute('id', 'cpp-ui');
        document.body.appendChild(container);
    }
    else {
        document.body.appendChild(container);
    }
    const Portal = container && usePortal(container);
    return (React.createElement(React.Fragment, null,
        React.createElement("h2", null,
            "\u5143\u7D20\u67E5\u770B",
            React.createElement("code", null, "document.getElementById('cpp-ui')")),
        React.createElement(Portal, null, " Hello UsePortal")));
};
export default TestPortal;
