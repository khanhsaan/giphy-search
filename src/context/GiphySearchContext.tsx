import { createContext, ReactNode, useCallback, useState } from "react";
import { GifObject, GiphyContextObject } from "../../types";
import axios from "axios";

export const GiphySearchContext = createContext<GiphyContextObject | undefined>(undefined);

export const GiphySearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [gifs, setGifs] = useState<GifObject[]>([]);

    const withMinDelay = async<T,>(promise: Promise<T>, delayTime: number): Promise<T> => {
        const minDelay = new Promise((resolve, _) => {
            setTimeout(() => {
                resolve(true)
            }, delayTime)
        })

        const [response, _] = await Promise.all([
            promise,
            minDelay
        ])

        return response;
    }

    const delayTime = 1000;
    const fetchTrendingGifs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await withMinDelay(
                axios.get(
                    `https://api.giphy.com/v1/gifs/trending`,
                    {
                        params: {
                            api_key: API_KEY, // eslint-disable-line camelcase
                            limit: 50,
                        }
                    }
                ),
                delayTime
            )
            if (response.data) {
                setGifs(response.data.data);
            } else {
                throw new Error('No data when fetch trending GIFs');
            }
        } catch (error) {
            setError(`Failed to fetch trending GIFs: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [API_KEY]);

    const handleSearch = useCallback(async (query: string) => {
        try {
            const response = await withMinDelay(
                axios.get(
                    `https://api.giphy.com/v1/gifs/search`,
                    {
                        params: {
                            api_key: API_KEY, // eslint-disable-line camelcase
                            q: query,
                            limit: 50
                        }
                    }
                ),
                delayTime
            )
            if (response.data) {
                setGifs(response.data.data);
            } else {
                throw new Error('No data when search for a GIF');
            }
        } catch (error) {
            setError(`Failed to search for a GIF: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [API_KEY]);

    const clearError = useCallback(() => {
        setError('');
    }, []);

    const value: GiphyContextObject = {
        loading,
        error,
        gifs,
        searchGifs: handleSearch,
        fetchTrendingGifs,
        clearError
    }

    return (
        <GiphySearchContext.Provider value={value}>
            {children}
        </GiphySearchContext.Provider>
    );
}