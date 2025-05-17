// src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUserProfile, fetchUserCollections, fetchUserRecipes } from '../store/slices/profileSlice';
import { CollectionCard } from '../components/CollectionCard';
import { UserCard } from '../components/UserCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { RecipeInProfileCard } from '../components/RecipeInProfileCard';
import { followUser, unfollowUser, checkFollowStatus, getUserFollowers, getUserFollowings } from '../store/slices/followSlice';
import Header from '../components/Header';
import { Button } from '@mui/material';


const ProfilePage = () => {
    const { userId: profileId } = useParams();
    const dispatch = useDispatch();
    const { user: loggedUser } = useSelector(state => state.auth);
    const {
        profileUser,
        collections,
        recipes,
        isLoading,
        hasMoreCollections,
        hasMoreRecipes
    } = useSelector(state => state.profile);


    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            await dispatch(fetchUserProfile(profileId));
            await dispatch(fetchUserCollections({ userId: profileId, initialLoad: true }));
            await dispatch(fetchUserRecipes({ userId: profileId, initialLoad: true }));
            await dispatch(getUserFollowers(profileId))
            await dispatch(getUserFollowings(profileId))
        }

        if (profileId) {
            console.log('fetch', profileId)
            fetch()
        }
    }, [profileId, dispatch]);

    useEffect(() => {
        dispatch(getUserFollowers(profileId))
    }, [isFollowing, dispatch])

    const { followings } = useSelector(state => state.follow)



    useEffect(() => {
        if (profileId && loggedUser?.id && loggedUser.id !== profileId) {
            const checkFollow = async () => {
                setIsFollowLoading(true);
                try {
                    const response = await dispatch(checkFollowStatus({ followerId: loggedUser.id, followingId: profileId }));
                    console.log("CHECK", response)
                    setIsFollowing(response.payload);
                } catch (error) {
                    console.error('Ошибка проверки подписки:', error);
                } finally {
                    setIsFollowLoading(false);
                }
            };
            checkFollow();
        }

    }, [profileId, loggedUser?.id, dispatch]);

    const handleFollow = async () => {
        if (!profileId || !loggedUser?.id) return;

        setIsFollowLoading(true);
        try {

            if (isFollowing) {
                await dispatch(unfollowUser({ followerId: loggedUser.id, followingId: profileId }));
            } else {
                await dispatch(followUser({ followerId: loggedUser.id, followingId: profileId }));
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Ошибка подписки:', error);
        } finally {
            setIsFollowLoading(false);
        }
    };
    console.log('LOGGED USER', loggedUser)
    console.log('PROFILE USER', profileUser)
    console.log('PROFILE id', profileId)

    const [activeTab, setActiveTab] = useState('collections');


    const loadMoreCollections = () => {
        if (profileId && hasMoreCollections) {
            dispatch(fetchUserCollections({ userId: profileId }));
        }
    };

    const loadMoreRecipes = () => {
        if (profileId && hasMoreRecipes) {
            dispatch(fetchUserRecipes({ userId: profileId }));
        }
    };

    const isCurrentUserProfile = loggedUser?.id === profileId;


    return (
        <>
            <Header />

            <div className="profile-page">
                {/* Шапка профиля */}
                {/* <div className="profile-header">
                    <div className="profile-avatar">
                        {profileUser?.name?.charAt(0).toUpperCase() || profileUser?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h1>{profileUser?.username || profileUser?.email}</h1>
                        <p className="profile-bio">{profileUser?.bio || 'Пользователь пока не добавил информацию о себе'}</p>

                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-number">{profileUser?.stats.recipeCount || 0}</span>
                                <span className="stat-label">Рецептов</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{profileUser?.stats.publicCollectionsCount || 0}</span>
                                <span className="stat-label">Коллекций</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{profileUser?.stats.followersCount || 0}</span>
                                <span className="stat-label">Подписчиков</span>
                            </div>
                        </div>

                        {isCurrentUserProfile && (
                            <Link to="/settings" className="edit-profile-button">
                                Редактировать профиль
                            </Link>
                        )}
                    </div>
                </div> */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        {profileUser?.name?.charAt(0).toUpperCase() || profileUser?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h1>{profileUser?.username || profileUser?.email}</h1>
                        <p className="profile-bio">{profileUser?.bio || 'Пользователь пока не добавил информацию о себе'}</p>

                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-number">{profileUser?.stats?.recipeCount || 0}</span>
                                <span className="stat-label">Рецептов</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{profileUser?.stats?.publicCollectionsCount || 0}</span>
                                <span className="stat-label">Коллекций</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{profileUser?.stats?.followersCount || 0}</span>
                                <span className="stat-label">Подписчиков</span>
                            </div>
                        </div>

                        <div className="profile-actions">
                            {isCurrentUserProfile ? (
                                <Link to="/settings" className="edit-profile-button">
                                    <Button variant="contained" color="primary">
                                        Редактировать профиль
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    variant="contained"
                                    color={isFollowing ? 'secondary' : 'primary'}
                                    onClick={handleFollow}
                                    disabled={isFollowLoading}
                                >
                                    {isFollowing ? 'Отписаться' : 'Подписаться'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Подписки */}
                <div className="profile-section">
                    <h2>Подписки</h2>
                    {followings && followings.length > 0 ? (
                        <div className="subscriptions-grid">
                            {followings.map(user => (
                                <UserCard key={user.id} user={user.following} />
                            ))}
                        </div>
                    ) : (
                        <p className="empty-message">
                            {isCurrentUserProfile ? 'Вы пока ни на кого не подписаны' : 'Пользователь пока ни на кого не подписан'}
                        </p>
                    )}
                </div>

                {/* Табы для переключения между коллекциями и рецептами */}
                <div className="profile-tabs">
                    <button
                        className={`tab-button ${activeTab === 'collections' ? 'active' : ''}`}
                        onClick={() => setActiveTab('collections')}
                    >
                        Коллекции
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('recipes')}
                    >
                        Рецепты
                    </button>
                </div>

                {/* Список коллекций */}
                {activeTab === 'collections' && (
                    <div className="profile-section">
                        <InfiniteScroll
                            dataLength={collections.length}
                            next={loadMoreCollections}
                            hasMore={hasMoreCollections}
                            loader={<div className="loader">Загрузка...</div>}
                            endMessage={
                                <p className="end-message">
                                    {collections.length === 0
                                        ? 'Нет публичных коллекций'
                                        : 'Вы достигли конца списка'}
                                </p>
                            }
                        >
                            <div className="collections-grid">
                                {collections.map(collection => (
                                    <CollectionCard
                                        key={collection.id}
                                        collection={collection}
                                        showAuthor={false}
                                    />
                                ))}
                            </div>
                        </InfiniteScroll>
                    </div>
                )}

                {/* Список рецептов */}
                {activeTab === 'recipes' && (
                    <div className="profile-section">
                        <InfiniteScroll
                            dataLength={recipes.length}
                            next={loadMoreRecipes}
                            hasMore={hasMoreRecipes}
                            loader={<div className="loader">Загрузка...</div>}
                            endMessage={
                                <p className="end-message">
                                    {recipes.length === 0
                                        ? 'Нет созданных рецептов'
                                        : 'Вы достигли конца списка'}
                                </p>
                            }
                        >
                            <div className="recipes-list">
                                {recipes.map(recipe => (
                                    <RecipeInProfileCard
                                        key={recipe.id}
                                        recipe={recipe}
                                        showAuthor={false}
                                    />
                                ))}
                            </div>
                        </InfiniteScroll>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProfilePage;