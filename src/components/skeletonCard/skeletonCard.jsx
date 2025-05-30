import './skeletonCard.css';

const SkeletonCard = () => (
    <li className="search-results-item skeleton">
        <div className="skeleton-img" />
        <div className="skeleton-title" />
        <div className="skeleton-text" />
        <div className="skeleton-text short" />
        <div className="skeleton-link" />
    </li>
);

export default SkeletonCard;