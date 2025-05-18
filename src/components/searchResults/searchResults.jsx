import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './searchResults.css';
import '../../App.css';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(10);

    const query = searchParams.get('q') || searchParams.get('query') || '';

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);

                const apiParams = new URLSearchParams();

                for (const [key, value] of searchParams.entries()) {
                    if (value) {
                        apiParams.append(key, value);
                    }
                }

                if (!apiParams.get('q')) {
                    apiParams.set('q', query);
                }

                const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?${apiParams.toString()}`;
                const searchRes = await fetch(searchUrl);
                const searchData = await searchRes.json();

                if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
                    setResults([]);
                    setLoading(false);
                    return;
                }

                // On stocke tous les IDs pour pouvoir charger plus tard
                setResults(searchData.objectIDs);
            } catch (err) {
                setError('Une erreur est survenue.');
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchResults();
            setVisibleCount(10); // reset au changement de recherche
        }
    }, [searchParams, query]);

    // Charger les objets à afficher
    const [objects, setObjects] = useState([]);
    useEffect(() => {
        const fetchObjects = async () => {
            if (results.length === 0) {
                setObjects([]);
                return;
            }
            setLoading(true);
            try {
                const idsToLoad = results.slice(0, visibleCount);
                const objectPromises = idsToLoad.map(id =>
                    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(res => res.json())
                );
                const objs = await Promise.all(objectPromises);
                setObjects(objs);
            } catch {
                setError('Une erreur est survenue.');
            } finally {
                setLoading(false);
            }
        };
        fetchObjects();
    }, [results, visibleCount]);

    if (loading) return <div className="chargement">Chargement...</div>;
    if (error) return <p>{error}</p>;

    return (
        <div className="search-results-container">
            <h1>Résultats pour "{query}"</h1>
            {results.length === 0 ? (
                <p>Aucun résultat trouvé.</p>
            ) : (
                <>
                    <ul className="search-results-list">
                        {objects.map(item => (
                            <li key={item.objectID} className="search-results-item">
                                {item.primaryImageSmall ? (
                                    <img
                                        src={item.primaryImageSmall}
                                        alt={item.title}
                                    />
                                ) : (
                                    <div className="no-image">Aucune image disponible</div>
                                )}
                                <h2>{item.title}</h2>
                                <p><strong>Artiste :</strong> {item.artistDisplayName || 'Inconnu'}</p>
                                <p><strong>Date :</strong> {item.objectDate || 'Inconnue'}</p>
                                {item.objectURL ? (
                                    <Link to={`/object/${item.objectID}`}>En savoir plus</Link>
                                ) : (
                                    <p>(Pas de lien disponible)</p>
                                )}
                            </li>
                        ))}
                    </ul>
                    {visibleCount < results.length && (
                        <div style={{ textAlign: 'center', margin: '2em 0' }}>
                            <button
                                className="load-more-btn"
                                onClick={() => setVisibleCount(c => c + 10)}
                            >
                                Charger plus
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchResults;