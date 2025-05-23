import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Card } from 'antd';
import RecipeCard from './RecipeCard';
import Masonry from 'react-masonry-css';
import { fetchFollowwingsRecipes, getUserFollowings } from '../store/slices/followSlice';

const { Meta } = Card;

const SubscriptionsSection = () => {
    const { followings } = useSelector(state => state.follow);
    const subscriptionRecipes = useSelector(state => state.follow.recipes);
    const loading = useSelector(state => state.subscriptions.loading);
    const error = useSelector(state => state.subscriptions.error);
    const userId = localStorage.getItem('userId')

    const dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchFollowwingsRecipes(userId))
            await dispatch(getUserFollowings(userId))
        }
        if (userId) {
            fetchData()
            console.log('FOLLOWINGS COMP', followings)
        }

    }, [dispatch, userId])

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    return (
        <section className="subscriptions-section">

            <div className="subscriptions-header">
                <h2>Мои подписки</h2>

                {/* Горизонтальный скролл подписок */}
                <div className="subscriptions-scroll-container">
                    <div className="subscriptions-list">
                        {followings.map(sub => (
                            <div key={sub.id} className="subscription-card">
                                {console.log('sub', sub.following.recipes)}
                                <Card
                                    hoverable
                                    style={{ width: 120 }}
                                    cover={<Avatar size={80} src={sub.avatar} />}
                                >
                                    <Meta
                                        title={sub.following.username}
                                        description={`${sub.following.recipes.length} рецептов`}
                                    />
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Список рецептов от подписок */}
            <div className="subscription-recipes">
                <h3>Последние рецепты от ваших подписок</h3>

                {loading && <div className="loading">Загрузка...</div>}

                {error && <div className="error">{error}</div>}

                {!loading && !error && (
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {subscriptionRecipes.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                showAuthor={false}
                            />
                        ))}
                    </Masonry>
                )}
            </div>

            <style jsx>{`
                .subscriptions-section {
                    margin: 20px 0;
                }

                .subscriptions-header {
                    margin-bottom: 30px;
                }

                .subscriptions-scroll-container {
                    width: 100%;
                    overflow-x: auto;
                    padding: 10px 0;
                }

                .subscriptions-list {
                    display: flex;
                    gap: 15px;
                    padding: 10px 5px;
                }

                .subscription-card {
                    flex: 0 0 auto;
                }

                .subscription-recipes {
                    margin-top: 30px;
                }

                .loading, .error {
                    text-align: center;
                    padding: 20px;
                }
            `}</style>
        </section>
    );
};

export default SubscriptionsSection;

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Avatar, Card, Tag } from 'antd';
// import RecipeCard from './RecipeCard';
// import Masonry from 'react-masonry-css';
// import { fetchFollowwingsRecipes, getUserFollowings } from '../store/slices/followSlice';
// import { useNavigate } from 'react-router-dom';

// const { Meta } = Card;

// const SubscriptionsSection = () => {
//     const { followings } = useSelector(state => state.follow);
//     const subscriptionRecipes = useSelector(state => state.follow.recipes);
//     const loading = useSelector(state => state.subscriptions.loading);
//     const error = useSelector(state => state.subscriptions.error);
//     const userId = localStorage.getItem('userId');
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     useEffect(() => {
//         const fetchData = async () => {
//             await dispatch(fetchFollowwingsRecipes(userId));
//             await dispatch(getUserFollowings(userId));
//         }
//         if (userId) {
//             fetchData();
//         }
//     }, [dispatch, userId]);

//     const breakpointColumnsObj = {
//         default: 4,
//         1100: 3,
//         700: 2,
//         500: 1,
//     };

//     const handleUserClick = (userId) => {
//         //navigate(`/user/${userId}`);
//     };

//     return (
//         <section className="subscriptions-section">
//             <div className="subscriptions-header">
//                 <h2>Мои подписки</h2>

//                 {/* Горизонтальный скролл подписок */}
//                 <div className="subscriptions-scroll-container">
//                     <div className="subscriptions-list">
//                         {followings.map(sub => (
//                             <div
//                                 key={sub.id}
//                                 className="subscription-card"
//                                 onClick={() => handleUserClick(sub.following.id)}
//                             >
//                                 <Card
//                                     hoverable
//                                     style={{
//                                         width: 120,
//                                         height: 80,
//                                         borderRadius: 4,
//                                         cursor: 'pointer'
//                                     }}
//                                     bodyStyle={{ padding: '12px' }}
//                                 >
//                                     <Meta
//                                         title={<span style={{ fontSize: 14 }}>{sub.following.username}</span>}
//                                         description={
//                                             <Tag
//                                                 color="geekblue"
//                                                 style={{
//                                                     marginTop: 4,
//                                                     fontSize: 12
//                                                 }}
//                                             >
//                                                 {sub.following.recipes?.length || 0} рецептов
//                                             </Tag>
//                                         }
//                                     />
//                                 </Card>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Список рецептов от подписок */}
//             <div className="subscription-recipes">
//                 <h3>Последние рецепты от ваших подписок</h3>

//                 {loading && <div className="loading">Загрузка...</div>}

//                 {error && <div className="error">{error}</div>}

//                 {!loading && !error && (
//                     <Masonry
//                         breakpointCols={breakpointColumnsObj}
//                         className="my-masonry-grid"
//                         columnClassName="my-masonry-grid_column"
//                     >
//                         {subscriptionRecipes.map(recipe => (
//                             <RecipeCard
//                                 key={recipe.id}
//                                 recipe={recipe}
//                                 showAuthor={false}
//                             />
//                         ))}
//                     </Masonry>
//                 )}
//             </div>

//             <style jsx>{`
//                 .subscriptions-section {
//                     margin: 20px 0;
//                 }
                
//                 .subscriptions-header {
//                     margin-bottom: 30px;
//                 }
                
//                 .subscriptions-scroll-container {
//                     width: 100%;
//                     overflow-x: auto;
//                     padding: 10px 0;
//                 }
                
//                 .subscriptions-list {
//                     display: flex;
//                     gap: 12px;
//                     padding: 8px 5px;
//                 }
                
//                 .subscription-card {
//                     flex: 0 0 auto;
//                 }
                
//                 .subscription-card :global(.ant-card) {
//                     box-shadow: 0 1px 2px rgba(0,0,0,0.1);
//                     transition: all 0.2s;
//                 }
                
//                 .subscription-card :global(.ant-card:hover) {
//                     box-shadow: 0 2px 8px rgba(0,0,0,0.15);
//                     transform: translateY(-2px);
//                 }
                
//                 .subscription-recipes {
//                     margin-top: 30px;
//                 }
                
//                 .loading, .error {
//                     text-align: center;
//                     padding: 20px;
//                 }
//             `}</style>
//         </section>
//     );
// };

// export default SubscriptionsSection;