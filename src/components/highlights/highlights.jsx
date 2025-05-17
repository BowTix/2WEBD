import { useEffect, useState } from 'react';
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
        <section className="highlight-section">
            <h2>Articles à la une...</h2>
            <div className="highlight-grid">
                {highlights.map((art) => (
                    <div className="highlight-card" key={art.objectID}>
                        <img src={art.primaryImageSmall} alt={art.title} />
                        <hr/>
                            <div class="highlight-card-info">
                            <h3>{art.title}</h3>
                            <p>Par {art.artistDisplayName || "Unknown Artist"}</p>
                            <p>{art.objectDate || "Unknown Date"}</p>
                                {art.objectURL ? (
                                    <a href={art.objectURL} target="_blank" rel="noopener noreferrer">En savoir plus</a>
                                ) : (
                                    <p>No URL available</p>
                                )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Highlight;
