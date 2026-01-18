import React, { useCallback, useContext, useEffect, useState } from 'react';
import copyToClipBoard from "../utils/copyToClipBoard";
import './GiphySearch.css';
import useAnimatedPlaceHolder from "../hooks/useAnimatedPlaceHolder";
import { useGiphySearchContext } from '../hooks/useGiphySearchContext';

const GiphySearch: React.FC = () => {
    const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

    const [query, setQuery] = useState<string>('');

    const context = useGiphySearchContext();

    const {
        loading,
        error,
        gifs,
        searchGifs,
        fetchTrendingGifs,
        clearError
    } = context;

    const phrases = [
        "cute dogs",
        "cute cats",
        "not scary clowns",
        "funny memes",
        "happy dances",
    ];
    let animatedPlaceHolder = useAnimatedPlaceHolder(phrases);

    const onSearch = useCallback(() => {
        searchGifs(query)
    }, [API_KEY, query]);

    useEffect(() => {
        fetchTrendingGifs()
    }, [API_KEY]);

    return (
        <div className="giphy-search">
            <h1>Search for a GIF!</h1>

            <form
                className="search-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSearch();
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
                <div className="error">
                    {error}
                </div>)}

            {loading && (
                <div className="loader">
                    <div className="spinner">
                    </div>
                </div>
            )}

            <div className="results-grid">
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

                        <a href={gif.url}
                            className='giphy-link-btn'
                            target='_blank'
                            rel='noopener noreferrer'>
                            View on Giphy
                        </a>

                        <img src={gif.images.fixed_width.url}
                            alt="GIF"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GiphySearch;

