
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecipeById, selectCurrentRecipe, selectRecipesStatus, deleteRecipe } from '../store/slices/recipesSlice';
import Modal from 'react-modal';
import RecipeActions from '../components/RecipeActions';
import { fetchUserCollections } from '../store/slices/collectionsSlice';
import { EditRecipeModal } from '../components/EditRecipeModal';

Modal.setAppElement('#root');

const RecipeImage = ({ src, alt, style }) => {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
                <span>Изображение не доступно</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            style={style}
            onError={() => setError(true)}
        />
    );
};

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
    const [portions, setPortions] = useState(1);
    const [noScaleMode, setNoScaleMode] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRecipeId, setEditingRecipeId] = useState(null);

    const role = localStorage.getItem('userRole');
    const currUserId = localStorage.getItem('userId')
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
        dispatch(deleteRecipe({ id }))
            .then(() => {
                navigate('/');
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

    const handleEditRecipe = () => {
        setEditingRecipeId(id);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingRecipeId(null);
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
            {/* <Header /> */}
            <EditRecipeModal
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                recipe={recipe}
            />

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

                {(isAuthenticated && !isAdmin) && <RecipeActions recipeId={id} />}

                <div className="recipe-actions">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        &larr; Назад
                    </button>

                    {(isAdmin || (currUserId === recipe.userId)) && (
                        <div className="admin-actions">
                            <button
                                onClick={handleEditRecipe}
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
                    {recipe.user.role === 'Admin' ? (
                        <p className="recipe-author" >
                            Cooker
                        </p>
                    ) : (
                        <p className="recipe-author" onClick={() => navigate(`/profile/${recipe.user.id}`)}>
                            {recipe.user.username}
                        </p>
                    )}


                    {/* Основное изображение рецепта */}
                    {recipe.imageUrl && (
                        <div className="recipe-main-image">
                            <RecipeImage
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                style={{
                                    maxHeight: '400px',
                                    width: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    margin: '20px 0'
                                }}
                                showLoading
                                errorIcon
                            />
                        </div>
                    )}
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
                            <span onClick={() => navigate(`/more/cuisine/${cuisine.id}`)}>{cuisine.name}</span>
                        </div>
                    )}

                    {categories.length > 0 && (
                        <div className="meta-item">
                            <span className="meta-label">Категории:</span>
                            {categories.map((cat) => (
                                <span
                                    key={cat.category.id}
                                    onClick={() => navigate(`/more/category/${cat.category.id}`)}
                                >
                                    {cat.category.name}
                                </span>
                            ))}
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
                                                {step.durationMin !== 0 && (
                                                    <span className="step-time">({step.durationMin} мин)</span>
                                                )}
                                            </h3>
                                        </div>
                                        {step.imageUrl && (
                                            <div className="step-image">
                                                <RecipeImage
                                                    src={step.imageUrl}
                                                    alt={`Шаг ${step.order}`}
                                                    style={{
                                                        maxHeight: '300px',
                                                        width: '100%',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        margin: '10px 0'
                                                    }}
                                                    showLoading
                                                    errorIcon
                                                />
                                            </div>
                                        )}
                                        <p className="step-description">
                                            {step.description || 'Описание отсутствует'}
                                        </p>
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