import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './searchResults.css';
import '../../App.css';
import SkeletonCard from '../skeletonCard/skeletonCard.jsx';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(10);
    const [objects, setObjects] = useState([]);

    const query = searchParams.get('q') || searchParams.get('query') || '';
    const hasImages = searchParams.get('hasImages') === 'true';

    // Chargement des IDs
    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                setError(null);
                const apiParams = new URLSearchParams();
                for (const [key, value] of searchParams.entries()) {
                    if (value) apiParams.append(key, value);
                }
                if (!apiParams.get('q')) apiParams.set('q', query);

                const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?${apiParams.toString()}`;
                const searchRes = await fetch(searchUrl);
                const searchData = await searchRes.json();

                if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
                    setResults([]);
                    setObjects([]);
                    setLoading(false);
                    return;
                }
                setResults(searchData.objectIDs);
            } catch {
                setError('Une erreur est survenue.');
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchResults();
            setVisibleCount(10);
        }
    }, [searchParams, query]);

    // Chargement des objets
    useEffect(() => {
        const fetchObjects = async () => {
            if (results.length === 0) {
                setObjects([]);
                return;
            }
            // Si on charge plus, on ne remet pas tout à loading
            const isLoadMore = objects.length > 0 && visibleCount > objects.length;
            if (isLoadMore) setLoadingMore(true);
            else setLoading(true);

            try {
                let objs = [...objects];
                let index = objs.length;
                while (objs.length < visibleCount && index < results.length) {
                    const batchIds = results.slice(index, index + 10);
                    const batch = await Promise.all(
                        batchIds.map(id =>
                            fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(res => res.json())
                        )
                    );
                    if (hasImages) {
                        objs = objs.concat(batch.filter(obj => obj.primaryImageSmall && obj.primaryImageSmall.trim() !== ''));
                    } else {
                        objs = objs.concat(batch);
                    }
                    index += 10;
                }
                setObjects(objs.slice(0, visibleCount));
            } catch {
                setError('Une erreur est survenue.');
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };
        fetchObjects();
        // eslint-disable-next-line
    }, [results, visibleCount, hasImages]);

    if (error) return <p>{error}</p>;

    return (
        <div className="search-results-container">
            <h1>Résultats pour "{query}"</h1>
            {results.length === 0 && !loading ? (
                <div className="no-results-message">
                    Aucun résultat trouvé.
                </div>
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
                        {((loading && objects.length === 0) || loadingMore) &&
                            Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
                        }
                    </ul>
                    {visibleCount < results.length && !loading && (
                        <div style={{ textAlign: 'center', margin: '2em 0' }}>
                            <button
                                type="button"
                                className="load-more-btn"
                                onClick={() => setVisibleCount(c => c + 10)}
                                disabled={loadingMore}
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