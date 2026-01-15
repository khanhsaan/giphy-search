import { useGiphySearch } from "../hooks/useGiphySearch"


export const Header: React.FC = () => {
    const { loading, gifs } = useGiphySearch();

    return (
        <header style={{ padding: '20px', background: '#f0f0f0' }}>
            <h1>Giphy Search App</h1>
            <p>
                {loading ? 'Loadding...' : `Found ${gifs.length} GIFs`}
            </p>
        </header>
    )
}