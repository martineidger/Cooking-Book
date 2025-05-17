import React, { useEffect } from 'react';
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
import { ListItemIcon, Typography } from '@mui/material';
import { fetchUserCollections } from '../store/slices/collectionsSlice';
import Header from '../components/Header';

const CollectionsPage = () => {
    const collections = useSelector(state => state.collections.collections);
    const favorites = useSelector(state => state.collections.favorites);
    const dispatch = useDispatch();

    useEffect(() => {
        const id = localStorage.getItem('userId')
        dispatch(fetchUserCollections())
    }, []);

    console.log(collections)

    return (
        <div>
            <Header />
            <Typography variant="h4" gutterBottom>
                Мои коллекции
            </Typography>

            <List>
                <ListItem
                    button
                    component={Link}
                    to="/collections/favorites"
                    sx={{ backgroundColor: '#fff8e1' }}
                >
                    <ListItemIcon>
                        <FavoriteIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Избранное" secondary={`${favorites.length} рецептов`} />
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
                        // secondary={`${collection.recipes.length} рецептов`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" component={Link} to={`/collections/${collection.id}/edit`}>
                                <EditIcon />
                            </IconButton>
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