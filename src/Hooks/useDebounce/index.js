import React, { useEffect, useState } from 'react';
import useDebounce from './useDebounce';
function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [res, setRes] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceSearchTerm = useDebounce(searchTerm, 500);
    useEffect(() => {
        if (debounceSearchTerm) {
            setIsSearching(true);
            mockData(debounceSearchTerm).then((res) => {
                setRes(res);
                setIsSearching(false);
            });
        }
        else {
            setRes([]);
        }
    }, [debounceSearchTerm]);
    return (React.createElement("div", null,
        React.createElement("input", { placeholder: "Search Marvel Comics", onChange: (e) => setSearchTerm(e.target.value) }),
        isSearching && React.createElement("div", null, "Searching ..."),
        res.map((result) => (React.createElement("div", { key: result.id },
            React.createElement("h4", null, result?.title))))));
}
function mockData(param) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([param]);
        }, 300);
    });
}
export default App;
