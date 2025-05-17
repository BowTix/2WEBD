import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './objectDetail.css';

const ObjectDetail = () => {
    const { id } = useParams();
    const [object, setObject] = useState(null);

    useEffect(() => {
        async function fetchObject() {
            const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
            const data = await res.json();
            setObject(data);
        }

        fetchObject();
    }, [id]);

    if (!object) return <p>Chargement...</p>;

    return (
        <div className="object-detail-container">
            {object.primaryImage && (
                <img src={object.primaryImage} alt={object.title}/>
            )}
            <div className="object-details">
                <h2>{object.title}</h2>
                <p><strong>Artiste :</strong> {object.artistDisplayName || 'Inconnu'}</p>
                <p><strong>Date :</strong> {object.objectDate || 'Inconnue'}</p>
                <p>{object.creditLine}</p>
                <p>
                    <a href={object.objectURL} target="_blank" rel="noopener noreferrer">
                        Voir sur le site du Met
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ObjectDetail;
