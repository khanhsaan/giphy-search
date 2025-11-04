import axios from "axios";
import {response} from "express";

const handleTrendingGifs = async (
    setLoading: (loading: boolean) => void,
    setError: (error: string) => void,
    setGifs:(gifs: any[]) => void
) => {
    const API_KEY = process.env["REACT_APP_GIPHY_API_KEY"];

    setLoading(true);
    setError('');

    try{
        const response = await axios.get(
            `https://api.giphy.com/v1/gifs/trending`,
            {
                params: {
                    // eslint-disable-next-line camelcase
                    api_key: API_KEY,
                    limit: 50,
                }
            }
        );

        if(response.data){
            setGifs(response.data.data);
        } else {
            setError("Failed to fetch trending GIFS");
        }
    } catch (err){
        setError("Failed to fetch trending GIFs")
    } finally {
        setLoading(false);
    }
}

export default handleTrendingGifs;