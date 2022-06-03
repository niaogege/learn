import React, { useEffect, useState } from 'react';
import useDebounce from './useDebounce';

function App() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [res, setRes] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceSearchTerm: string = useDebounce<string>(searchTerm, 500);
    useEffect(() => {
        if (debounceSearchTerm) {
            setIsSearching(true);
            mockData(debounceSearchTerm).then((res) => {
                setRes(res);
                setIsSearching(false);
            });
        } else {
            setRes([]);
        }
    }, [debounceSearchTerm]);
    return (
        <div>
            <input
                placeholder="Search Marvel Comics"
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                    setSearchTerm((e.target as any).value)
                }
            />
            {isSearching && <div>Searching ...</div>}
            {res.map((result) => (
                <div key={result.id}>
                    <h4>{result?.title}</h4>
                </div>
            ))}
        </div>
    );
}
function mockData(param: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([param]);
        }, 300);
    });
}

export default App;
