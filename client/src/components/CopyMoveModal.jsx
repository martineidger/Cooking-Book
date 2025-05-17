import React from 'react';
import { useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

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

const CollectionsModal = ({
    excludeCollectionId,
    onClose,
    onSelect,
    title = 'Выберите коллекцию'
}) => {
    const collections = useSelector(state => state.collections.collections)
        .filter(c => c.id !== excludeCollectionId);

    return (
        <Modal open onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>

                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {collections.map((collection) => (
                        <ListItem key={collection.id} disablePadding>
                            <ListItemButton onClick={() => onSelect(collection.id)}>
                                <ListItemText
                                    primary={collection.name}
                                    secondary={`${collection.recipes.length} рецептов`}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button onClick={onClose}>
                        Отмена
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CollectionsModal;