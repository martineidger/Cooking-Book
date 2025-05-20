

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Masonry from 'react-masonry-css';
import { debounce } from 'lodash';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import {
    fetchRecipes,
    fetchCategories,
    fetchCuisines,
    loadMoreRecipes,
    selectAllRecipes,
    selectRecipesStatus,
    selectCategories,
    selectCuisines,
    selectRecipesError,
    selectFilters,
    selectHasMoreRecipes,
    setFilters,
    resetFilters
} from '../store/slices/recipesSlice';
import SubscriptionsSection from '../components/SubscriptionsSection';
import CategoriesSection from '../components/CategoriesSection';
import SearchByIngredientsCount from '../components/SearchByIngredientsCount';

const HomePage = () => {
    const dispatch = useDispatch();
    const recipes = useSelector(selectAllRecipes);
    const status = useSelector(selectRecipesStatus);
    const error = useSelector(selectRecipesError);
    const filters = useSelector(selectFilters);
    const categories = useSelector(selectCategories);
    const cuisines = useSelector(selectCuisines);
    const hasMore = useSelector(selectHasMoreRecipes);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('all');
    const [initialLoad, setInitialLoad] = useState(true);

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    // Загрузка начальных данных
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCuisines());
    }, [dispatch]);

    //Основная загрузка рецептов при изменении фильтров или вкладки
    useEffect(() => {
        const loadRecipes = async () => {
            setInitialLoad(true);
            await dispatch(fetchRecipes({
                page: 1,
                limit: 10,
                ...filters,
                categoryIds: filters.categoryIds || [],
                cuisineIds: filters.cuisineIds || []
            }));
            setInitialLoad(false);
        };

        loadRecipes();
    }, [dispatch, filters]);

    // useEffect(() => {
    //     const loadRecipes = async () => {
    //         if (initialLoad && recipes.length > 0) return;

    //         setInitialLoad(true);
    //         await dispatch(fetchRecipes({
    //             page: filters.page || 1,
    //             limit: 10,
    //             ...filters,
    //             categoryIds: filters.categoryIds || [],
    //             cuisineIds: filters.cuisineIds || []
    //         }));
    //         setInitialLoad(false);
    //     };

    //     loadRecipes();
    // }, [dispatch, filters]);

    // Обработчик бесконечной подгрузки
    const handleLoadMore = useCallback(async () => {
        if (status === 'loading-more' || !hasMore) return;
        await dispatch(loadMoreRecipes());
    }, [dispatch, status, hasMore]);

    // Обработчик скролла с debounce
    useEffect(() => {
        const handleScroll = debounce(() => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight * 0.8) {
                handleLoadMore();
            }
        }, 200);

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleLoadMore]);

    const debouncedSearch = useCallback(
        debounce((searchTerm) => {
            dispatch(setFilters({
                searchTerm,
                page: 1
            }));
        }, 500),
        []
    );

    const handleSearch = (searchTerm) => {
        dispatch(setFilters({ searchTerm }));
    };

    const handleCategorySelect = (categoryId) => {
        const currentCategories = filters.categoryIds || [];
        const newCategories = currentCategories.includes(categoryId)
            ? currentCategories.filter(id => id !== categoryId)
            : [...currentCategories, categoryId];

        dispatch(setFilters({
            categoryIds: newCategories
        }));
    };

    const handleCuisineSelect = (cuisineId) => {
        const currentCuisines = filters.cuisineIds || [];
        const newCuisines = currentCuisines.includes(cuisineId)
            ? currentCuisines.filter(id => id !== cuisineId)
            : [...currentCuisines, cuisineId];

        dispatch(setFilters({
            cuisineIds: newCuisines
        }));
    };



    const handleSortChange = async (sortBy) => {
        dispatch(setFilters({
            sortBy,
            page: 1
        }));
        window.scrollTo(0, 0);
    };

    const handleSortOrderChange = async (sortOrder) => {
        dispatch(setFilters({
            sortOrder,
            page: 1
        }));
        window.scrollTo(0, 0);
    };

    const handleResetFilters = () => {
        dispatch(resetFilters());
    };

    const isCategoryActive = (categoryId) => (filters.categoryIds || []).includes(categoryId);
    const isCuisineActive = (cuisineId) => (filters.cuisineIds || []).includes(cuisineId);

    return (
        <>
            {/* <Header /> */}
            <SearchByIngredientsCount />
            <div className="home-page">
                <main className="main-content">
                    <section className="hero-section">
                        <h1>Откройте для себя мир вкусных рецептов</h1>
                        <p>Найдите идеи для вашего следующего кулинарного шедевра</p>
                    </section>

                    <div className="content-tabs">
                        <button
                            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            Все рецепты
                        </button>

                        {isAuthenticated && <button
                            className={`tab-button ${activeTab === 'subscriptions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('subscriptions')}
                        >
                            Мои подписки
                        </button>}

                        {isAuthenticated && <button
                            className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
                            onClick={() => setActiveTab('categories')}
                        >
                            Любимые категории
                        </button>}
                    </div>

                    {activeTab === 'subscriptions' && <SubscriptionsSection />}
                    {activeTab === 'categories' && <CategoriesSection />}

                    {activeTab === 'all' && (
                        <section className="all-recipes">
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Найти рецепты по названию или ингредиентам"
                                    onChange={(e) => handleSearch(e.target.value)}
                                    value={filters.searchTerm || ''}
                                />
                                <button className="search-button">
                                    <i className="icon-search"></i>
                                </button>
                            </div>

                            <section className="filters-section">
                                <div className="filter-group">
                                    <h3>Категории</h3>
                                    <div className="chips-container">
                                        {categories.map(category => (
                                            <button
                                                key={category.id}
                                                className={`chip ${isCategoryActive(category.id) ? 'active' : ''}`}
                                                onClick={() => handleCategorySelect(category.id)}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="filter-group">
                                    <h3>Кухни мира</h3>
                                    <div className="chips-container">
                                        {cuisines.map(cuisine => (
                                            <button
                                                key={cuisine.id}
                                                className={`chip ${isCuisineActive(cuisine.id) ? 'active' : ''}`}
                                                onClick={() => handleCuisineSelect(cuisine.id)}
                                            >
                                                {cuisine.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="quick-filters">
                                    <div className="filter-group">
                                        <label>Сортировка:</label>
                                        <select
                                            value={filters.sortBy || 'title'}
                                            onChange={(e) => handleSortChange(e.target.value)}
                                        >
                                            <option value="title">Название</option>
                                            <option value="createdAt">Дата создания</option>
                                            {/* <option value="cookingTime">По времени</option> */}
                                        </select>

                                        <select
                                            value={filters.sortOrder || 'asc'}
                                            onChange={(e) => handleSortOrderChange(e.target.value)}
                                        >
                                            <option value="asc">По возрастанию</option>
                                            <option value="desc">По убыванию</option>
                                        </select>
                                    </div>

                                    <button
                                        className="reset-filters"
                                        onClick={handleResetFilters}
                                    >
                                        Сбросить фильтры
                                    </button>
                                </div>
                            </section>

                            <section className="recipes-grid">
                                {initialLoad ? (
                                    <div className="loading-spinner">Загрузка...</div>
                                ) : error ? (
                                    <div className="error-message">{error}</div>
                                ) : (
                                    <>
                                        <Masonry
                                            breakpointCols={breakpointColumnsObj}
                                            className="masonry-grid"
                                            columnClassName="masonry-column"
                                        >
                                            {recipes.map(({ recipe }) => (
                                                <RecipeCard
                                                    key={recipe.id}
                                                    recipe={recipe}
                                                    showAuthor={activeTab !== 'subscriptions'}
                                                />
                                            ))}
                                        </Masonry>

                                        {status === 'loading-more' && (
                                            <div className="loading-more">Загрузка...</div>
                                        )}

                                        {!hasMore && recipes.length > 0 && (
                                            <div className="no-more-recipes">
                                                Вы просмотрели все рецепты
                                            </div>
                                        )}
                                    </>
                                )}
                            </section>
                        </section>
                    )}
                </main>
            </div>
        </>
    );
};

export default HomePage;