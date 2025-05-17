import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Masonry from 'react-masonry-css';
import {
    fetchRecipesByCategory,
    fetchRecipesByCuisine,
    selectRecipesByCategory,
    selectRecipesStatus,
    selectRecipesError,
    selectPagination,
    setPage
} from '../store/slices/recipesSlice';
import {
    fetchCategoryDetails,
    selectCategoryDetails,
    followCategory,
    unfollowCategory,
    selectIsCategoryFollowed
} from '../store/slices/categoriesSlice';
import {
    fetchCuisineDetails,
    selectCuisineDetails
} from '../store/slices/cuisinesSlice';
import RecipeCard from '../components/RecipeCard';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SubscribeButton from '../components/SubscribeButton';

const CategoryCuisinePage = () => {
    const { type, id } = useParams(); // 'category' или 'cuisine'
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('recipes'); // 'recipes' или 'details'

    // Получаем данные в зависимости от типа страницы
    const details = useSelector(type === 'category' ? selectCategoryDetails : selectCuisineDetails);
    const recipes = useSelector(selectRecipesByCategory);
    const status = useSelector(selectRecipesStatus);
    const error = useSelector(selectRecipesError);
    const pagination = useSelector(selectPagination);
    const isFollowed = useSelector(selectIsCategoryFollowed(id));

    const { page: currentPage, totalPages } = pagination;

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                if (type === 'category') {
                    await dispatch(fetchCategoryDetails(id));
                    await dispatch(fetchRecipesByCategory({ id, page: 1 }));
                } else {
                    await dispatch(fetchCuisineDetails(id));
                    await dispatch(fetchRecipesByCuisine({ id, page: 1 }));
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [dispatch, id, type]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            dispatch(setPage(newPage));
            if (type === 'category') {
                dispatch(fetchRecipesByCategory({ id, page: newPage }));
            } else {
                dispatch(fetchRecipesByCuisine({ id, page: newPage }));
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleToggleFollow = () => {
        if (type === 'category') {
            if (isFollowed) {
                dispatch(unfollowCategory(id));
            } else {
                dispatch(followCategory(id));
            }
        }
    };

    if (loading || status === 'loading') return <LoadingSpinner />;
    if (!details) return <ErrorMessage message="Категория/кухня не найдена" />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="category-cuisine-page">
            <Header />

            <div className="hero-section" style={{
                backgroundImage: `url(${details.imageUrl || '/default-banner.jpg'})`
            }}>
                <div className="hero-overlay">
                    <h1>{details.name}</h1>
                    <p className="description">{details.description}</p>

                    {type === 'category' && (
                        <SubscribeButton
                            isSubscribed={isFollowed}
                            onToggle={handleToggleFollow}
                            followersCount={details.followersCount}
                        />
                    )}
                </div>
            </div>

            <div className="content-tabs">
                <button
                    className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('recipes')}
                >
                    Рецепты
                </button>
                <button
                    className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('details')}
                >
                    О {type === 'category' ? 'категории' : 'кухне'}
                </button>
            </div>

            {activeTab === 'recipes' ? (
                <>
                    <div className="recipes-count">
                        Найдено рецептов: {pagination.total}
                    </div>

                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="masonry-grid"
                        columnClassName="masonry-column"
                    >
                        {recipes.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                showCategory={type !== 'category'}
                                showCuisine={type !== 'cuisine'}
                            />
                        ))}
                    </Masonry>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Назад
                            </button>
                            <span>Страница {currentPage} из {totalPages}</span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Вперед
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="details-section">
                    <div className="details-content">
                        <h2>Подробнее о {details.name}</h2>
                        <p>{details.longDescription || 'Нет дополнительного описания'}</p>

                        {type === 'cuisine' && (
                            <>
                                <h3>Характерные особенности:</h3>
                                <ul className="features-list">
                                    <li>Типичные ингредиенты: {details.typicalIngredients?.join(', ') || 'не указаны'}</li>
                                    <li>Основные способы приготовления: {details.cookingMethods?.join(', ') || 'не указаны'}</li>
                                    <li>Популярные блюда: {details.popularDishes?.join(', ') || 'не указаны'}</li>
                                </ul>
                            </>
                        )}

                        {type === 'category' && details.recipeCount > 0 && (
                            <div className="stats">
                                <div className="stat-item">
                                    <span className="stat-value">{details.recipeCount}</span>
                                    <span className="stat-label">рецептов</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{details.followersCount}</span>
                                    <span className="stat-label">подписчиков</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="related-items">
                        <h3>Смотрите также:</h3>
                        {/* Здесь можно добавить компонент с похожими категориями/кухнями */}
                    </div>
                </div>
            )}

            <style jsx>{`
                .category-cuisine-page {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }
                
                .hero-section {
                    height: 400px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 30px;
                }
                
                .hero-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 30px;
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                    color: white;
                }
                
                .hero-overlay h1 {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                }
                
                .hero-overlay .description {
                    font-size: 1.2rem;
                    max-width: 80%;
                    margin-bottom: 20px;
                }
                
                .content-tabs {
                    display: flex;
                    border-bottom: 1px solid #eee;
                    margin-bottom: 30px;
                }
                
                .tab-button {
                    padding: 10px 20px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    position: relative;
                }
                
                .tab-button.active {
                    font-weight: bold;
                }
                
                .tab-button.active:after {
                    content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: #ff6b6b;
                }
                
                .recipes-count {
                    margin-bottom: 20px;
                    font-size: 0.9rem;
                    color: #666;
                }
                
                .masonry-grid {
                    display: flex;
                    margin-left: -15px;
                    width: auto;
                }
                
                .masonry-column {
                    padding-left: 15px;
                    background-clip: padding-box;
                }
                
                .pagination {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    margin: 40px 0;
                }
                
                .pagination button {
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    background: white;
                    cursor: pointer;
                    border-radius: 4px;
                }
                
                .pagination button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .details-section {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 30px;
                }
                
                .details-content h2 {
                    margin-bottom: 20px;
                }
                
                .details-content p {
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                
                .features-list {
                    margin: 20px 0;
                    padding-left: 20px;
                }
                
                .features-list li {
                    margin-bottom: 10px;
                }
                
                .stats {
                    display: flex;
                    gap: 30px;
                    margin: 30px 0;
                }
                
                .stat-item {
                    text-align: center;
                }
                
                .stat-value {
                    display: block;
                    font-size: 2rem;
                    font-weight: bold;
                    color: #ff6b6b;
                }
                
                .stat-label {
                    font-size: 0.9rem;
                    color: #666;
                }
                
                .related-items {
                    background: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                    height: fit-content;
                }
                
                @media (max-width: 768px) {
                    .details-section {
                        grid-template-columns: 1fr;
                    }
                    
                    .hero-overlay h1 {
                        font-size: 2rem;
                    }
                    
                    .hero-overlay .description {
                        max-width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default CategoryCuisinePage;