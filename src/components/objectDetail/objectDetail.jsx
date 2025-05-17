import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './objectDetail.css';

const ObjectDetail = () => {
    const { id } = useParams();
    const [object, setObject] = useState(null);
    const [mainImage, setMainImage] = useState(null);

    useEffect(() => {
        async function fetchObject() {
            const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
            const data = await res.json();
            setObject(data);
            setMainImage(data.primaryImage);
        }
        fetchObject();
    }, [id]);

    if (!object) return <p>Chargement...</p>;

    return (
        <div className="object-detail-container">
            <div className="images-container">
                {mainImage && (
                    <div className="main-image-container">
                        <img src={mainImage} alt={object.title} className="main-image" />
                    </div>
                )}

                {object.additionalImages?.length > 0 && (
                    <div className="thumbnail-slider">
                        {[object.primaryImage, ...object.additionalImages].map((img, index) => (
                            <img key={index} src={img} alt={`Miniature ${index}`} className={`thumbnail ${img === mainImage ? 'active' : ''}`} onClick={() => setMainImage(img)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="object-details">
                <section className="section title-section">
                    <h2>{object.title}</h2>
                    <p><strong>Date :</strong> {object.objectDate || 'Inconnue'}</p>
                </section>

                <section className="section artist-section">
                    <h3>Artiste</h3>
                    <p><strong>Nom :</strong> {object.artistDisplayName || 'Inconnu'}</p>
                    <p><strong>Rôle :</strong> {object.artistRole || 'Non spécifié'}</p>
                    <p><strong>Nationalité :</strong> {object.artistNationality || 'Inconnue'}</p>
                    <p><strong>Biographie :</strong> {object.artistDisplayBio || 'Non disponible'}</p>
                    {object.artistWikidata_URL && (
                        <p>
                            <a href={object.artistWikidata_URL} target="_blank" rel="noopener noreferrer">
                                Voir sur Wikidata
                            </a>
                        </p>
                    )}
                </section>

                <section className="section object-section">
                    <h3>Objet</h3>
                    <p><strong>Matériau :</strong> {object.medium || 'Non spécifié'}</p>
                    <p><strong>Dimensions :</strong> {object.dimensions || 'Non spécifiées'}</p>
                    <p><strong>Géographie :</strong> {object.city || 'Inconnue'}, {object.country || 'Inconnu'}</p>
                </section>

                <section className="section link-section">
                    <p>
                        <a href={object.objectURL} target="_blank" rel="noopener noreferrer">
                            Voir sur le site du Met
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default ObjectDetail;
