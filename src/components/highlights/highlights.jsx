import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './highlights.css';

const Highlight = () => {
    const [highlights, setHighlights] = useState([]);

    useEffect(() => {
        async function fetchHighlights() {
            const res = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&q=painting');
            const data = await res.json();

            if (data.objectIDs?.length > 0) {
                const selected = data.objectIDs.slice(0, 8);
                const objects = await Promise.all(
                    selected.map(id =>
                        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(res => res.json())
                    )
                );
                setHighlights(objects);
            }
        }

        fetchHighlights();
    }, []);

    return (
        <>
        <section className="highlight-section">
            <h2>Œuvres à la une...</h2>
            <div className="highlight-grid">
                {highlights.map((art) => (
                    <div className="highlight-card" key={art.objectID}>
                        <img src={art.primaryImageSmall} alt={art.title} />
                        <hr/>
                            <div className="highlight-card-info">
                            <h3>{art.title}</h3>
                            <p>{art.artistPrefix} {art.artistDisplayName || "Unknown Artist"}</p>
                            <p>{art.objectDate || "Unknown Date"}</p>
                            {art.objectURL ? (
                                <Link to={`/object/${art.objectID}`}>En savoir plus</Link>
                            ) : (
                                <p>No URL available</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
        <section>
            <div>
                <Link to={`/advanced-search`}>Recherche avancée</Link>
            </div>
        </section>
        </>
    );
};

export default Highlight;
