import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdvancedSearch = () => {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState('q');
    const [formValues, setFormValues] = useState({
        q: '',
        dateBegin: '',
        dateEnd: '',
        artistOrCulture: '',
        medium: '',
        geoLocation: '',
        departmentId: '',
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();

        switch (searchType) {
            case 'q':
                if (formValues.q.trim()) params.append('q', formValues.q.trim());
                break;
            case 'date':
                if (formValues.dateBegin) params.append('dateBegin', formValues.dateBegin);
                if (formValues.dateEnd) params.append('dateEnd', formValues.dateEnd);
                if (formValues.q.trim()) params.append('q', formValues.q.trim());
                break;
            case 'artistOrCulture':
                if (formValues.artistOrCulture.trim()) {
                    params.append('artistOrCulture', 'true');
                    params.append('q', formValues.artistOrCulture.trim());
                }
                break;
            case 'medium':
                if (formValues.medium.trim() && formValues.mediumQuery.trim()) {
                    params.append('medium', formValues.medium.trim());
                    params.append('q', formValues.mediumQuery.trim());
                }
                break;
            case 'geoLocation':
                if (formValues.geoLocation.trim() && formValues.geoQuery.trim()) {
                    params.append('geoLocation', formValues.geoLocation.trim());
                    params.append('q', formValues.geoQuery.trim());
                }
                break;
            case 'departmentId':
                if (formValues.departmentId.trim() && formValues.departmentQuery.trim()) {
                    params.append('departmentId', formValues.departmentId.trim());
                    params.append('q', formValues.departmentQuery.trim());
                }
                break;
            default:
                break;
        }

        navigate(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2>Recherche Avancée</h2>

            <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                <option value="q">Recherche simple (mot-clé)</option>
                <option value="date">Par date</option>
                <option value="artistOrCulture">Par artiste ou culture</option>
                <option value="medium">Par médium</option>
                <option value="geoLocation">Par localisation</option>
                <option value="departmentId">Par département</option>
            </select>

            {searchType === 'q' && (
                <input type="text" name="q" placeholder="Mot-clé" value={formValues.q} onChange={handleInputChange} />
            )}

            {searchType === 'date' && (
                <>
                    <input type="number" name="dateBegin" placeholder="Date de début (ex: 1500)" value={formValues.dateBegin} onChange={handleInputChange} />
                    <input type="number" name="dateEnd" placeholder="Date de fin (ex: 1600)" value={formValues.dateEnd} onChange={handleInputChange} />
                    <input type="text" name="q" placeholder="Mot-clé" value={formValues.q} onChange={handleInputChange} />
                </>
            )}

            {searchType === 'artistOrCulture' && (
                <input
                    type="text"
                    name="artistOrCulture"
                    placeholder="Nom d'artiste ou culture"
                    value={formValues.artistOrCulture}
                    onChange={handleInputChange}
                />
            )}

            {searchType === 'medium' && (
                <>
                    <input
                        type="text"
                        name="medium"
                        placeholder="Ex: Silk|Quilts"
                        value={formValues.medium}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="mediumQuery"
                        placeholder="Mot-clé de recherche"
                        value={formValues.mediumQuery}
                        onChange={handleInputChange}
                    />
                </>
            )}

            {searchType === 'geoLocation' && (
                <>
                    <input
                        type="text"
                        name="geoLocation"
                        placeholder="Ex: France"
                        value={formValues.geoLocation}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="geoQuery"
                        placeholder="Mot-clé de recherche"
                        value={formValues.geoQuery}
                        onChange={handleInputChange}
                    />
                </>
            )}

            {searchType === 'departmentId' && (
                <>
                    <input
                        type="number"
                        name="departmentId"
                        placeholder="ID du département (ex: 6)"
                        value={formValues.departmentId}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="departmentQuery"
                        placeholder="Mot-clé de recherche"
                        value={formValues.departmentQuery}
                        onChange={handleInputChange}
                    />
                </>
            )}

            <button type="submit">🔎 Rechercher</button>
        </form>
    );
};

export default AdvancedSearch;
