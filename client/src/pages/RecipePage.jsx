// import React, { useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchRecipeById, selectCurrentRecipe, selectRecipesStatus } from '../store/slices/recipesSlice';

// const RecipePage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const recipeData = useSelector(selectCurrentRecipe);
//     const status = useSelector(selectRecipesStatus);
//     const { recipe, allergens } = recipeData || {};

//     useEffect(() => {
//         dispatch(fetchRecipeById(id));
//     }, [dispatch, id]);

//     if (status === 'loading') return <div className="loading">Загрузка рецепта...</div>;
//     if (!recipe) return <div className="not-found">Рецепт не найден</div>;

//     // Безопасное получение данных
//     const ingredients = recipe.ingredients || [];
//     const steps = recipe.steps || [];
//     const categories = recipe.categories || [];
//     const cuisine = recipe.cuisine || {};
//     const totalTime = steps.reduce((sum, step) => sum + (step.durationMin || 0), 0);

//     return (
//         <div className="recipe-container">
//             <button className="back-button" onClick={() => navigate(-1)}>
//                 &larr; Назад
//             </button>

//             <header className="recipe-header">
//                 <h1>{recipe.title}</h1>
//                 <p className="description">{recipe.description}</p>
//             </header>

//             <div className="recipe-meta">
//                 <div className="meta-item">
//                     <span className="meta-label">Порций:</span>
//                     <span>{recipe.portions}</span>
//                 </div>

//                 {cuisine.name && (
//                     <div className="meta-item">
//                         <span className="meta-label">Кухня:</span>
//                         <span>{cuisine.name}</span>
//                     </div>
//                 )}

//                 <div className="meta-item">
//                     <span className="meta-label">Время приготовления:</span>
//                     <span>{totalTime} минут</span>
//                 </div>

//                 {allergens.length > 0 && (
//                     <div className="meta-item allergens">
//                         <span className="meta-label">Аллергены:</span>
//                         <span className="allergens-list">
//                             {allergens.map(a => a.name).join(', ')}
//                         </span>
//                     </div>
//                 )}
//             </div>

//             <div className="recipe-content">
//                 <section className="ingredients-section">
//                     <h2>Ингредиенты</h2>
//                     {ingredients.length > 0 ? (
//                         <ul className="ingredients-list">
//                             {ingredients.map((ingredient) => (
//                                 <li key={ingredient.id} className="ingredient-item">
//                                     <span className="ingredient-quantity">
//                                         {ingredient.quantity} {ingredient.unit?.name}
//                                     </span>
//                                     <span className="ingredient-name">
//                                         {ingredient.ingredient?.name}
//                                     </span>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="no-data">Ингредиенты не указаны</p>
//                     )}
//                 </section>

//                 <section className="steps-section">
//                     <h2>Шаги приготовления</h2>
//                     {steps.length > 0 ? (
//                         <ol className="steps-list">
//                             {steps.map((step) => (
//                                 <li key={step.id} className="step-item">
//                                     <div className="step-header">
//                                         <h3>
//                                             Шаг {step.order}
//                                             <span className="step-time">({step.durationMin} мин)</span>
//                                         </h3>
//                                     </div>
//                                     <p className="step-description">{step.description || 'Описание отсутствует'}</p>
//                                 </li>
//                             ))}
//                         </ol>
//                     ) : (
//                         <p className="no-data">Шаги приготовления не указаны</p>
//                     )}
//                 </section>
//             </div>
//         </div>
//     );
// };

// export default RecipePage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecipeById, selectCurrentRecipe, selectRecipesStatus, deleteRecipe } from '../store/slices/recipesSlice';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Указываем корневой элемент для модальных окон

const RecipePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Получаем данные пользователя из localStorage
    const role = localStorage.getItem('userRole');
    const isAdmin = role === 'Admin';
    console.log(role)

    const recipeData = useSelector(selectCurrentRecipe);
    const status = useSelector(selectRecipesStatus);
    const { recipe, allergens } = recipeData || {};

    useEffect(() => {
        dispatch(fetchRecipeById(id));
    }, [dispatch, id]);

    const handleDelete = () => {
        dispatch(deleteRecipe(id))
            .then(() => {
                navigate('/recipes');
            });
        setIsDeleteModalOpen(false);
    };

    if (status === 'loading') return <div className="loading">Загрузка рецепта...</div>;
    if (!recipe) return <div className="not-found">Рецепт не найден</div>;

    // Безопасное получение данных
    const ingredients = recipe.ingredients || [];
    const steps = recipe.steps || [];
    const categories = recipe.categories || [];
    const cuisine = recipe.cuisine || {};
    const totalTime = steps.reduce((sum, step) => sum + (step.durationMin || 0), 0);

    return (
        <div className="recipe-container">
            {/* Модальное окно подтверждения удаления */}
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

            {/* Модальное окно редактирования (заглушка) */}
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
            </header>

            <div className="recipe-meta">
                <div className="meta-item">
                    <span className="meta-label">Порций:</span>
                    <span>{recipe.portions}</span>
                </div>

                {cuisine.name && (
                    <div className="meta-item">
                        <span className="meta-label">Кухня:</span>
                        <span>{cuisine.name}</span>
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
                            {ingredients.map((ingredient) => (
                                <li key={ingredient.id} className="ingredient-item">
                                    <span className="ingredient-quantity">
                                        {ingredient.quantity} {ingredient.unit?.name}
                                    </span>
                                    <span className="ingredient-name">
                                        {ingredient.ingredient?.name}
                                    </span>
                                </li>
                            ))}
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
    );
};

export default RecipePage;