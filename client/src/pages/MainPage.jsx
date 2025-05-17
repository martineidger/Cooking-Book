// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import Masonry from 'react-masonry-css';
// import Header from '../components/Header';
// import RecipeCard from '../components/RecipeCard';
// import {
//     fetchRecipes,
//     fetchCategories,
//     fetchCuisines,
//     selectAllRecipes,
//     selectRecipesStatus,
//     selectCategories,
//     selectCuisines,
//     selectRecipesError,
//     selectPagination,
//     selectFilters,
//     setFilters,
//     resetFilters,
//     setPage
// } from '../store/slices/recipesSlice';
// import SearchByIngredientsCount from '../components/SearchByIngredientsCount';

// const AllRecipe = () => {
//     const dispatch = useDispatch();
//     const recipes = useSelector(selectAllRecipes);
//     const status = useSelector(selectRecipesStatus);
//     const error = useSelector(selectRecipesError);
//     const pagination = useSelector(selectPagination);
//     const filters = useSelector(selectFilters);
//     const categories = useSelector(selectCategories);
//     const cuisines = useSelector(selectCuisines);
//     const [loading, setLoading] = useState(false);

//     console.log('CUIS', cuisines)

//     const { page: currentPage, limit, total, totalPages } = pagination;

//     const breakpointColumnsObj = {
//         default: 4,
//         1100: 3,
//         700: 2,
//         500: 1,
//     };

//     useEffect(() => {
//         dispatch(fetchCategories());
//         dispatch(fetchCuisines());
//     }, [dispatch]);

//     useEffect(() => {
//         const loadRecipes = async () => {
//             setLoading(true);
//             try {
//                 await dispatch(fetchRecipes({
//                     page: currentPage,
//                     limit,
//                     ...filters
//                 })).unwrap();
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadRecipes();
//     }, [dispatch, currentPage, limit, filters]);

//     const handleSearch = (searchTerm) => {
//         dispatch(setFilters({ searchTerm, page: 1 }));
//     };

//     const handleFilterChange = (newFilters) => {
//         dispatch(setFilters({ ...newFilters, page: 1 }));
//     };

//     const handlePageChange = (newPage) => {
//         if (newPage >= 1 && newPage <= totalPages) {
//             dispatch(setPage(newPage));
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//         }
//     };

//     const handleResetFilters = () => {
//         dispatch(resetFilters());
//     };

//     const handleCategorySelect = (categoryId) => {
//         dispatch(setFilters({
//             category: filters.category === categoryId ? null : categoryId,
//             page: 1
//         }));
//     };

//     const handleCuisineSelect = (cuisineId) => {
//         dispatch(setFilters({
//             cuisine: filters.cuisine === cuisineId ? null : cuisineId,
//             page: 1
//         }));
//     };

//     const isCategoryActive = (categoryId) => filters.category === categoryId;
//     const isCuisineActive = (cuisineId) => filters.cuisine === cuisineId;

//     let content;

//     if (status === 'loading' || loading) {
//         content = <div className="loading">Загрузка рецептов...</div>;
//     } else if (status === 'failed') {
//         content = <div className="error">{error}</div>;
//     } else if (status === 'succeeded') {
//         content = (
//             <>
//                 <div className="card-wrapper">
//                     <Masonry
//                         breakpointCols={breakpointColumnsObj}
//                         className="my-masonry-grid"
//                         columnClassName="my-masonry-grid_column"
//                     >
//                         {console.log("RECIPES", recipes)}
//                         {recipes.map(({ recipe }, i) => (

//                             <RecipeCard key={recipe.id} recipe={recipe} ind={i} />
//                         ))}
//                     </Masonry>
//                 </div>

//                 {totalPages > 1 && (
//                     <div className="pagination">
//                         <button
//                             onClick={() => handlePageChange(currentPage - 1)}
//                             disabled={currentPage === 1}
//                         >
//                             Назад
//                         </button>
//                         <span>Страница {currentPage} из {totalPages}</span>
//                         <button
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             disabled={currentPage === totalPages}
//                         >
//                             Вперед
//                         </button>
//                     </div>
//                 )}
//             </>
//         );
//     }

//     return (
//         <div className="all-recipe-page">
//             <Header />
//             <main>
//                 <h1>Самые лучшие рецепты здесь</h1>

//                 {/* <SearchByIngredientsCount /> */}

//                 <div className="main-browse">
//                     <input
//                         type="text"
//                         placeholder="Найти самые лучшие рецепты"
//                         onChange={(e) => handleSearch(e.target.value)}
//                         value={filters.searchTerm || ''}
//                     />

//                     <div className="filters">
//                         <select
//                             value={filters.sortBy}
//                             onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
//                         >
//                             <option value="title">По названию</option>
//                             <option value="createdAt">По дате добавления</option>
//                         </select>

//                         <select
//                             value={filters.sortOrder}
//                             onChange={(e) => handleFilterChange({ sortOrder: e.target.value })}
//                         >
//                             <option value="asc">По возрастанию</option>
//                             <option value="desc">По убыванию</option>
//                         </select>

//                         <button onClick={handleResetFilters}>Сбросить фильтры</button>
//                     </div>
//                 </div>

//                 {/* Фильтры по категориям */}
//                 <div className="category-filters-section">
//                     <h3 className="filter-subtitle">Категории:</h3>
//                     <div className="category-chips-container">
//                         {categories.map(category => (
//                             <button
//                                 key={category.id}
//                                 className={`category-chip ${isCategoryActive(category.id) ? 'category-chip-active' : ''}`}
//                                 onClick={() => handleCategorySelect(category.id)}
//                             >
//                                 {category.name}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Фильтры по кухням */}
//                 <div className="cuisine-filters-section">
//                     <h3 className="filter-subtitle">Кухни:</h3>
//                     <div className="cuisine-chips-container">
//                         {cuisines.map(cuisine => (
//                             <button
//                                 key={cuisine.id}
//                                 className={`cuisine-chip ${isCuisineActive(cuisine.id) ? 'cuisine-chip-active' : ''}`}
//                                 onClick={() => handleCuisineSelect(cuisine.id)}
//                             >
//                                 {cuisine.name}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {content}
//             </main>
//         </div>
//     );
// };

// export default AllRecipe;

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
import { fetchSubscriptionsRecipes, fetchFollowedCategories } from '../store/slices/subscriptionsSlice';
import { fetchUserCollections } from '../store/slices/collectionsSlice';

const HomePage = () => {
    const dispatch = useDispatch();
    const recipes = useSelector(selectAllRecipes);
    const status = useSelector(selectRecipesStatus);
    const error = useSelector(selectRecipesError);
    const pagination = useSelector(selectPagination);
    const filters = useSelector(selectFilters);
    const categories = useSelector(selectCategories);
    const cuisines = useSelector(selectCuisines);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'subscriptions', 'collections', 'categories'
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
        dispatch(fetchUserCollections());
        dispatch(fetchFollowedCategories());
    }, [dispatch]);

    useEffect(() => {
        const loadRecipes = async () => {
            setLoading(true);
            try {
                if (activeTab === 'subscriptions') {
                    await dispatch(fetchSubscriptionsRecipes({
                        page: currentPage,
                        limit
                    })).unwrap();
                } else {
                    await dispatch(fetchRecipes({
                        page: currentPage,
                        limit,
                        ...filters
                    })).unwrap();
                }
            } finally {
                setLoading(false);
            }
        };

        loadRecipes();
    }, [dispatch, currentPage, limit, filters, activeTab]);

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
                        {console.log("RECIPES", recipes)}
                        {recipes.map(({ recipe }, i) => (

                            <RecipeCard key={recipe.id} recipe={recipe} ind={i} />
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
        <>

            <Header />
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
                        <button
                            className={`tab-button ${activeTab === 'subscriptions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('subscriptions')}
                        >
                            Мои подписки
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'collections' ? 'active' : ''}`}
                            onClick={() => setActiveTab('collections')}
                        >
                            Мои коллекции
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
                            onClick={() => setActiveTab('categories')}
                        >
                            Любимые категории
                        </button>
                    </div>

                    <section className="search-section">
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

                        <div className="quick-filters">
                            <div className="filter-group">
                                <label>Сортировка:</label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                                >
                                    <option value="title">По названию</option>
                                    <option value="createdAt">По дате</option>
                                    <option value="rating">По рейтингу</option>
                                    <option value="cookingTime">По времени</option>
                                </select>

                                <select
                                    value={filters.sortOrder}
                                    onChange={(e) => handleFilterChange({ sortOrder: e.target.value })}
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

                    <section className="filters-section">
                        <div className="filter-category">
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

                        <div className="filter-cuisine">
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
                    </section>

                    {activeTab === 'collections' && (
                        <section className="collections-preview">
                            <h2>Мои коллекции</h2>
                            {/* Здесь компонент для отображения коллекций */}
                        </section>
                    )}

                    {activeTab === 'categories' && (
                        <section className="followed-categories">
                            <h2>Любимые категории</h2>
                            {/* Здесь компонент для отображения избранных категорий */}
                        </section>
                    )}

                    <section className="recipes-grid">
                        {status === 'loading' || loading ? (
                            <div className="loading-spinner"></div>
                        ) : status === 'failed' ? (
                            <div className="error-message">{error}</div>
                        ) : (
                            <>
                                {activeTab === 'subscriptions' && (
                                    <h2>Рецепты авторов, на которых вы подписаны</h2>
                                )}

                                <Masonry
                                    breakpointCols={breakpointColumnsObj}
                                    className="masonry-grid"
                                    columnClassName="masonry-column"
                                >
                                    {recipes.map(({ recipe }, i) => (
                                        <RecipeCard
                                            key={recipe.id}
                                            recipe={recipe}
                                            showAuthor={activeTab !== 'subscriptions'}
                                        />
                                    ))}
                                </Masonry>

                                {totalPages > 1 && (
                                    <div className="pagination-controls">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            ← Назад
                                        </button>

                                        <div className="page-numbers">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    className={currentPage === page ? 'active' : ''}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Вперед →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </section>




                </main>

                <style jsx>{`
                .home-page {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }
                
                .hero-section {
                    text-align: center;
                    padding: 40px 0;
                    background: linear-gradient(to right, #ff9a9e, #fad0c4);
                    border-radius: 10px;
                    margin-bottom: 30px;
                    color: white;
                }
                
                .content-tabs {
                    display: flex;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #eee;
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
                
                .search-section {
                    margin-bottom: 30px;
                }
                
                .search-container {
                    display: flex;
                    margin-bottom: 15px;
                }
                
                .search-container input {
                    flex: 1;
                    padding: 12px 15px;
                    border: 1px solid #ddd;
                    border-radius: 25px 0 0 25px;
                    font-size: 16px;
                }
                
                .search-button {
                    padding: 0 20px;
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    border-radius: 0 25px 25px 0;
                    cursor: pointer;
                }
                
                .quick-filters {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .filter-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .filter-group select {
                    padding: 8px 12px;
                    border-radius: 5px;
                    border: 1px solid #ddd;
                }
                
                .reset-filters {
                    padding: 8px 15px;
                    background: #f8f9fa;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    cursor: pointer;
                }
                
                .filters-section {
                    margin-bottom: 30px;
                }
                
                .filter-category, .filter-cuisine {
                    margin-bottom: 20px;
                }
                
                .chips-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 10px;
                }
                
                .chip {
                    padding: 8px 15px;
                    background: #f8f9fa;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .chip.active {
                    background: #ff6b6b;
                    color: white;
                    border-color: #ff6b6b;
                }
                
                .recipes-grid {
                    margin-bottom: 50px;
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
                
                .pagination-controls {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    margin-top: 30px;
                }
                
                .pagination-controls button {
                    padding: 8px 15px;
                    border: 1px solid #ddd;
                    background: white;
                    cursor: pointer;
                    border-radius: 5px;
                }
                
                .pagination-controls button.active {
                    background: #ff6b6b;
                    color: white;
                    border-color: #ff6b6b;
                }
                
                .pagination-controls button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .page-numbers {
                    display: flex;
                    gap: 5px;
                }
                
                .popular-this-week, .new-authors {
                    margin-bottom: 50px;
                }
            `}</style>
            </div>
        </>
    );
};

export default HomePage;