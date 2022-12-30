import React from 'react';
import useRequest from './useRequest';

const MyApp = (props) => {
    const res = useRequest('https://dog.ceo/api/breeds/image/random', {
        method: 'GET',
        headers: [
            { 'Content-Type': 'application/json' },
        ],
    });
    if (!res || !res.response) {
        return <div>Loading...</div>;
    }
    const imageUrl = res.response.message;
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
