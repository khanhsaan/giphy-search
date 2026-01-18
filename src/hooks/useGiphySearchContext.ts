import { useContext } from "react"
import { GiphySearchContext } from "../context/GiphySearchContext"

export const useGiphySearchContext = () => {
    const context = useContext(GiphySearchContext);

    if (context === undefined) {
        throw new Error('Context must be used with a GiphySearchContext');
    } else {
        return context;
    }
}