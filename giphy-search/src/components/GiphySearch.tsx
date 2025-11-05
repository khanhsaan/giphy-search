import React, {useEffect, useState} from 'react';
import handleSearch from "../utils/handleSearch";
import copyToClipBoard from "../utils/copyToClipBoard";
import './GiphySearch.css';
import useAnimatedPlaceHolder from "../hooks/useAnimatedPlaceHolder";
import handleTrendingGifs from "../utils/handleTrendingGifs";

// from: https://developers.giphy.com/docs/api/endpoint/#search
interface GifObject {
    id: string,
    images: {
        fixed_width: {
            url: string;
            height: string;
            width: string;
        }
    };
    url: string;
    bitly_url: string;
}
const GiphySearch: React.FC = () => {
    const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

    const[query, setQuery] = useState<string>('');
    const[loading, setLoading] = useState<boolean>(false);
    const[error, setError] = useState<string>('');
    const[gifs, setGifs] = useState<GifObject[]>([]);

    const phrases = [
        "cute dogs",
        "cute cats",
        "not scary clowns",
        "funny memes",
        "happy dances",
    ];
    let animatedPlaceHolder = useAnimatedPlaceHolder(phrases);

    useEffect(() => {
        handleTrendingGifs(
            API_KEY,
            setLoading,
            setError,
            setGifs)
    }, [API_KEY]);
    return (
        <div className="giphy-search">
            <h1>Search for a GIF!</h1>

            <form
                className= "search-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(
                        query,
                        setLoading,
                        setError,
                        setGifs
                    )
                }}>
                <input
                    className="search-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={animatedPlaceHolder}
                />

                <button
                    className="search-button"
                    type="submit">
                    Search
                </button>
            </form>

            {error && (
                <div
                    className="error">
                    {error}
                </div>)}

            {loading && (
                <div className="loader">
                    <div className="spinner">
                        <p>Loading...</p>
                    </div>
                </div>
            )}

            <div
                className="results-grid">
                {gifs.map((gif) => (
                    <div className="gif-card"
                         key={gif.id}
                         style={{
                            height: `${gif.images.fixed_width.height}px`
                        }}>

                        <button
                            className="copy-btn"
                            onClick={() => copyToClipBoard(gif.bitly_url)}>
                            Copy URL
                        </button>

                        <img src={gif.images.fixed_width.url}
                             alt="GIF"
                             style={{
                                 width: '100%',
                                 height: '100%',
                                 objectFit: 'cover'
                             }}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default  GiphySearch;

