// from: https://developers.giphy.com/docs/api/endpoint/#search
export interface GifObject {
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

export interface GiphyContextObject {
    loading: boolean,
    error: string,
    gifs: GifObject[],
    searchGifs: (query: string) => Promise<void>,
    fetchTrendingGifs: () => Promise<void>,
    clearError: () => void
}