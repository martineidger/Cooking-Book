// RecipeCard.js
import React, { useState, useEffect } from 'react';

const RecipeCard = ({ recipe }) => {
    console.log("CARD   ", recipe)

    const [isHovered, setIsHovered] = useState(false);
    const [showIngredients, setShowIngredients] = useState(false);
    const [hoverTimer, setHoverTimer] = useState(null);

    const handleMouseEnter = () => {
        setIsHovered(true);
        setHoverTimer(setTimeout(() => setShowIngredients(true), 500));
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setShowIngredients(false);
        clearTimeout(hoverTimer);
    };

    useEffect(() => {
        return () => clearTimeout(hoverTimer);
    }, [hoverTimer]);

    // Форматирование ингредиентов для API
    const formatIngredients = (ingredients) => {
        return ingredients.map(ing => ({
            name: ing.ingredient.name,
            quantity: ing.quantity,
            //unit: ing.unit
        }));
    };

    const previewIngredients = formatIngredients(recipe.ingredients).slice(0, 2);
    const remainingIngredients = recipe.ingredients.length - 2;

    return (
        <div
            className="recipe-card"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`recipe-image-container ${showIngredients ? 'show-ingredients' : ''}`}>
                <img
                    src={recipe.image || 'img/default-img.jpg'}
                    alt={recipe.title}
                    className="recipe-image"
                />

                {showIngredients && (
                    <div className="ingredients-overlay">
                        <h4>Ингредиенты:</h4>
                        <ul className="ingredients-list">
                            {formatIngredients(recipe.ingredients).map((ingredient, index) => (
                                <li key={index}>
                                    {ingredient.quantity} {/*ingredient.unit*/} {ingredient.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="recipe-info">
                <h3 className="recipe-title">{recipe.title}</h3>
                <p className="recipe-description">{recipe.description?.substring(0, 100)}...</p>
                <div className="ingredients-preview">
                    {previewIngredients.map((ing, i) => (
                        <span key={i}>{ing.quantity} {/*ing.unit*/} {ing.name}</span>
                    ))}
                    {remainingIngredients > 0 && (
                        <span className="more-ingredients"> и ещё {remainingIngredients}...</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
