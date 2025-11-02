import React, { useState } from 'react';
import axios from 'axios';


const GiphySearch: React.FC = () => {
    const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

    const[query, setQuery] = useState<string>('');
    return (
        <div>
            <h1>Giphy Search</h1>

            <form>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a GIFs..."
                />
            </form>
        </div>
    )
}

export default  GiphySearch;

