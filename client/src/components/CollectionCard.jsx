// src/components/CollectionCard.tsx

import { useNavigate } from "react-router-dom";

export const CollectionCard = ({ collection, showAuthor = true }) => {
    const navigate = useNavigate()
    const onClickHandler = (id) => {
        navigate(`/collections/${id}`)
    }
    return (
        <div className="collection-card">
            <div onClick={() => onClickHandler(collection.id)}>
                <div className="collection-image">
                    {collection.coverImage ? (
                        <img src={collection.coverImage} alt={collection.name} />
                    ) : (
                        <div className="collection-image-placeholder">
                            {collection.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="collection-info">
                    <h3>{collection.name}</h3>
                    <p className="collection-recipes-count">{collection.recipesCount} рецептов</p>
                    {showAuthor && collection.user && (
                        <p className="collection-author">
                            Автор: {collection.user.name || collection.user.email}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};