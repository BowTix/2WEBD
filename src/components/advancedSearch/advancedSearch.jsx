import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdvancedSearch = () => {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState('basic');
    const [formValues, setFormValues] = useState({
        query: '',
        artistCulture: '',
        medium: '',
        geoLocation: '',
        departmentId: '',
        dateBegin: '',
        dateEnd: '',
        isHighlight: false,
        isOnView: false,
        hasImages: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construire les paramètres dans l'ordre souhaité
        const params = [];

        if (formValues.isHighlight) params.push('isHighlight=true');
        if (formValues.isOnView) params.push('isOnView=true');
        if (formValues.hasImages) params.push('hasImages=true');

        switch (searchType) {
            case 'artistOrCulture':
                params.push('artistOrCulture=true');
                break;
            case 'medium':
                if (formValues.medium) params.push(`medium=${encodeURIComponent(formValues.medium)}`);
                break;
            case 'geoLocation':
                if (formValues.geoLocation) params.push(`geoLocation=${encodeURIComponent(formValues.geoLocation)}`);
                break;
            case 'departmentId':
                if (formValues.departmentId) params.push(`departmentId=${formValues.departmentId}`);
                break;
            case 'dateRange':
                if (formValues.dateBegin) params.push(`dateBegin=${formValues.dateBegin}`);
                if (formValues.dateEnd) params.push(`dateEnd=${formValues.dateEnd}`);
                break;
            default:
                break;
        }

        // Toujours à la fin
        if (formValues.query) params.push(`q=${encodeURIComponent(formValues.query)}`);

        navigate(`/search?${params.join('&')}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Recherche avancée</h2>

            <label>Type de recherche :</label>
            <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                <option value="basic">Query (par défaut)</option>
                <option value="artistOrCulture">Artiste ou culture</option>
                <option value="medium">Medium</option>
                <option value="geoLocation">Localisation</option>
                <option value="departmentId">Département ID</option>
                <option value="dateRange">Plage de dates</option>
            </select>

            {(searchType === 'basic' || searchType === 'artistOrCulture') && (
                <input
                    type="text"
                    name="query"
                    placeholder="Mot-clé"
                    value={formValues.query}
                    onChange={handleChange}
                />
            )}

            {searchType === 'medium' && (
                <>
                    <input
                        type="text"
                        name="medium"
                        placeholder="Medium (ex: Silk|Quilts)"
                        value={formValues.medium}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="query"
                        placeholder="Mot-clé"
                        value={formValues.query}
                        onChange={handleChange}
                    />
                </>
            )}

            {searchType === 'geoLocation' && (
                <>
                    <input
                        type="text"
                        name="geoLocation"
                        placeholder="Pays / région"
                        value={formValues.geoLocation}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="query"
                        placeholder="Mot-clé"
                        value={formValues.query}
                        onChange={handleChange}
                    />
                </>
            )}

            {searchType === 'departmentId' && (
                <>
                    <input
                        type="number"
                        name="departmentId"
                        placeholder="ID du département"
                        value={formValues.departmentId}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="query"
                        placeholder="Mot-clé"
                        value={formValues.query}
                        onChange={handleChange}
                    />
                </>
            )}

            {searchType === 'dateRange' && (
                <>
                    <input
                        type="number"
                        name="dateBegin"
                        placeholder="Date de début"
                        value={formValues.dateBegin}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="dateEnd"
                        placeholder="Date de fin"
                        value={formValues.dateEnd}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="query"
                        placeholder="Mot-clé"
                        value={formValues.query}
                        onChange={handleChange}
                    />
                </>
            )}

            <fieldset>
                <legend>Filtres supplémentaires</legend>
                <label>
                    <input type="checkbox" name="isHighlight" checked={formValues.isHighlight} onChange={handleCheckboxChange} />
                    En vedette
                </label>
                <label>
                    <input type="checkbox" name="isOnView" checked={formValues.isOnView} onChange={handleCheckboxChange} />
                    Visible au musée
                </label>
                <label>
                    <input type="checkbox" name="hasImages" checked={formValues.hasImages} onChange={handleCheckboxChange} />
                    Avec image
                </label>
            </fieldset>

            <button type="submit">Rechercher</button>
        </form>
    );
};

export default AdvancedSearch;
