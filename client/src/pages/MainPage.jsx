import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Masonry from 'react-masonry-css';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import {
    fetchRecipes,
    selectAllRecipes,
    selectRecipesStatus,
    selectRecipesError,
    selectPagination,
    selectFilters,
    setFilters,
    resetFilters,
    setPage
} from '../store/slices/recipesSlice';

const AllRecipe = () => {
    const dispatch = useDispatch();
    const recipes = useSelector(selectAllRecipes);
    const status = useSelector(selectRecipesStatus);
    const error = useSelector(selectRecipesError);
    const pagination = useSelector(selectPagination);
    const filters = useSelector(selectFilters);

    const { page: currentPage, limit, total, totalPages } = pagination;

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    // Загрузка рецептов при монтировании и изменении фильтров/страницы
    useEffect(() => {
        dispatch(fetchRecipes({
            page: currentPage,
            limit,
            ...filters
        }));
    }, [dispatch, currentPage, limit, filters]);

    const handleSearch = (searchTerm) => {
        dispatch(setFilters({ searchTerm }));
    };

    const handleFilterChange = (newFilters) => {
        dispatch(setFilters(newFilters));
        dispatch(setPage(1)); // Сбрасываем на первую страницу при изменении фильтров
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            dispatch(setPage(newPage));
        }
    };

    const handleResetFilters = () => {
        dispatch(resetFilters());
        dispatch(setPage(1));
    };

    let content;

    if (status === 'loading') {
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
        <div>
            <Header />
            <main>
                <h1>Самые лучшие рецепты здесь</h1>

                <div className="main-browse">
                    <input
                        type="text"
                        placeholder="Найти самые лучшие рецепты"
                        onChange={(e) => handleSearch(e.target.value)}
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

                {content}
            </main>
        </div>
    );
};

export default AllRecipe;