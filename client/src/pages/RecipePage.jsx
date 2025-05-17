

// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchRecipeById, selectCurrentRecipe, selectRecipesStatus, deleteRecipe } from '../store/slices/recipesSlice';
// import Modal from 'react-modal';
// import RecipeActions from '../components/RecipeActions';
// import { fetchUserCollections } from '../store/slices/collectionsSlice';
// import Header from '../components/Header';

// Modal.setAppElement('#root'); // Указываем корневой элемент для модальных окон

// const RecipePage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//     // Получаем данные пользователя из localStorage
//     const role = localStorage.getItem('userRole');
//     const isAdmin = role === 'Admin';
//     console.log(role)

//     const recipeData = useSelector(selectCurrentRecipe);
//     const status = useSelector(selectRecipesStatus);
//     const { recipe, allergens } = recipeData || {};

//     useEffect(() => {
//         dispatch(fetchRecipeById(id));
//         dispatch(fetchUserCollections())
//     }, [id]);

//     const handleDelete = () => {
//         dispatch(deleteRecipe(id))
//             .then(() => {
//                 navigate('/recipes');
//             });
//         setIsDeleteModalOpen(false);
//     };

//     if (status === 'loading') return <div className="loading">Загрузка рецепта...</div>;
//     if (!recipe) return <div className="not-found">Рецепт не найден</div>;

//     // Безопасное получение данных
//     const ingredients = recipe.ingredients || [];
//     const steps = recipe.steps || [];
//     const categories = recipe.categories || [];
//     const cuisine = recipe.cuisine || {};
//     const totalTime = steps.reduce((sum, step) => sum + (step.durationMin || 0), 0);

//     console.log('RECIPE PAGE INGR', recipe)

//     return (
//         <>
//             <Header />

//             <div className="recipe-container">

//                 <Modal
//                     isOpen={isDeleteModalOpen}
//                     onRequestClose={() => setIsDeleteModalOpen(false)}
//                     className="modal"
//                     overlayClassName="modal-overlay"
//                 >
//                     <h2>Подтверждение удаления</h2>
//                     <p>Вы уверены, что хотите удалить этот рецепт?</p>
//                     <div className="modal-buttons">
//                         <button onClick={handleDelete} className="button-danger">
//                             Удалить
//                         </button>
//                         <button onClick={() => setIsDeleteModalOpen(false)} className="button-secondary">
//                             Отмена
//                         </button>
//                     </div>
//                 </Modal>

//                 <Modal
//                     isOpen={isEditModalOpen}
//                     onRequestClose={() => setIsEditModalOpen(false)}
//                     className="modal"
//                     overlayClassName="modal-overlay"
//                 >
//                     <h2>Редактирование рецепта</h2>
//                     <p>Здесь будет форма редактирования рецепта</p>
//                     <div className="modal-buttons">
//                         <button onClick={() => setIsEditModalOpen(false)} className="button-primary">
//                             Закрыть
//                         </button>
//                     </div>
//                 </Modal>

//                 {isAuthenticated ? (<RecipeActions recipeId={id} />) : (<></>)}


//                 <div className="recipe-actions">
//                     <button className="back-button" onClick={() => navigate(-1)}>
//                         &larr; Назад
//                     </button>

//                     {isAdmin && (
//                         <div className="admin-actions">
//                             <button
//                                 onClick={() => setIsEditModalOpen(true)}
//                                 className="edit-button"
//                             >
//                                 Редактировать
//                             </button>
//                             <button
//                                 onClick={() => setIsDeleteModalOpen(true)}
//                                 className="delete-button"
//                             >
//                                 Удалить
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 <header className="recipe-header">
//                     <h1>{recipe.title}</h1>
//                     <p className="description">{recipe.description}</p>
//                     <p className="recipe-author" onClick={() => navigate(`/profile/${recipe.user.id}`)}>{recipe.user.username}</p>
//                 </header>

//                 <div className="recipe-meta">
//                     <div className="meta-item">
//                         <span className="meta-label">Порций:</span>
//                         <span>{recipe.portions}</span>
//                     </div>

//                     {cuisine.name && (
//                         <div className="meta-item">
//                             <span className="meta-label">Кухня:</span>
//                             <span>{cuisine.name}</span>
//                         </div>
//                     )}

//                     <div className="meta-item">
//                         <span className="meta-label">Время приготовления:</span>
//                         <span>{totalTime} минут</span>
//                     </div>

//                     {allergens?.length > 0 && (
//                         <div className="meta-item allergens">
//                             <span className="meta-label">Аллергены:</span>
//                             <span className="allergens-list">
//                                 {allergens.map(a => a.name).join(', ')}
//                             </span>
//                         </div>
//                     )}
//                 </div>

//                 <div className="recipe-content">
//                     <section className="ingredients-section">
//                         <h2>Ингредиенты</h2>
//                         {ingredients.length > 0 ? (
//                             <ul className="ingredients-list">
//                                 {ingredients.map((ingredient) => (
//                                     <li key={ingredient.id} className="ingredient-item">
//                                         <span className="ingredient-quantity">
//                                             {ingredient.quantity} {ingredient.unit?.name}
//                                         </span>
//                                         <span className="ingredient-name">
//                                             {ingredient.ingredient?.name}
//                                         </span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p className="no-data">Ингредиенты не указаны</p>
//                         )}
//                     </section>

//                     <section className="steps-section">
//                         <h2>Шаги приготовления</h2>
//                         {steps.length > 0 ? (
//                             <ol className="steps-list">
//                                 {steps.map((step) => (
//                                     <li key={step.id} className="step-item">
//                                         <div className="step-header">
//                                             <h3>
//                                                 Шаг {step.order}
//                                                 <span className="step-time">({step.durationMin} мин)</span>
//                                             </h3>
//                                         </div>
//                                         <p className="step-description">{step.description || 'Описание отсутствует'}</p>
//                                     </li>
//                                 ))}
//                             </ol>
//                         ) : (
//                             <p className="no-data">Шаги приготовления не указаны</p>
//                         )}
//                     </section>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default RecipePage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecipeById, selectCurrentRecipe, selectRecipesStatus, deleteRecipe } from '../store/slices/recipesSlice';
import Modal from 'react-modal';
import RecipeActions from '../components/RecipeActions';
import { fetchUserCollections } from '../store/slices/collectionsSlice';
import Header from '../components/Header';

Modal.setAppElement('#root');

// Функция для конвертации граммов в бытовые меры
const convertToHouseholdMeasures = (grams) => {
    if (grams >= 200) {
        return { value: grams / 200, unit: 'стакан(а)' };
    } else if (grams >= 18) {
        return { value: Math.round(grams / 18), unit: 'ст. ложка(и)' };
    } else if (grams >= 5) {
        return { value: Math.round(grams / 5), unit: 'ч. ложка(и)' };
    } else {
        return { value: grams, unit: 'г' };
    }
};

const RecipePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [portions, setPortions] = useState(1);
    const [noScaleMode, setNoScaleMode] = useState(false);

    const role = localStorage.getItem('userRole');
    const isAdmin = role === 'Admin';

    const recipeData = useSelector(selectCurrentRecipe);
    const status = useSelector(selectRecipesStatus);
    const { recipe, allergens } = recipeData || {};

    useEffect(() => {
        dispatch(fetchRecipeById(id));
        dispatch(fetchUserCollections());
    }, [id]);

    // Устанавливаем исходное количество порций при загрузке рецепта
    useEffect(() => {
        if (recipe?.portions) {
            setPortions(recipe.portions);
        }
    }, [recipe]);

    const handleDelete = () => {
        dispatch(deleteRecipe(id))
            .then(() => {
                navigate('/recipes');
            });
        setIsDeleteModalOpen(false);
    };

    const handlePortionsChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setPortions(value);
        }
    };

    const toggleNoScaleMode = () => {
        setNoScaleMode(!noScaleMode);
    };

    if (status === 'loading') return <div className="loading">Загрузка рецепта...</div>;
    if (!recipe) return <div className="not-found">Рецепт не найден</div>;

    const ingredients = recipe.ingredients || [];
    const steps = recipe.steps || [];
    const categories = recipe.categories || [];
    const cuisine = recipe.cuisine || {};
    const totalTime = steps.reduce((sum, step) => sum + (step.durationMin || 0), 0);
    const originalPortions = recipe.portions || 1;
    const portionRatio = portions / originalPortions;

    return (
        <>
            <Header />

            <div className="recipe-container">
                <Modal
                    isOpen={isDeleteModalOpen}
                    onRequestClose={() => setIsDeleteModalOpen(false)}
                    className="modal"
                    overlayClassName="modal-overlay"
                >
                    <h2>Подтверждение удаления</h2>
                    <p>Вы уверены, что хотите удалить этот рецепт?</p>
                    <div className="modal-buttons">
                        <button onClick={handleDelete} className="button-danger">
                            Удалить
                        </button>
                        <button onClick={() => setIsDeleteModalOpen(false)} className="button-secondary">
                            Отмена
                        </button>
                    </div>
                </Modal>

                <Modal
                    isOpen={isEditModalOpen}
                    onRequestClose={() => setIsEditModalOpen(false)}
                    className="modal"
                    overlayClassName="modal-overlay"
                >
                    <h2>Редактирование рецепта</h2>
                    <p>Здесь будет форма редактирования рецепта</p>
                    <div className="modal-buttons">
                        <button onClick={() => setIsEditModalOpen(false)} className="button-primary">
                            Закрыть
                        </button>
                    </div>
                </Modal>

                {isAuthenticated ? (<RecipeActions recipeId={id} />) : (<></>)}

                <div className="recipe-actions">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        &larr; Назад
                    </button>

                    {isAdmin && (
                        <div className="admin-actions">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="edit-button"
                            >
                                Редактировать
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="delete-button"
                            >
                                Удалить
                            </button>
                        </div>
                    )}
                </div>

                <header className="recipe-header">
                    <h1>{recipe.title}</h1>
                    <p className="description">{recipe.description}</p>
                    <p className="recipe-author" onClick={() => navigate(`/profile/${recipe.user.id}`)}>{recipe.user.username}</p>
                </header>

                <div className="recipe-meta">
                    <div className="meta-item portions-control">
                        <span className="meta-label">Порций:</span>
                        <input
                            type="number"
                            min="1"
                            value={portions}
                            onChange={handlePortionsChange}
                            className="portions-input"
                        />
                    </div>

                    <div className="meta-item no-scale-toggle">
                        <button
                            onClick={toggleNoScaleMode}
                            className={`toggle-button ${noScaleMode ? 'active' : ''}`}
                        >
                            {noScaleMode ? 'Без весов (вкл)' : 'Без весов (выкл)'}
                        </button>
                    </div>

                    {cuisine.name && (
                        <div className="meta-item">
                            <span className="meta-label">Кухня:</span>
                            <span onClick={() => navigate(`/cuisine/${cuisine.id}`)}>{cuisine.name}</span>
                        </div>
                    )}
                    {console.log(categories)}
                    {categories && (
                        <div className="meta-item">
                            <span className="meta-label">Категории:</span>
                            {categories.map((cat) => {
                                console.log(cat.category.name);
                                return <span onClick={() => navigate(`/category/${cat.category.id}`)}>{cat.category.name}</span>
                            })}
                        </div>
                    )}

                    <div className="meta-item">
                        <span className="meta-label">Время приготовления:</span>
                        <span>{totalTime} минут</span>
                    </div>

                    {allergens?.length > 0 && (
                        <div className="meta-item allergens">
                            <span className="meta-label">Аллергены:</span>
                            <span className="allergens-list">
                                {allergens.map(a => a.name).join(', ')}
                            </span>
                        </div>
                    )}
                </div>

                <div className="recipe-content">
                    <section className="ingredients-section">
                        <h2>Ингредиенты</h2>
                        {ingredients.length > 0 ? (
                            <ul className="ingredients-list">
                                {ingredients.map((ingredient) => {
                                    const calculatedQuantity = ingredient.quantity * portionRatio;
                                    let displayQuantity = calculatedQuantity;
                                    let displayUnit = ingredient.unit?.name || '';

                                    if (noScaleMode && ingredient.unit?.shortName === 'г') {
                                        const converted = convertToHouseholdMeasures(calculatedQuantity);
                                        displayQuantity = converted.value;
                                        displayUnit = converted.unit;
                                    }

                                    return (
                                        <li key={ingredient.id} className="ingredient-item">
                                            <span className="ingredient-quantity">
                                                {displayQuantity.toFixed(displayQuantity % 1 === 0 ? 0 : 2)} {displayUnit}
                                            </span>
                                            <span className="ingredient-name">
                                                {ingredient.ingredient?.name}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="no-data">Ингредиенты не указаны</p>
                        )}
                    </section>

                    <section className="steps-section">
                        <h2>Шаги приготовления</h2>
                        {steps.length > 0 ? (
                            <ol className="steps-list">
                                {steps.map((step) => (
                                    <li key={step.id} className="step-item">
                                        <div className="step-header">
                                            <h3>
                                                Шаг {step.order}
                                                <span className="step-time">({step.durationMin} мин)</span>
                                            </h3>
                                        </div>
                                        <p className="step-description">{step.description || 'Описание отсутствует'}</p>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p className="no-data">Шаги приготовления не указаны</p>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
};

export default RecipePage;