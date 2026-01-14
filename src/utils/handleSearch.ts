import axios from 'axios';
import minDelay from './minDelay';

async function handleSearch(
    API_KEY: string,
    query: string,
    setLoading: (loading: boolean) => void,
    setError: (error: string) => void,
    setGifs: (gifs: any[]) => void
) {
    // check if the query is not empty
    if (!query.trim()) {
        return;
    }

    setLoading(true);
    setError('');

    try {
        const [response, _] = await Promise.all([
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
            minDelay
        ]);

        if (response.data) {
            setGifs(response.data.data);
        } else {
            setError("Failed to fetch searched GIFS");
        }
    } catch (err) {
        setError('Failed to fetch searched GIFs');
    } finally {
        setLoading(false);
    }
}

export default handleSearch;