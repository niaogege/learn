import React from 'react';
import useRequest from './useRequest';
const MyApp = () => {
    const res = useRequest('https://bythewayer.com/api/v1/cats/image', {});
    console.log(res, 'ress');
    if (!res || !res.response) {
        return React.createElement("div", null, "Loading...");
    }
    const imageUrl = res.response;
    return (React.createElement(React.Fragment, null, imageUrl ? (React.createElement("div", null,
        React.createElement("img", { src: imageUrl, alt: "avatar", width: 400, height: "auto" }))) : null));
};
export default MyApp;
