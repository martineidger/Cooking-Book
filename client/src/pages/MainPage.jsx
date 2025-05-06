import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Masonry from 'react-masonry-css';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import {
    fetchRecipes,
    fetchCategories,
    fetchCuisines,
    selectAllRecipes,
    selectRecipesStatus,
    selectCategories,
    selectCuisines,
    selectRecipesError,
    selectPagination,
    selectFilters,
    setFilters,
    resetFilters,
    setPage
} from '../store/slices/recipesSlice';
import SearchByIngredientsCount from '../components/SearchByIngredientsCount';

const AllRecipe = () => {
    const dispatch = useDispatch();
    const recipes = useSelector(selectAllRecipes);
    const status = useSelector(selectRecipesStatus);
    const error = useSelector(selectRecipesError);
    const pagination = useSelector(selectPagination);
    const filters = useSelector(selectFilters);
    const categories = useSelector(selectCategories);
    const cuisines = useSelector(selectCuisines);
    const [loading, setLoading] = useState(false);

    const { page: currentPage, limit, total, totalPages } = pagination;

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCuisines());
    }, [dispatch]);

    useEffect(() => {
        const loadRecipes = async () => {
            setLoading(true);
            try {
                await dispatch(fetchRecipes({
                    page: currentPage,
                    limit,
                    ...filters
                })).unwrap();
            } finally {
                setLoading(false);
            }
        };

        loadRecipes();
    }, [dispatch, currentPage, limit, filters]);

    const handleSearch = (searchTerm) => {
        dispatch(setFilters({ searchTerm, page: 1 }));
    };

    const handleFilterChange = (newFilters) => {
        dispatch(setFilters({ ...newFilters, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            dispatch(setPage(newPage));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleResetFilters = () => {
        dispatch(resetFilters());
    };

    const handleCategorySelect = (categoryId) => {
        dispatch(setFilters({
            category: filters.category === categoryId ? null : categoryId,
            page: 1
        }));
    };

    const handleCuisineSelect = (cuisineId) => {
        dispatch(setFilters({
            cuisine: filters.cuisine === cuisineId ? null : cuisineId,
            page: 1
        }));
    };

    const isCategoryActive = (categoryId) => filters.category === categoryId;
    const isCuisineActive = (cuisineId) => filters.cuisine === cuisineId;

    let content;

    if (status === 'loading' || loading) {
        content = <div className="loading">Загрузка рецептов...</div>;
    } else if (status === 'failed') {
        content = <div className="error">{error}</div>;
    } else if (status === 'succeeded') {
        content = (
            <>
                <div className="card-wrapper">
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {recipes.map(({ recipe }) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </Masonry>
                </div>

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
        );
    }

    return (
        <div className="all-recipe-page">
            <Header />
            <main>
                <h1>Самые лучшие рецепты здесь</h1>

                <SearchByIngredientsCount />

                <div className="main-browse">
                    <input
                        type="text"
                        placeholder="Найти самые лучшие рецепты"
                        onChange={(e) => handleSearch(e.target.value)}
                        value={filters.searchTerm || ''}
                    />

                    <div className="filters">
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                        >
                            <option value="title">По названию</option>
                            <option value="createdAt">По дате добавления</option>
                        </select>

                        <select
                            value={filters.sortOrder}
                            onChange={(e) => handleFilterChange({ sortOrder: e.target.value })}
                        >
                            <option value="asc">По возрастанию</option>
                            <option value="desc">По убыванию</option>
                        </select>

                        <button onClick={handleResetFilters}>Сбросить фильтры</button>
                    </div>
                </div>

                {/* Фильтры по категориям */}
                <div className="category-filters-section">
                    <h3 className="filter-subtitle">Категории:</h3>
                    <div className="category-chips-container">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-chip ${isCategoryActive(category.id) ? 'category-chip-active' : ''}`}
                                onClick={() => handleCategorySelect(category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Фильтры по кухням */}
                {/* <div className="cuisine-filters-section">
                    <h3 className="filter-subtitle">Кухни:</h3>
                    <div className="cuisine-chips-container">
                        {cuisines.map(cuisine => (
                            <button
                                key={cuisine.id}
                                className={`cuisine-chip ${isCuisineActive(cuisine.id) ? 'cuisine-chip-active' : ''}`}
                                onClick={() => handleCuisineSelect(cuisine.id)}
                            >
                                {cuisine.name}
                            </button>
                        ))}
                    </div>
                </div> */}

                {content}
            </main>
        </div>
    );
};

export default AllRecipe;