import './App.css';
import GiphySearch from "./components/GiphySearch";
import { GiphySearchProvider } from './context/GiphySearchContext';

function App() {
  return (
    <GiphySearchProvider>
      <div className='App'>
        {/* <Header /> */}
        <GiphySearch></GiphySearch>
      </div>
    </GiphySearchProvider>
  );
}

export default App;
