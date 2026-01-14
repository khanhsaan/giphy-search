import axios from "axios";
import minDelay from "./minDelay";

const handleTrendingGifs = async (
    API_KEY: string,
    setLoading: (loading: boolean) => void,
    setError: (error: string) => void,
    setGifs: (gifs: any[]) => void
) => {

    setLoading(true);
    setError('');

    try {
        const [response, _] = await Promise.all([
            axios.get(
                `https://api.giphy.com/v1/gifs/trending`,
                {
                    params: {
                        api_key: API_KEY, // eslint-disable-line camelcase
                        limit: 50,
                    }
                }
            ),
            minDelay,
        ])

        if (response.data) {
            setGifs(response.data.data);
        } else {
            setError("Failed to fetch trending GIFS");
        }
    } catch (err) {
        setError("Failed to fetch trending GIFs")
    } finally {
        setLoading(false);
    }
}

export default handleTrendingGifs;