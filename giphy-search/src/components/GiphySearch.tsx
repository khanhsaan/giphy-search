import React, { useState } from 'react';
import axios from 'axios';
import handleSearch from "../utils/handleSearch";
import {Simulate} from "react-dom/test-utils";
import copy = Simulate.copy;
import copyToClipBoard from "../utils/copyToClipBoard";
import './GiphySearch.css';
import useAnimatedPlaceHolder from "./useAnimatedPlaceHolder";

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
    const[loading, setLoading] = useState<Boolean>(false);
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

                    <div>
                </div>
            </div>
        ))}
    </div>
    </div>
    )
}

export default  GiphySearch;

