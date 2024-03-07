import React from 'react';
import useToggle from './useToggle';

const MyApp = () => {
    const [isDarkMode, toggleDarkMode] = useToggle(false);
    return <button onClick={toggleDarkMode}>Toggle color theme:{isDarkMode}</button>;
};
export default MyApp;
