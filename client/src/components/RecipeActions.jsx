// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//     addToFavorites,
//     addToUserFavorites,
//     fetchFavorites,
//     removeFromFavorites,
//     removeFromUserFavorites,
// } from '../store/slices/collectionsSlice';
// import CollectionsModal from './CollectionsModal';
// import Button from '@mui/material/Button';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

// const RecipeActions = ({ recipeId }) => {
//     const dispatch = useDispatch();
//     const favorites = useSelector(state => state.collections.favorites);
//     const [showCollectionsModal, setShowCollectionsModal] = useState(false);

//     const isFavorite = favorites.includes(recipeId);

//     useEffect(() => {
//         dispatch(fetchFavorites())
//     }, [])

//     const handleFavoriteClick = () => {
//         if (isFavorite) {
//             dispatch(removeFromUserFavorites(recipeId));
//             dispatch(removeFromFavorites(recipeId))
//         } else {
//             dispatch(addToUserFavorites(recipeId));
//             dispatch(addToFavorites(recipeId))
//         }
//     };

//     return (
//         <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
//             <Button
//                 variant={isFavorite ? 'contained' : 'outlined'}
//                 startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
//                 onClick={handleFavoriteClick}
//             >
//                 {isFavorite ? 'В избранном' : 'В избранное'}
//             </Button>

//             <Button
//                 variant="outlined"
//                 startIcon={<PlaylistAddIcon />}
//                 onClick={() => setShowCollectionsModal(true)}
//             >
//                 В коллекцию
//             </Button>

//             {showCollectionsModal && (
//                 <CollectionsModal
//                     recipeId={recipeId}
//                     onClose={() => setShowCollectionsModal(false)}
//                 />
//             )}
//         </div>
//     );
// };

// export default RecipeActions;

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    addToUserFavorites,
    removeFromUserFavorites,
    fetchFavorites,
    removeFromFavorites
} from '../store/slices/collectionsSlice';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CollectionsModal from './CollectionsModal';

const RecipeActions = ({ recipeId }) => {
    const dispatch = useDispatch();
    const favorites = useSelector(state => state.collections.favorites);
    const [showCollectionsModal, setShowCollectionsModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        const func = async () => {
            await dispatch(fetchFavorites());
            setIsFavorite(favorites.some(item => item.recipeId === recipeId));
        }

        func()
    }, [dispatch]);


    const handleFavoriteClick = async () => {
        try {
            if (isFavorite) {
                dispatch(removeFromUserFavorites([recipeId]))
                dispatch(removeFromFavorites(recipeId));
                setIsFavorite(false)
            } else {
                await dispatch(addToUserFavorites(recipeId));
                setIsFavorite(true)
            }
            // Обновляем список избранного после изменения
            dispatch(fetchFavorites());
        } catch (error) {
            console.error('Ошибка при обновлении избранного:', error);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
            <Button
                variant={isFavorite ? 'contained' : 'outlined'}
                startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={handleFavoriteClick}
                color={isFavorite ? 'error' : 'primary'}
            >
                {isFavorite ? 'В избранном' : 'В избранное'}
            </Button>

            <Button
                variant="outlined"
                startIcon={<PlaylistAddIcon />}
                onClick={() => setShowCollectionsModal(true)}
            >
                В коллекцию
            </Button>

            {showCollectionsModal && (
                <CollectionsModal
                    recipeId={recipeId}
                    onClose={() => setShowCollectionsModal(false)}
                />
            )}
        </div>
    );
};

export default RecipeActions;