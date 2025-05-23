// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const RecipeCard = ({ recipe }) => {
//     const navigate = useNavigate();
//     const [isHovered, setIsHovered] = useState(false);
//     const [showIngredients, setShowIngredients] = useState(false);
//     const [hoverTimer, setHoverTimer] = useState(null);

//     const handleMouseEnter = () => {
//         setIsHovered(true);
//         setHoverTimer(setTimeout(() => setShowIngredients(true), 0));
//     };

//     const handleMouseLeave = () => {
//         setIsHovered(false);
//         setShowIngredients(false);
//         clearTimeout(hoverTimer);
//     };

//     const handleClick = () => {
//         // Переход на страницу рецепта при клике
//         navigate(`/recipes/${recipe.id}`);
//     };



//     useEffect(() => {
//         return () => clearTimeout(hoverTimer);
//     }, [hoverTimer]);

//     // Форматирование ингредиентов для API
//     const formatIngredients = (ingredients) => {
//         //console.log(ingredients)
//         return ingredients.map(ing => ({
//             name: ing.ingredient.name,
//             quantity: ing.quantity,
//             unit: ing.unit?.shortName || ''
//         }));
//     };

//     //console.log('RECIPE', recipe)
//     const previewIngredients = formatIngredients(recipe.ingredients).slice(0, 2);
//     const remainingIngredients = recipe.ingredients.length - 2;



//     return (
//         <div
//             className="recipe-card"
//             onMouseEnter={handleMouseEnter}
//             onMouseLeave={handleMouseLeave}
//             onClick={handleClick}
//             role="button"
//             tabIndex={0}
//             onKeyDown={(e) => e.key === 'Enter' && handleClick()}
//         >
//             <div className={`recipe-image-container ${showIngredients ? 'show-ingredients' : ''}`}>
//                 <img
//                     src={recipe.imageUrl || 'img/default-img.jpg'}
//                     alt={recipe.title}
//                     className="recipe-image"
//                 />

//                 {showIngredients && (
//                     <div className="ingredients-overlay">
//                         <h4>Ингредиенты:</h4>
//                         <ul className="ingredients-list">
//                             {formatIngredients(recipe.ingredients).map((ingredient, index) => (
//                                 <li key={index}>
//                                     {ingredient.name} - {ingredient.quantity} {ingredient.unit && `${ingredient.unit} `}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//             </div>

//             <div className="recipe-info">
//                 <h3 className="recipe-title">{recipe.title}</h3>
//                 <p className="recipe-description">{recipe.description?.substring(0, 100)}...</p>
//                 <p className="recipe-author" onClick={() => navigate(`profile/${recipe.user.id}`)}>{recipe.user?.username}</p>
//                 <div className="ingredients-preview">
//                     {previewIngredients.map((ing, i) => (
//                         <span key={i}>
//                             {ing.name} - {ing.quantity} {ing.unit && `${ing.unit} `}
//                             {i < previewIngredients.length - 1 && ', '}
//                         </span>
//                     ))}
//                     {remainingIngredients > 0 && (
//                         <span className="more-ingredients"> и ещё {remainingIngredients}...</span>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RecipeCard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [showIngredients, setShowIngredients] = useState(false);
    const [hoverTimer, setHoverTimer] = useState(null);

    const handleMouseEnter = () => {
        setIsHovered(true);
        setHoverTimer(setTimeout(() => setShowIngredients(true), 0));
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setShowIngredients(false);
        clearTimeout(hoverTimer);
    };

    const handleClick = () => {
        navigate(`/recipes/${recipe.id}`);
    };

    const handleAuthorClick = (e) => {
        e.stopPropagation();
        navigate(`/profile/${recipe.user.id}`);
    };

    useEffect(() => {
        return () => clearTimeout(hoverTimer);
    }, [hoverTimer]);

    const formatIngredients = (ingredients) => {
        return ingredients.map(ing => ({
            name: ing.ingredient.name,
            quantity: ing.quantity,
            unit: ing.unit?.shortName || ''
        }));
    };

    const previewIngredients = formatIngredients(recipe.ingredients).slice(0, 2);
    const remainingIngredients = recipe.ingredients.length - 2;

    return (
        <div
            className="recipe-card"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
            <div className={`recipe-image-container ${showIngredients ? 'show-ingredients' : ''}`}>
                <img
                    src={recipe.imageUrl || '/img/default-img.jpg'}
                    alt={recipe.title}
                    className="recipe-image"
                />

                {showIngredients && (
                    <div className="ingredients-overlay">
                        <h4>Ингредиенты:</h4>
                        <ul className="ingredients-list">
                            {formatIngredients(recipe.ingredients).map((ingredient, index) => (
                                <li key={index}>
                                    {ingredient.name} - {ingredient.quantity} {ingredient.unit && `${ingredient.unit} `}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="recipe-content-wrapper">
                <div className="recipe-info">
                    <h3 className="recipe-title">{recipe.title}</h3>
                    <p className="recipe-description">{recipe.description?.substring(0, 100)}...</p>
                    <div className="ingredients-preview">
                        {previewIngredients.map((ing, i) => (
                            <span key={i}>
                                {ing.name} - {ing.quantity} {ing.unit && `${ing.unit} `}
                                {i < previewIngredients.length - 1 && ', '}
                            </span>
                        ))}
                        {remainingIngredients > 0 && (
                            <span className="more-ingredients"> и ещё {remainingIngredients}...</span>
                        )}
                    </div>
                </div>

                {/* <div className="recipe-author" onClick={handleAuthorClick}>
                    <div className="author-avatar">
                        {recipe.user?.avatarUrl ? (
                            <img src={recipe.user.avatarUrl} alt={recipe.user.username} />
                        ) : (
                            <span>{recipe.user?.username?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <span className="author-name">{recipe.user?.username}</span>
                </div> */}
            </div>
        </div>
    );
};

export default RecipeCard;