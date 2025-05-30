import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './highlights.css';
import SkeletonCard from '../skeletonCard/skeletonCard.jsx';

const Highlight = () => {
    const [highlights, setHighlights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHighlights() {
            const res = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&q=painting');
            const data = await res.json();

            if (data.objectIDs?.length > 0) {
                const selected = data.objectIDs.slice(0, 12);
                const objects = await Promise.all(
                    selected.map(id =>
                        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(res => res.json())
                    )
                );
                setHighlights(objects);
            }
            setLoading(false);
        }

        fetchHighlights();
    }, []);

    return (
        <>
            <section className="highlight-section">
                <h2>Œuvres à la une...</h2>
                <div className="highlight-grid">
                    {loading
                        ? Array.from({ length: 12 }).map((_, i) => (
                            <SkeletonCard key={`highlight-skeleton-${i}`} />
                        ))
                        : highlights.map((art) => (
                            <div className="highlight-card" key={art.objectID}>
                                {art.primaryImageSmall ? (
                                    <img src={art.primaryImageSmall} alt={art.title} />
                                ) : (
                                    <div className="no-image-message">Aucune image</div>
                                )}
                                <hr/>
                                <div className="highlight-card-info">
                                    <h3>{art.title}</h3>
                                    <p>{art.artistPrefix} {art.artistDisplayName || "Unknown Artist"}</p>
                                    <p>{art.objectDate || "Unknown Date"}</p>
                                    {art.objectURL ? (
                                        <Link to={`/object/${art.objectID}`}>En savoir plus</Link>
                                    ) : (
                                        <p>Lien non disponible</p>
                                    )}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
            <section>
                <div className="advanced-search">
                    <Link to={`/advanced-search`} className="advanced-search-link">Recherche avancée</Link>
                </div>
            </section>
        </>
    );
};

export default Highlight;