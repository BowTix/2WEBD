import { useEffect, useState } from 'react';
import {Link, useSearchParams} from 'react-router-dom';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const query = searchParams.get('query');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const searchRes = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(query)}&hasImages=true`);
                const searchData = await searchRes.json();

                if (searchData.total === 0) {
                    setResults([]);
                    setLoading(false);
                    return;
                }

                const objectIDs = searchData.objectIDs.slice(0, 10); // Limite à 10 résultats

                const objectPromises = objectIDs.map(id =>
                    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(res => res.json())
                );

                const objects = await Promise.all(objectPromises);
                setResults(objects);
            } catch (err) {
                setError('Une erreur est survenue.');
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchResults();
        }
    }, [query]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Résultats pour "{query}"</h1>
            {results.length === 0 ? (
                <p>Aucun résultat trouvé.</p>
            ) : (
                <ul>
                    {results.map(item => (
                        <li key={item.objectID}>
                            <h2>{item.title}</h2>
                            {item.primaryImageSmall && <img src={item.primaryImageSmall} alt={item.title} style={{ maxWidth: '200px' }} />}
                            <p>{item.artistDisplayName}</p>
                            <p>{item.objectDate}</p>
                            {item.objectURL ? (
                                <Link to={`/object/${item.objectID}`}>En savoir plus</Link>
                            ) : (
                                <p>No URL available</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchResults;
