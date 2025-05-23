// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//     removeRecipeFromCollection,
//     moveRecipesBetweenCollections,
//     copyRecipesBetweenCollections,
//     fetchRecipesFromCollection,
//     fetchUserCollections,
//     copyRecipes,
//     moveRecipes,
//     fetchFavorites,
//     removeFromFavorites,
//     removeFromUserFavorites,
//     removeRecipeFromUserCollection,
// } from '../store/slices/collectionsSlice';
// import Grid from '@mui/material/Grid';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Checkbox from '@mui/material/Checkbox';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
// import CollectionsModal from '../components/CollectionsModal';
// import EditCollectionModal from '../components/EditCollectionModal';
// import { Box } from '@mui/material';
// import Header from '../components/Header';

// const CollectionDetailPage = () => {
//     const { collectionId } = useParams();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const collections = useSelector(state => state.collections.collections);
//     const favorites = useSelector(state => state.collections.favorites);
//     const [recipes, setRecipes] = useState([]); // Добавляем состояние для рецептов
//     const [loading, setLoading] = useState(true);
//     const userId = localStorage.getItem('userId');

//     const isFavorites = collectionId === 'favorites';
//     console.log("ID", collectionId)


//     console.log(collections)

//     useEffect(() => {
//         const loadRecipes = async () => {
//             try {
//                 setLoading(true);
//                 let result;

//                 if (isFavorites)
//                     result = await dispatch(fetchFavorites());
//                 else {
//                     result = await dispatch(fetchRecipesFromCollection(collectionId));

//                     // console.log('RESULT', result.payload.map(collection => collection.collection.userId))
//                     // ownerId = result.payload.map(collection => collection.collection.userId)[0];

//                     dispatch(fetchUserCollections(userId))
//                 }

//                 setRecipes(result.payload); // Сохраняем полученные рецепты в состоянии
//             } catch (error) {
//                 console.error('Ошибка загрузки рецептов:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadRecipes();
//         console.log(recipes)
//     }, [collectionId, dispatch]);

//     const [selectedRecipes, setSelectedRecipes] = useState([]);
//     const [showMoveModal, setShowMoveModal] = useState(false);
//     const [showCopyModal, setShowCopyModal] = useState(false);
//     const [editModalOpen, setEditModalOpen] = useState(false);


//     const collection = isFavorites
//         ? { id: 'favorites', name: 'Избранное', recipes: favorites, isPublic: false }
//         : { id: collectionId, name: 'Коллекция', recipes: recipes, isPublic: false };

//     if (loading) {
//         return <Typography>Загрузка...</Typography>;
//     }

//     if (!collection) {
//         return <Typography>Коллекция не найдена</Typography>;
//     }


//     console.log(recipes)
//     let ownerId;
//     if (isFavorites) {
//         ownerId = userId;
//     } else {
//         ownerId = recipes[0].collection.userId;
//     }
//     const isUserOwner = ownerId === userId;
//     console.log("IS OWNER", ownerId, userId, isUserOwner)

//     const handleSelectRecipe = (recipeId) => {
//         const currentIndex = selectedRecipes.indexOf(recipeId);
//         const newSelected = [...selectedRecipes];

//         if (currentIndex === -1) {
//             newSelected.push(recipeId);
//         } else {
//             newSelected.splice(currentIndex, 1);
//         }

//         console.log("NEWSEL ", newSelected)
//         setSelectedRecipes(newSelected);
//     };

//     const handleDeleteSelected = () => {
//         if (isFavorites) {
//             dispatch(removeFromUserFavorites(selectedRecipes))
//             selectedRecipes.forEach(recipeId => {

//                 dispatch(removeFromFavorites(recipeId));
//             });
//         } else {
//             dispatch(removeRecipeFromUserCollection({ collectionId, selectedRecipes }))
//             selectedRecipes.forEach(recipeId => {

//                 dispatch(removeRecipeFromCollection({ collectionId, recipeId }));
//             });
//         }
//         setSelectedRecipes([]);
//     };

//     const handleMoveToCollection = (targetId) => {
//         if (isFavorites) {
//             // Из избранного можно только удалять
//             return;
//         }
//         dispatch(moveRecipes({
//             sourceCollectionId: collectionId,
//             targetCollectionId: targetId,
//             recipeIds: [...selectedRecipes],
//         }));
//         setSelectedRecipes([]);
//         setShowMoveModal(false);
//     };

//     const handleCopyToCollection = (targetId) => {
//         dispatch(copyRecipes({
//             sourceCollectionId: collectionId,
//             targetCollectionId: targetId,
//             recipeIds: [...selectedRecipes],
//         }));
//         setSelectedRecipes([]);
//         setShowCopyModal(false);
//     };

//     const title = isFavorites ? "Избранное" : collection.name;

//     return (
//         <div>
//             {/* <Header /> */}
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
//                 <Typography variant="h4">
//                     {title}
//                 </Typography>
//                 {!isFavorites && (

//                     <Button
//                         variant="outlined"
//                         onClick={() => setEditModalOpen(true)}
//                     >
//                         Редактировать коллекцию
//                     </Button>


//                 )}
//             </Box>
//             <EditCollectionModal
//                 collectionId={collectionId}
//                 open={editModalOpen}
//                 onClose={() => setEditModalOpen(false)}
//                 onSaveSuccess={() => {
//                     // Дополнительные действия после сохранения
//                     console.log('Коллекция успешно обновлена');
//                 }}
//             />
//             {selectedRecipes.length > 0 && (
//                 <Box sx={{
//                     position: 'sticky',
//                     top: 0,
//                     zIndex: 1,
//                     bgcolor: 'background.paper',
//                     p: 2,
//                     mb: 2,
//                     boxShadow: 1,
//                     display: 'flex',
//                     gap: 2
//                 }}>
//                     <Typography>Выбрано: {selectedRecipes.length}</Typography>
//                     {isUserOwner && (<Button
//                         variant="outlined"
//                         startIcon={<DeleteIcon />}
//                         onClick={handleDeleteSelected}
//                     >
//                         Удалить
//                     </Button>)}
//                     {!isFavorites && (
//                         <>
//                             {isUserOwner && (<Button
//                                 variant="outlined"
//                                 startIcon={<DriveFileMoveIcon />}
//                                 onClick={() => setShowMoveModal(true)}
//                             >
//                                 Переместить
//                             </Button>)}
//                             <Button
//                                 variant="outlined"
//                                 startIcon={<ContentCopyIcon />}
//                                 onClick={() => setShowCopyModal(true)}
//                             >
//                                 Копировать
//                             </Button>
//                         </>
//                     )}
//                 </Box>
//             )}

//             <Grid container spacing={3}>
//                 {/* {collection.recipes.map((id) => (
//                     <Grid item xs={12} sm={6} md={4} key={id}>
//                         <Card sx={{ position: 'relative' }}>
//                             <Checkbox
//                                 sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
//                                 checked={selectedRecipes.includes(id)}
//                                 onChange={() => handleSelectRecipe(id)}
//                             />
//                             <CardMedia
//                                 component="img"
//                                 height="140"
//                                 image={`/recipe-images/${id}.jpg`}
//                                 alt="Recipe image"
//                             />
//                             <CardContent>
//                                 <Typography gutterBottom variant="h5" component="div">
//                                     Название рецепта {id}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary">
//                                     Краткое описание рецепта...
//                                 </Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 ))} */}
//                 {collection.recipes.map((recipe) => (
//                     <Grid item xs={12} sm={6} md={4} key={recipe.id}>
//                         <Card sx={{ position: 'relative' }}>
//                             <Checkbox
//                                 checked={selectedRecipes.includes(recipe.recipeId)}
//                                 onChange={() => handleSelectRecipe(recipe.recipe.id)}
//                             />
//                             <CardMedia
//                                 image={recipe.imageUrl || 'img/default-img.jpg'}
//                                 alt={recipe.recipe.title}
//                             />
//                             <CardContent>
//                                 <Typography variant="h5">{recipe.recipe.title}</Typography>
//                                 <Typography>{recipe.recipe.description}</Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 ))}
//             </Grid>

//             {showMoveModal && (
//                 <CollectionsModal
//                     excludeCollectionId={collectionId}
//                     onClose={() => setShowMoveModal(false)}
//                     onSelect={handleMoveToCollection}
//                     title="Выберите коллекцию для перемещения"
//                 />
//             )}

//             {showCopyModal && (
//                 <CollectionsModal
//                     excludeCollectionId={collectionId}
//                     onClose={() => setShowCopyModal(false)}
//                     onSelect={handleCopyToCollection}
//                     title="Выберите коллекцию для копирования"
//                 />
//             )}
//         </div>
//     );
// };

// export default CollectionDetailPage;

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    removeRecipeFromCollection,
    moveRecipesBetweenCollections,
    copyRecipesBetweenCollections,
    fetchRecipesFromCollection,
    fetchUserCollections,
    copyRecipes,
    moveRecipes,
    fetchFavorites,
    removeFromFavorites,
    removeFromUserFavorites,
    removeRecipeFromUserCollection,
    fetchCollectionById,
    removeRecipesFromUserCollection,
} from '../store/slices/collectionsSlice';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import CollectionsModal from '../components/CollectionsModal';
import EditCollectionModal from '../components/EditCollectionModal';
import ClearIcon from '@mui/icons-material/Clear';
import { Alert, Box, Snackbar } from '@mui/material';

const CollectionDetailPage = () => {
    const { collectionId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const collections = useSelector(state => state.collections.collections);
    const favorites = useSelector(state => state.collections.favorites);
    //const [recipes, setRecipes] = useState([]); // Добавляем состояние для рецептов
    const curCollection = useSelector(state => state.collections.currentCollection)
    const recipes = useSelector(state => state.collections.recipesOnCollection);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        setError(null);
    };

    let collectionsToMove = []
    let collectionsToCopy = []

    const isFavorites = collectionId === 'favorites';
    console.log("ID", collectionId)


    console.log(collections)
    const loadRecipes = async () => {
        try {
            setLoading(true);
            let result;

            if (isFavorites)
                result = await dispatch(fetchFavorites());
            else {
                await dispatch(fetchCollectionById(collectionId))
                await dispatch(fetchRecipesFromCollection(collectionId));

                // console.log('RESULT', result.payload.map(collection => collection.collection.userId))
                // ownerId = result.payload.map(collection => collection.collection.userId)[0];
                await dispatch(fetchUserCollections(userId))
            }

            //setRecipes(result.payload); // Сохраняем полученные рецепты в состоянии
        } catch (error) {
            console.error('Ошибка загрузки рецептов:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // const loadRecipes = async () => {
        //     try {
        //         setLoading(true);
        //         let result;

        //         if (isFavorites)
        //             result = await dispatch(fetchFavorites());
        //         else {
        //             await dispatch(fetchCollectionById(collectionId))
        //             await dispatch(fetchRecipesFromCollection(collectionId));

        //             // console.log('RESULT', result.payload.map(collection => collection.collection.userId))
        //             // ownerId = result.payload.map(collection => collection.collection.userId)[0];

        //             await dispatch(fetchUserCollections(userId))
        //         }

        //         //setRecipes(result.payload); // Сохраняем полученные рецепты в состоянии
        //     } catch (error) {
        //         console.error('Ошибка загрузки рецептов:', error);
        //     } finally {
        //         setLoading(false);
        //     }



        loadRecipes();
        console.log(recipes)
    }, [collectionId, dispatch]);

    const [selectedRecipes, setSelectedRecipes] = useState([]);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);


    const collection = isFavorites
        ? { id: 'favorites', name: 'Избранное', recipes: favorites, isPublic: false }
        : curCollection;

    if (loading) {
        return <Typography>Загрузка...</Typography>;
    }

    if (!collection) {
        return <Typography>Коллекция не найдена</Typography>;
    }


    console.log(recipes)
    let ownerId;
    if (isFavorites) {
        ownerId = userId;
    } else {
        //ownerId = recipes[0].collection.userId;
        ownerId = collection.userId
    }
    const isUserOwner = ownerId === userId;
    console.log("IS OWNER", ownerId, userId, isUserOwner)

    const handleResetSelection = () => {
        setSelectedRecipes([]);
    };

    const handleSelectRecipe = (recipeId) => {
        const currentIndex = selectedRecipes.indexOf(recipeId);
        const newSelected = [...selectedRecipes];

        if (currentIndex === -1) {
            newSelected.push(recipeId);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        console.log("NEWSEL ", newSelected)
        setSelectedRecipes(newSelected);
    };

    const handleDeleteSelected = () => {
        const deleteRecipes = async () => {
            if (isFavorites) {
                await dispatch(removeFromUserFavorites(selectedRecipes))
                selectedRecipes.forEach(recipeId => {

                    dispatch(removeFromFavorites(recipeId));
                });
            } else {
                await dispatch(removeRecipesFromUserCollection({ collectionId, recipeIds: selectedRecipes }))
                // selectedRecipes.forEach(recipeId => {

                //     dispatch(removeRecipeFromCollection({ collectionId, recipeId }));
                // });

            }
        }
        deleteRecipes()
        setSelectedRecipes([]);
        loadRecipes();
        //window.location.reload();
    };

    const handleMoveToCollection = (targetId) => {

        collectionsToMove.push(targetId)
    };

    const saveCopyToCollection = (targetIds) => {

        //const targetIds = collectionsToCopy;
        console.log('save', selectedRecipes, targetIds)
        targetIds.length > 0 && targetIds.map(id => {
            let result = dispatch(copyRecipes({
                sourceCollectionId: collectionId,
                targetCollectionId: id,
                recipeIds: selectedRecipes,
            }));

            setError(result.message)
            setOpenSnackbar(true)

        })
        setSelectedRecipes([]);
        setShowCopyModal(false);
        collectionsToMove = []
    }

    const saveMoveToCollection = async (targetIds) => {

        const move = async () => {
            console.log('save', selectedRecipes, targetIds)
            targetIds.length > 0 && targetIds.map(id = async () => {
                let result = await dispatch(moveRecipes({
                    sourceCollectionId: collectionId,
                    targetCollectionId: id,
                    recipeIds: selectedRecipes,
                }));

                console.log(999, result)
                setError(result.message)
                setOpenSnackbar(true)
            })
        }
        move()

        setSelectedRecipes([]);
        setShowMoveModal(false);
        collectionsToCopy = []

        //recipes = recipes.filter(recipe => !selectedRecipes.includes(recipe.recipeId))
        loadRecipes();
        //window.location.reload();
    }



    const handleCopyToCollection = (targetId) => {
        // dispatch(copyRecipes({
        //     sourceCollectionId: collectionId,
        //     targetCollectionId: targetId,
        //     recipeIds: [...selectedRecipes],
        // }));
        // setSelectedRecipes([]);
        // setShowCopyModal(false);
        collectionsToCopy.push(targetId);
    };

    const title = isFavorites ? "Избранное" : collection.name;

    return (
        <div className="collection-detail-page">
            <button className="back-button" onClick={() => navigate(-1)}>
                &larr; Назад
            </button>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="info"
                    onClose={handleCloseSnackbar}
                    sx={{ width: '100%' }}
                >
                    {error || 'Успешно'}
                </Alert>
            </Snackbar>
            <Box className="page-header">
                <Typography variant="h4" className="page-title">
                    {title}
                </Typography>
                {isUserOwner && !isFavorites && (
                    <Button
                        className="edit-btn"
                        variant="outlined"
                        onClick={() => setEditModalOpen(true)}
                    >
                        Редактировать коллекцию
                    </Button>
                )}
            </Box>

            <EditCollectionModal
                collectionId={collectionId}
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSaveSuccess={() => {
                    console.log('Коллекция успешно обновлена');
                }}
            />

            {selectedRecipes.length > 0 && (
                <Box className="selection-toolbar">
                    <Typography className="selection-count">
                        Выбрано: {selectedRecipes.length}
                    </Typography>
                    <Button
                        className="action-btn"
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={handleResetSelection}
                    >
                        Сбросить
                    </Button>
                    {isUserOwner && (
                        <Button
                            className="action-btn"
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={handleDeleteSelected}
                        >
                            Удалить
                        </Button>
                    )}
                    {!isFavorites && (
                        <>
                            {isUserOwner && (
                                <Button
                                    className="action-btn"
                                    variant="outlined"
                                    startIcon={<DriveFileMoveIcon />}
                                    onClick={() => setShowMoveModal(true)}
                                >
                                    Переместить
                                </Button>
                            )}
                            <Button
                                className="action-btn"
                                variant="outlined"
                                startIcon={<ContentCopyIcon />}
                                onClick={() => setShowCopyModal(true)}
                            >
                                Копировать
                            </Button>
                        </>
                    )}
                </Box>
            )}

            <Grid container spacing={3} className="recipes-grid">
                {console.log(888, collection)}
                {collection.recipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                        <Card >
                            <Checkbox
                                checked={selectedRecipes.includes(recipe.recipe.id)}
                                onChange={() => handleSelectRecipe(recipe.recipe.id)}
                            />
                            <CardMedia
                                component="img"
                                height="200"
                                image={recipe.recipe.imageUrl || '/img/default-img.jpg'}
                                alt={recipe.recipe.title}
                            />
                            <CardContent onClick={() => navigate(`/recipes/${recipe.recipe.id}`)}>
                                <Typography gutterBottom variant="h5" component="div">
                                    {recipe.recipe.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {recipe.recipe.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {showMoveModal && (
                <CollectionsModal
                    currCollectionId={collectionId}
                    onClose={() => setShowMoveModal(false)}
                    onSave={saveMoveToCollection}
                    onSelect={handleMoveToCollection}
                    title="Выберите коллекцию для перемещения"
                />
            )}

            {showCopyModal && (
                <CollectionsModal
                    currCollectionId={collectionId}
                    onClose={() => setShowCopyModal(false)}
                    onSave={saveCopyToCollection}
                    onSelect={handleCopyToCollection}
                    title="Выберите коллекцию для копирования"
                />
            )}
        </div>
    );
};

export default CollectionDetailPage;