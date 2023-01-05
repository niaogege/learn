import React from 'react';
import useRequest from './useRequest';

const MyApp = () => {
    const res = useRequest('https://bythewayer.com/api/v1/cats/image', {});
    console.log(res, 'ress')
    if (!res || !res.response) {
        return <div>Loading...</div>;
    }
    const imageUrl = res.response;
    return (
        <>
            {
                imageUrl ? (<div>
                    <img src={imageUrl} alt="avatar" width={400} height="auto" />
                </div>) : null
            }
        </>
    );
};
export default MyApp;
