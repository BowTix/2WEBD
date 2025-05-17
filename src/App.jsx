import { Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Highlight from './components/highlights/highlights';
import Footer from './components/footer/footer';
import ObjectDetail from './components/objectDetail/objectDetail';

function App() {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Highlight />} />
                <Route path="/object/:id" element={<ObjectDetail />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
