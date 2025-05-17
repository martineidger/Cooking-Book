// src/components/RecipeCard.tsx

import { useNavigate } from "react-router-dom";

export const RecipeInProfileCard = ({ recipe, showAuthor = true }) => {
    const navigate = useNavigate()
    const clickHandler = (id) => {
        navigate(`/recipes/${id}`);
    }
    return (
        <div className="recipe-card">
            <div onClick={() => clickHandler(recipe.id)}>
                <div className="recipe-image">
                    {recipe.image ? (
                        <img src={recipe.image} alt={recipe.title} />
                    ) : (
                        <div className="recipe-image-placeholder">
                            {recipe.title.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="recipe-info">
                    <h3>{recipe.title}</h3>
                    <p className="recipe-description">{recipe.description}</p>
                    <div className="recipe-meta">
                        <span className="recipe-time">{recipe.cookingTime} мин</span>
                        <span className="recipe-portions">{recipe.portions} порций</span>
                    </div>
                    {showAuthor && recipe.user && (
                        <p className="recipe-author">
                            Автор: {recipe.user.name || recipe.user.email}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};