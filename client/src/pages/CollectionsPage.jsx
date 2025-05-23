// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
// import IconButton from '@mui/material/IconButton';
// import EditIcon from '@mui/icons-material/Edit';
// import PublicIcon from '@mui/icons-material/Public';
// import PublicOffIcon from '@mui/icons-material/PublicOff';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import { ListItemIcon, Typography } from '@mui/material';
// import { fetchUserCollections } from '../store/slices/collectionsSlice';
// import Header from '../components/Header';

// const CollectionsPage = () => {
//     const collections = useSelector(state => state.collections.collections);
//     const favorites = useSelector(state => state.collections.favorites);
//     const dispatch = useDispatch();

//     useEffect(() => {
//         const id = localStorage.getItem('userId')
//         dispatch(fetchUserCollections())
//     }, []);

//     console.log(collections)

//     return (
//         <div>
//             {/* <Header /> */}
//             <Typography variant="h4" gutterBottom>
//                 Мои коллекции
//             </Typography>

//             <List>
//                 <ListItem
//                     button
//                     component={Link}
//                     to="/collections/favorites"
//                     sx={{ backgroundColor: '#fff8e1' }}
//                 >
//                     <ListItemIcon>
//                         <FavoriteIcon color="error" />
//                     </ListItemIcon>
//                     <ListItemText primary="Избранное" secondary={`${favorites.length} рецептов`} />
//                 </ListItem>

//                 {collections.map((collection) => (

//                     <ListItem
//                         key={collection.id}
//                         button
//                         component={Link}
//                         to={`/collections/${collection.id}`}
//                     >
//                         <ListItemText
//                             primary={collection.name}
//                         // secondary={`${collection.recipes.length} рецептов`}
//                         />
//                         <ListItemSecondaryAction>
//                             <IconButton edge="end" component={Link} to={`/collections/${collection.id}/edit`}>
//                                 <EditIcon />
//                             </IconButton>
//                             {collection.isPublic ? (
//                                 <PublicIcon color="primary" sx={{ ml: 1 }} />
//                             ) : (
//                                 <PublicOffIcon color="action" sx={{ ml: 1 }} />
//                             )}
//                         </ListItemSecondaryAction>
//                     </ListItem>
//                 ))}
//             </List>
//         </div>
//     );
// };

// export default CollectionsPage;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
// import IconButton from '@mui/material/IconButton';
// import EditIcon from '@mui/icons-material/Edit';
// import PublicIcon from '@mui/icons-material/Public';
// import PublicOffIcon from '@mui/icons-material/PublicOff';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import { Button, ListItemIcon, Typography } from '@mui/material';
// import { fetchFavorites, fetchUserCollections } from '../store/slices/collectionsSlice';
// import EditCollectionModal from '../components/EditCollectionModal';

// const CollectionsPage = () => {
//     const collections = useSelector(state => state.collections.collections);
//     const favorites = useSelector(state => state.collections.favorites);
//     const dispatch = useDispatch();

//     const [selectedCollection, setSelectedCollection] = useState('')
//     const [editModalOpen, setEditModalOpen] = useState(false)

//     useEffect(() => {
//         const id = localStorage.getItem('userId')
//         dispatch(fetchUserCollections())
//         dispatch(fetchFavorites())
//     }, []);

//     return (
//         <div className="collections-page">
//             <EditCollectionModal
//                 collectionId={selectedCollection}
//                 open={editModalOpen}
//                 onClose={() => setEditModalOpen(false)}
//                 onSaveSuccess={() => {
//                     console.log('Коллекция успешно обновлена');
//                 }}
//             />
//             <Typography variant="h4" className="page-title" gutterBottom>
//                 Мои коллекции

//             </Typography>



//             <List className="collections-list">
//                 <ListItem
//                     button
//                     component={Link}
//                     to="/collections/favorites"
//                     className="favorites-item"
//                 >
//                     <ListItemIcon>
//                         <FavoriteIcon color="error" />
//                     </ListItemIcon>
//                     <ListItemText
//                         primary="Избранное"
//                         secondary={`${favorites.length} рецепта (-ов)`}
//                     />
//                 </ListItem>

//                 {console.log(332, collections)}
//                 {collections.map((collection) => (
//                     <ListItem
//                         key={collection.id}
//                         button
//                         component={Link}
//                         to={`/collections/${collection.id}`}
//                     >
//                         <ListItemText
//                             primary={collection.name}
//                             secondary={`${collection.RecipeOnCollection?.length || 0} рецепта (-ов)`}
//                         />
//                         <ListItemSecondaryAction>
//                             <Button
//                                 edge="end"

//                                 onClick={() => {
//                                     setSelectedCollection(collection.id)
//                                     setEditModalOpen(true)
//                                 }}

//                             >
//                                 <EditIcon />
//                             </Button>
//                             {collection.isPublic ? (
//                                 <PublicIcon color="primary" sx={{ ml: 1 }} />
//                             ) : (
//                                 <PublicOffIcon color="action" sx={{ ml: 1 }} />
//                             )}
//                         </ListItemSecondaryAction>
//                     </ListItem>
//                 ))}
//             </List>
//         </div>
//     );
// };

// export default CollectionsPage;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button, ListItemIcon, Typography, Divider, Box, Dialog, DialogTitle, DialogContent, TextField, FormControlLabel, Checkbox, DialogActions, Snackbar, Alert } from '@mui/material';
import { createNewCollection, fetchFavorites, fetchUserCollections } from '../store/slices/collectionsSlice';
import EditCollectionModal from '../components/EditCollectionModal';


const CreateCollectionModal = ({ open, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    const handleSubmit = () => {
        onCreate({ name, isPublic });
        setName('');
        setIsPublic(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Создать новую коллекцию</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Название коллекции"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                        }
                        label="Публичная коллекция"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    variant="contained"
                >
                    Создать
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const CollectionsPage = () => {
    const collections = useSelector(state => state.collections.collections);
    const favorites = useSelector(state => state.collections.favorites);
    const dispatch = useDispatch();

    const [selectedCollection, setSelectedCollection] = useState('')
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const existingCollectionNames = collections.map(c => c.name.toLowerCase());

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'error'
    });

    useEffect(() => {
        const id = localStorage.getItem('userId')
        dispatch(fetchUserCollections())
        dispatch(fetchFavorites())
    }, []);

    const handleCreateCollection = (collectionData) => {
        dispatch(createCollection(collectionData))
            .then(() => {
                dispatch(fetchUserCollections()); // Обновляем список после создания
            });
    };

    const handleCreateNewCollection = async ({ name, isPublic }) => {
        if (existingCollectionNames.includes(name.toLowerCase())) {
            setSnackbar({
                open: true,
                message: 'Коллекция с таким названием уже существует',
                severity: 'error'
            });
            return;
        }


        const result = await dispatch(createNewCollection({
            name: name,
            isPublic: isPublic
        }))
            .then(() => {
                dispatch(fetchUserCollections()); // Обновляем список после создания
            });;


    };

    return (
        <div className="collections-page">

            <CreateCollectionModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreate={handleCreateNewCollection}
            />
            <EditCollectionModal
                collectionId={selectedCollection}
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSaveSuccess={() => {
                    console.log('Коллекция успешно обновлена');
                }}
            />
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Заголовок с кнопкой */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }}>
                <Typography variant="h4" className="page-title">
                    Мои коллекции
                </Typography>
                <IconButton
                    onClick={() => {
                        setSelectedCollection('');
                        setCreateModalOpen(true);
                    }}
                    sx={{ fontSize: '2.5rem' }}
                >
                    +
                </IconButton>
            </Box>

            {/* Разделительная линия */}
            <Divider sx={{ mb: 2 }} />

            <List className="collections-list">
                <ListItem
                    button
                    component={Link}
                    to="/collections/favorites"
                    className="favorites-item"
                >
                    <ListItemIcon>
                        <FavoriteIcon color="error" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Избранное"
                        secondary={`${favorites.length} рецепта (-ов)`}
                    />
                </ListItem>

                {collections.map((collection) => (
                    <ListItem
                        key={collection.id}
                        button
                        component={Link}
                        to={`/collections/${collection.id}`}
                    >
                        <ListItemText
                            primary={collection.name}
                            secondary={`${collection.RecipeOnCollection?.length || 0} рецепта (-ов)`}
                        />
                        <ListItemSecondaryAction>
                            <Button
                                edge="end"
                                onClick={() => {
                                    setSelectedCollection(collection.id)
                                    setEditModalOpen(true)
                                }}
                            >
                                <EditIcon />
                            </Button>
                            {collection.isPublic ? (
                                <PublicIcon color="primary" sx={{ ml: 1 }} />
                            ) : (
                                <PublicOffIcon color="action" sx={{ ml: 1 }} />
                            )}
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default CollectionsPage;