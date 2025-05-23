import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Masonry from 'react-masonry-css';
import RecipeCard from '../components/RecipeCard';
import { checkFollowing, fetchCategoryDetails, followCategory, unfollowCategory } from '../store/slices/categoriesSlice';
import { fetchCuisineDetails } from '../store/slices/cuisineSlice';
import Header from '../components/Header';

const CategoryCuisinePage = () => {

    const { type, id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('recipes');
    const [isFollowed, setFollowed] = useState(useSelector(state => state.categories.isFollowed))
    const { isAuthenticated, user } = useSelector(state => state.auth);


    // 2. Все useSelector должны быть в одном блоке
    const { recipes, details } = useSelector(state =>
        type === 'category' ? state.categories : state.cuisine
    );
    // const { isFollowed } = ;
    const pagination = useSelector(state => ({
        page: 1,
        totalPages: 1,
        total: 10
    }));

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    // 3. После хуков - остальная логика
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                if (type === 'category') {
                    await dispatch(fetchCategoryDetails(id));
                    await dispatch(checkFollowing(id));
                } else {
                    await dispatch(fetchCuisineDetails(id));
                }
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [dispatch, id, type]);

    const handleToggleFollow = () => {
        if (isFollowed) {
            dispatch(unfollowCategory(id));
            setFollowed(false)
        } else {
            dispatch(followCategory(id));
            setFollowed(true)
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (!details) return <div>Категория/кухня не найдена</div>;

    // const { type, id } = useParams(); // 'category' или 'cuisine'
    // const dispatch = useDispatch();
    // const [loading, setLoading] = useState(false);
    // const [activeTab, setActiveTab] = useState('recipes'); // 'recipes' или 'details'

    // useEffect(() => {
    //     const loadData = async () => {
    //         setLoading(true);
    //         try {
    //             if (type === 'category') {
    //                 await dispatch(fetchCategoryDetails(id));
    //                 await dispatch(checkFollowing(id))
    //             } else {
    //                 await dispatch(fetchCuisineDetails(id));
    //             }
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     loadData();
    // }, [dispatch, id, type]);

    // const { recipes, details } = type === 'category' ? useSelector(state => state.categories) : useSelector(state => state.cuisine);
    // const { isFollowed } = useSelector(state => state.categories);

    // const handleToggleFollow = () => {
    //     if (isFollowed) {
    //         dispatch(unfollowCategory(id)); // Отписаться
    //     } else {
    //         dispatch(followCategory(id)); // Подписаться
    //     }
    // };

    // if (loading) return <div>Загрузка...</div>;
    // if (!details) return <div>Категория/кухня не найдена</div>;

    // const breakpointColumnsObj = {
    //     default: 4,
    //     1100: 3,
    //     700: 2,
    //     500: 1,
    // };

    // const pagination = useSelector(state => ({
    //     page: 1,
    //     totalPages: 1,
    //     total: 10
    // }));

    console.log('IS FOLLOWED', isFollowed)
    const isAdmin = user && user.role === 'Admin'

    return (
        <>
            {/* <Header /> */}
            <div className="category-cuisine-page">
                <button className="back-button" onClick={() => navigate(-1)}>
                    &larr; Назад
                </button>
                <div className="hero-section" style={{
                    backgroundImage: `url(${details.imageUrl || '/img/img1.jpg'})`
                }}>
                    <div className="hero-overlay">
                        <h1>{details.name}</h1>
                        <p className="description">{details.description}</p>

                        {isAuthenticated && !isAdmin && type === 'category' && (
                            <button
                                onClick={handleToggleFollow}
                                style={{
                                    padding: '8px 16px',
                                    background: isFollowed ? '#ddd' : '#ff6b6b',
                                    color: isFollowed ? '#333' : 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                {isFollowed ? 'Отписаться' : 'Подписаться'}
                                {/* ({details.followersCount}) */}
                            </button>
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
                            Найдено рецептов: {details.recipesCount}
                        </div>

                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="masonry-grid"
                            columnClassName="masonry-column"
                        >
                            {recipes.map((recipe, index) => (
                                <RecipeCard recipe={recipe} key={index} />
                            ))}
                        </Masonry>

                        {pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                >
                                    Назад
                                </button>
                                <span>Страница {pagination.page} из {pagination.totalPages}</span>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
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
                            <p>Здесь будут похожие категории/кухни</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CategoryCuisinePage;