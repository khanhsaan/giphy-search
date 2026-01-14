import { useState } from "react"
import { GifObject } from "../../types";

const useGiphyAPI = (API: string) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [gif, setGifs] = useState<GifObject[]>([]);
}