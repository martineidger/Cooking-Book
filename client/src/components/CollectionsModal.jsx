import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    addRecipeToCollections,
    addCollection,
    createNewCollection,
    fetchCollectionByRecipeId,
    fetchUserCollections,
    removeRecipeFromUserCollection,
} from '../store/slices/collectionsSlice';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const CollectionsModal = ({ recipeId, onClose, onSave, onSelect, title, currCollectionId }) => {

    const titleModal = title || "Добавить в коллекции";

    const dispatch = useDispatch();
    const allCollections = useSelector(state => state.collections.collections);
    const [collectionsWithRecipe, setCollectionsWithRecipe] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [showNewCollectionInput, setShowNewCollectionInput] = useState(false);

    const [initialCollections, setInitialCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                await dispatch(fetchUserCollections());

                const result = await dispatch(fetchCollectionByRecipeId(recipeId));
                setCollectionsWithRecipe(result.payload.map(c => c.id));
                setSelectedCollections(result.payload.map(c => c.id), currCollectionId);

            } finally {
                setLoading(false);
            }
        };

        if (currCollectionId) {
            setCollectionsWithRecipe([currCollectionId]);
            setSelectedCollections([currCollectionId]);
            setLoading(false);
        }
        else {
            loadData();
        }



    }, [recipeId, dispatch]);

    const handleToggleCollection = (collectionId) => {
        // if (onSelect) {
        //     onSelect(collectionId);
        // }

        setSelectedCollections(prev => {
            const currentIndex = prev.indexOf(collectionId);
            const newSelected = [...prev];

            if (currentIndex === -1) {
                newSelected.push(collectionId);
            } else {
                newSelected.splice(currentIndex, 1);
            }

            return newSelected;
        });
    };


    const handleAddToCollections = async () => {
        if (onSave) {
            onSave(selectedCollections)
            return
        }
        const removedFrom = collectionsWithRecipe.filter(
            id => !selectedCollections.includes(id)
        );

        // Добавляем в коллекции, где галочку поставили
        const addedTo = selectedCollections.filter(
            id => !collectionsWithRecipe.includes(id)
        );

        await Promise.all([
            ...(removedFrom.length > 0 ? [
                dispatch(removeRecipeFromUserCollection({
                    recipeId,
                    collectionIds: removedFrom
                }))
            ] : []),
            ...(addedTo.length > 0 ? [
                dispatch(addRecipeToCollections({
                    recipeId,
                    collectionIds: addedTo
                }))
            ] : [])
        ]);

        onClose();
    };

    // const handleCreateNewCollection = () => {
    //     if (newCollectionName.trim()) {
    //         const newCollection = {
    //             name: newCollectionName,
    //             recipes: [],
    //             isPublic: false,
    //         };
    //         console.log("NEW COLLECTION ")
    //         //dispatch(addCollection(newCollection));
    //         dispatch(createNewCollection(newCollection))
    //         setNewCollectionName('');
    //         setShowNewCollectionInput(false);
    //     }
    // };
    const handleCreateNewCollection = async () => {
        if (!newCollectionName.trim()) return;

        const result = await dispatch(createNewCollection({
            name: newCollectionName,
            isPublic: false
        }));

        if (result.payload?.id) {
            // Автоматически выбираем новую коллекцию
            // setSelectedCollections(prev => [...prev, result.payload.id]);
            // setCollectionsWithRecipe(prev => [...prev, result.payload.id]);
        }

        setNewCollectionName('');
        setShowNewCollectionInput(false);
    };

    if (loading) {
        return (
            <Modal open onClose={onClose}>
                <Box sx={modalStyle}>
                    <Typography>Загрузка...</Typography>
                </Box>
            </Modal>
        );
    }

    return (
        // <Modal open onClose={onClose}>
        //     {/* <Box sx={modalStyle}>
        //         <Typography variant="h6" gutterBottom>
        //             Добавить в коллекцию
        //         </Typography>

        //         <List sx={{ maxHeight: 300, overflow: 'auto' }}>
        //             {collections.map((collection) => (
        //                 <ListItem key={collection.id} disablePadding>
        //                     <ListItemButton onClick={() => handleToggleCollection(collection.id)}>
        //                         <ListItemIcon>
        //                             <Checkbox
        //                                 edge="start"
        //                                 checked={selectedCollections.includes(collection.id)}
        //                                 tabIndex={-1}
        //                                 disableRipple
        //                             />
        //                         </ListItemIcon>
        //                         <ListItemText primary={collection.name} />
        //                     </ListItemButton>
        //                 </ListItem>
        //             ))}
        //         </List> */}
        //     <Box sx={modalStyle}>
        //         <Typography variant="h6" gutterBottom>
        //             Управление коллекциями
        //         </Typography>

        //         <List sx={{ maxHeight: 300, overflow: 'auto' }}>
        //             {collections.map((collection) => (
        //                 <ListItem key={collection.id} disablePadding>
        //                     <ListItemButton onClick={() => handleToggleCollection(collection.id)}>
        //                         <ListItemIcon>
        //                             <Checkbox
        //                                 edge="start"
        //                                 checked={selectedCollections.includes(collection.id)}
        //                                 tabIndex={-1}
        //                                 disableRipple
        //                             />
        //                         </ListItemIcon>
        //                         <ListItemText
        //                             primary={collection.name}
        //                             secondary={initialCollections.includes(collection.id) ? "Рецепт уже в коллекции" : ""}
        //                         />
        //                     </ListItemButton>
        //                 </ListItem>
        //             ))}
        //         </List>

        //         {showNewCollectionInput ? (
        //             <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        //                 <TextField
        //                     fullWidth
        //                     size="small"
        //                     value={newCollectionName}
        //                     onChange={(e) => setNewCollectionName(e.target.value)}
        //                     placeholder="Название коллекции"
        //                 />
        //                 <Button
        //                     variant="contained"
        //                     onClick={handleCreateNewCollection}
        //                     disabled={!newCollectionName.trim()}
        //                 >
        //                     Создать
        //                 </Button>
        //             </Box>
        //         ) : (
        //             <Button
        //                 startIcon={<AddIcon />}
        //                 onClick={() => setShowNewCollectionInput(true)}
        //                 sx={{ mt: 2 }}
        //             >
        //                 Новая коллекция
        //             </Button>
        //         )}

        //         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        //             <Button onClick={onClose} sx={{ mr: 2 }}>
        //                 Отмена
        //             </Button>
        //             <Button
        //                 variant="contained"
        //                 onClick={handleAddToCollections}
        //                 disabled={selectedCollections.length === 0}
        //             >
        //                 Добавить
        //             </Button>
        //         </Box>
        //     </Box>
        // </Modal>
        <Modal open onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" gutterBottom>
                    {titleModal}
                </Typography>

                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {allCollections.map((collection) => (
                        <ListItem key={collection.id} disablePadding>
                            <ListItemButton
                                onClick={() => handleToggleCollection(collection.id)}
                                dense
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={selectedCollections.includes(collection.id)}
                                        indeterminate={
                                            collectionsWithRecipe.includes(collection.id) &&
                                            !selectedCollections.includes(collection.id)
                                        }
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={collection.name}
                                    secondary={
                                        collectionsWithRecipe.includes(collection.id)
                                            ? "Рецепт уже здесь"
                                            : ""
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                {showNewCollectionInput ? (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            value={newCollectionName}
                            onChange={(e) => setNewCollectionName(e.target.value)}
                            placeholder="Название новой коллекции"
                            autoFocus
                        />
                        <Button
                            variant="contained"
                            onClick={handleCreateNewCollection}
                            disabled={!newCollectionName.trim()}
                        >
                            Создать
                        </Button>
                    </Box>
                ) : (
                    <Button
                        startIcon={<AddIcon />}
                        onClick={() => setShowNewCollectionInput(true)}
                        sx={{ mt: 2 }}
                    >
                        Создать новую коллекцию
                    </Button>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button onClick={onClose} sx={{ mr: 2 }}>
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAddToCollections}
                        disabled={
                            JSON.stringify(selectedCollections.sort()) ===
                            JSON.stringify(collectionsWithRecipe.sort())
                        }
                    >
                        Сохранить изменения
                    </Button>

                </Box>
                {currCollectionId && (<span>* некоторые из выбранных рецептов уже могут находится в целевых коллекциях</span>)}

            </Box>
        </Modal>
    );
};

export default CollectionsModal;