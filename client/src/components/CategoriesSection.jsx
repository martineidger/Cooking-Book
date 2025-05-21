// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Card, Tag, Skeleton, Button } from 'antd';
// import Masonry from 'react-masonry-css';
// import RecipeCard from './RecipeCard';
// import { fetchSubscriptionsRecipes } from '../store/slices/subscriptionsSlice';
// import { fetchCategoryDetails, getUserSubscribedCategories } from '../store/slices/categoriesSlice';

// const { Meta } = Card;

// const CategoriesSection = () => {
//     const dispatch = useDispatch();
//     const [selectedCategory, setSelectedCategory] = useState(null);

//     // Получаем данные из хранилища
//     const categories = useSelector(state => state.categories.followedCategories);
//     const recipes = useSelector(state =>
//         selectedCategory
//             ? state.categories.recipes
//             : state.subscriptions.recipes
//     );
//     const loadingCategories = useSelector(state => state.categories.loading);
//     const loadingRecipes = useSelector(state => state.recipes.loading);
//     const error = useSelector(state => state.recipes.error);

//     // useEffect(() =>{
//     //     dispatch(getUserSubscribedCategories())

//     // }, [])
//     // Загружаем рецепты при монтировании и изменении выбранной категории
//     useEffect(() => {
//         if (selectedCategory) {
//             dispatch(fetchCategoryDetails(selectedCategory.id));
//         } else {
//             dispatch(getUserSubscribedCategories())
//             dispatch(fetchSubscriptionsRecipes());
//         }
//     }, [selectedCategory, dispatch]);

//     // Настройки Masonry
//     const breakpointColumnsObj = {
//         default: 4,
//         1100: 3,
//         700: 2,
//         500: 1,
//     };

//     return (
//         <section className="categories-section">
//             <div className="categories-header">
//                 <h2>Любимые категории</h2>

//                 {/* Горизонтальный скролл категорий */}
//                 <div className="categories-scroll-container">
//                     {loadingCategories ? (
//                         <div className="categories-loading">
//                             {[1, 2, 3, 4, 5].map(i => (
//                                 <Skeleton.Button active key={i} style={{ width: 120, marginRight: 15 }} />
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="categories-list">
//                             {/* Кнопка "Все категории" */}
//                             <div
//                                 className={`category-card ${!selectedCategory ? 'active' : ''}`}
//                                 onClick={() => setSelectedCategory(null)}
//                             >
//                                 <Card
//                                     hoverable
//                                     style={{ width: 140 }}
//                                     cover={
//                                         <div className="category-image" style={{
//                                             backgroundColor: '#f0f2f5',
//                                             height: 100,
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             justifyContent: 'center'
//                                         }}>
//                                             <span style={{ fontSize: 24 }}>🍽️</span>
//                                         </div>
//                                     }
//                                 >
//                                     <Meta
//                                         title="Все категории"
//                                         description={
//                                             <Tag color="#87d068">Все рецепты</Tag>
//                                         }
//                                     />
//                                 </Card>
//                             </div>

//                             {/* Список категорий */}
//                             {console.log(categories)}
//                             {categories.map(category => (
//                                 <div
//                                     key={category.id}
//                                     className={`category-card ${selectedCategory?.id === category.id ? 'active' : ''}`}
//                                     onClick={() => setSelectedCategory(category.category)}
//                                 >
//                                     <Card
//                                         hoverable
//                                         style={{ width: 140 }}
//                                         cover={
//                                             <div className="category-image" style={{
//                                                 backgroundImage: `url(${category.imageUrl})`,
//                                                 height: 100,
//                                                 backgroundSize: 'cover',
//                                                 backgroundPosition: 'center'
//                                             }} />
//                                         }
//                                     >
//                                         <Meta
//                                             title={category.category.name}

//                                             description={
//                                                 <Tag color="#f50">
//                                                     {category.category.recipes.length} рецептов
//                                                 </Tag>
//                                             }
//                                         />
//                                     </Card>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Список рецептов */}
//             <div className="category-recipes">
//                 <h3>
//                     {selectedCategory
//                         ? `Рецепты в категории "${selectedCategory.name}"`
//                         : 'Все рецепты ваших категорий'}
//                 </h3>

//                 {loadingRecipes && <div className="loading">Загрузка рецептов...</div>}

//                 {error && <div className="error">{error}</div>}

//                 {!loadingRecipes && !error && (
//                     <>
//                         {recipes.length === 0 ? (
//                             <div className="empty-state">
//                                 Нет рецептов для отображения
//                             </div>
//                         ) : (
//                             <Masonry
//                                 breakpointCols={breakpointColumnsObj}
//                                 className="my-masonry-grid"
//                                 columnClassName="my-masonry-grid_column"
//                             >
//                                 {recipes.map(recipe => (
//                                     <RecipeCard
//                                         key={recipe.id}
//                                         recipe={recipe}
//                                     />
//                                 ))}
//                             </Masonry>
//                         )}
//                     </>
//                 )}
//             </div>

//             <style jsx>{`
//                 .categories-section {
//                     margin: 20px 0 40px;
//                 }

//                 .categories-header {
//                     margin-bottom: 30px;
//                 }

//                 .categories-scroll-container {
//                     width: 100%;
//                     overflow-x: auto;
//                     padding: 10px 0 20px;
//                 }

//                 .categories-loading {
//                     display: flex;
//                     gap: 15px;
//                     padding: 10px 5px;
//                 }

//                 .categories-list {
//                     display: flex;
//                     gap: 15px;
//                     padding: 10px 5px;
//                 }

//                 .category-card {
//                     flex: 0 0 auto;
//                     transition: transform 0.2s;
//                     cursor: pointer;
//                 }

//                 .category-card:hover {
//                     transform: translateY(-5px);
//                 }

//                 .category-card.active {
//                     border: 2px solid #1890ff;
//                     border-radius: 8px;
//                 }

//                 .category-recipes {
//                     margin-top: 30px;
//                 }

//                 .empty-state {
//                     text-align: center;
//                     padding: 40px;
//                     color: rgba(0, 0, 0, 0.45);
//                     font-size: 16px;
//                 }

//                 .loading, .error {
//                     text-align: center;
//                     padding: 20px;
//                 }
//             `}</style>
//         </section>
//     );
// };

// export default CategoriesSection;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Tag, Skeleton, Button } from 'antd';
import Masonry from 'react-masonry-css';
import RecipeCard from './RecipeCard';
import { fetchSubscriptionsRecipes } from '../store/slices/subscriptionsSlice';
import { fetchCategoryDetails, getUserSubscribedCategories } from '../store/slices/categoriesSlice';

const { Meta } = Card;

const CategoriesSection = () => {
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Получаем данные из хранилища
    const categories = useSelector(state => state.categories.followedCategories);
    const recipes = useSelector(state =>
        selectedCategory
            ? state.categories.recipes
            : state.subscriptions.recipes
    );
    const loadingCategories = useSelector(state => state.categories.loading);
    const loadingRecipes = useSelector(state => state.recipes.loading);
    const error = useSelector(state => state.recipes.error);

    useEffect(() => {
        if (selectedCategory) {
            dispatch(fetchCategoryDetails(selectedCategory.id));
        } else {
            dispatch(getUserSubscribedCategories())
            dispatch(fetchSubscriptionsRecipes());
        }
    }, [selectedCategory, dispatch]);

    // Настройки Masonry
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    return (
        <section className="categories-section">
            <div className="categories-header">
                <h2>Любимые категории</h2>

                {/* Горизонтальный скролл категорий */}
                <div className="categories-scroll-container">
                    {loadingCategories ? (
                        <div className="categories-loading">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Skeleton.Button active key={i} style={{ width: 120, marginRight: 15 }} />
                            ))}
                        </div>
                    ) : (
                        <div className="categories-list">
                            {/* Кнопка "Все категории" */}
                            <div
                                className={`category-card ${!selectedCategory ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(null)}
                            >
                                <Card
                                    hoverable
                                    style={{
                                        width: 140,
                                        borderRadius: 4,
                                        boxShadow: 'none',
                                        border: '1px solid #f0f0f0'
                                    }}
                                >
                                    <Meta
                                        title="Все категории"
                                        description={
                                            <Tag color="#f0ff18">Все рецепты</Tag>
                                        }
                                        style={{ padding: 0 }}
                                    />
                                </Card>
                            </div>

                            {/* Список категорий */}
                            {categories.map(category => (
                                <div
                                    key={category.id}
                                    className={`category-card ${selectedCategory?.id === category.id ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category.category)}
                                >
                                    <Card
                                        hoverable
                                        style={{
                                            width: 140,
                                            borderRadius: 4,
                                            boxShadow: 'none',
                                            border: '1px solid #f0f0f0'
                                        }}
                                    >
                                        <Meta
                                            title={category.category.name}
                                            description={
                                                <Tag color="#d7a4b2 ">
                                                    {category.category.recipes.length} рецептов
                                                </Tag>
                                            }
                                            style={{ padding: 0 }}
                                        />
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Список рецептов */}
            <div className="category-recipes">
                <h3>
                    {selectedCategory
                        ? `Рецепты в категории "${selectedCategory.name}"`
                        : 'Все рецепты ваших категорий'}
                </h3>

                {loadingRecipes && <div className="loading">Загрузка рецептов...</div>}

                {error && <div className="error">{error}</div>}

                {!loadingRecipes && !error && (
                    <>
                        {recipes.length === 0 ? (
                            <div className="empty-state">
                                Нет рецептов для отображения
                            </div>
                        ) : (
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column"
                            >
                                {recipes.map(recipe => (
                                    <RecipeCard
                                        key={recipe.id}
                                        recipe={recipe}
                                        flat
                                    />
                                ))}
                            </Masonry>
                        )}
                    </>
                )}
            </div>


            <style jsx>{`
    .categories-section {
        margin: 20px 0 40px;
    }
    
    .categories-header {
        margin-bottom: 30px;
    }
    
    .categories-scroll-container {
        width: 100%;
        overflow-x: auto;
        padding: 10px 0 20px;
    }
    
    .categories-loading {
        display: flex;
        gap: 15px;
        padding: 10px 5px;
    }
    
    .categories-list {
        display: flex;
        gap: 15px;
        padding: 10px 5px;
    }
    
    .category-card {
        flex: 0 0 auto;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .category-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .category-card.active :global(.ant-card) {
        border-color: rgb(0, 87, 168) !important;
    }
    
    .category-recipes {
        margin-top: 30px;
    }
    
    .empty-state {
        text-align: center;
        padding: 40px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
    }
    
    .loading, .error {
        text-align: center;
        padding: 20px;
    }

    :global(.ant-card) {
        box-shadow: none !important;
        transition: all 0.2s ease !important;
    }

    :global(.ant-card-hoverable:hover) {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }
`}</style>
        </section>
    );
};

export default CategoriesSection;