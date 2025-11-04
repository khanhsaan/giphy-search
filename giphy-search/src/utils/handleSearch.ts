import axios from 'axios';

const handleSearch = async(
    query: string,
    setLoading:(loading: boolean) => void,
    setError: (error: string) => void,
    setGifs:(gifs: any[])=> void
) => {
    const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

    // check if the query is not empty
    if(!query.trim()){
        return ;
    }

    setLoading(true);
    setError('');

    try{
        const minDelay = new Promise(resolve => setTimeout(resolve, 500));
        const [response,_] = await Promise.all([
            axios.get(
            `https://api.giphy.com/v1/gifs/search`,
            {
                params: {
                    // eslint-disable-next-line camelcase
                    api_key: API_KEY,
                    q: query,
                    limit: 50
                }
            }),
            minDelay
        ]);

        if(response.data){
            setGifs(response.data.data);
        } else {
            setError("Failed to fetch searched GIFS");
        }
    } catch (err){
        setError('Failed to fetch searched GIFs');
    } finally {
        setLoading(false);
    }
}

export default handleSearch;