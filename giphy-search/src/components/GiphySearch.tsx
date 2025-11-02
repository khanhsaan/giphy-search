import React, { useState } from 'react';
import axios from 'axios';
import handleSearch from "../../utils/handleSearch";

// from: https://developers.giphy.com/docs/api/endpoint/#search
interface GifObject {
    id: string,
    images: {
        fixed_height: {
            url: string;
        }
    };
    url: string;
    bitly_url: string;
}
const GiphySearch: React.FC = () => {
    const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

    const[query, setQuery] = useState<string>('');
    const[loading, setLoading] = useState<Boolean>(false);
    const[error, setError] = useState<string>('');
    const[gifs, setGifs] = useState<any[]>([]);

    return (
        <div>
            <h1>Giphy Search</h1>

            <form
                onSubmit={() => {
                    handleSearch(query)
                }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a GIFs..."
                />

                <button
                    type="submit">
                    Search
                </button>
            </form>
        </div>
    )
}

export default  GiphySearch;

