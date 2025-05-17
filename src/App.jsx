import { Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Highlight from './components/highlights/highlights';
import Footer from './components/footer/footer';
import ObjectDetail from './components/objectDetail/objectDetail';
import SearchResults from './components/searchResults/searchResults.jsx';
import AdvancedSearch from './components/advancedSearch/advancedSearch.jsx'


function App() {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Highlight />} />
                <Route path="/object/:id" element={<ObjectDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/advanced-search" element={<AdvancedSearch />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
