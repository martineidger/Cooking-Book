// import axios from 'axios';
// import http from './http';

// const collectionsApi = {
//     getUserCollections: async (userId) => {
//         try {
//             const response = await http.get(`collection/${userId}`);
//             return response.data;
//         } catch {

//         }
//     },

//     getRecipesFromCollection: async (collectionId) => {
//         try {
//             const response = await http.get(`collection/${collectionId}/recipes`);
//             return response.data;
//         } catch {

//         }
//     }


// }

import axios from 'axios';
import http from './http';

const collectionsApi = {
    // Коллекции
    createCollection: async (createCollectionDto) => {
        try {
            const id = localStorage.getItem('userId')
            const response = await http.post('collection', { ...createCollectionDto, userId: id });
            return response.data;
        } catch (error) {
            console.error('Error creating collection:', error);
            throw error;
        }
    },

    fetchCollectionsByRecipeId: async (recipeId) => {
        try {
            const id = localStorage.getItem('userId')
            const response = await http.get(`collection/by-recipe/${recipeId}`);
            return response.data;
        } catch (error) {
            console.error('Error creating collection:', error);
            throw error;
        }
    },

    getCollectionById: async (collectionId) => {
        try {
            const response = await http.get(`collection?collectionId=${collectionId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting collection:', error);
            throw error;
        }
    },

    getUserCollections: async (userId) => {
        try {
            const response = await http.get(`collection/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting user collections:', error);
            throw error;
        }
    },

    updateCollection: async (id, updateCollectionDto) => {
        try {
            console.log("UPD API", id, updateCollectionDto)
            const response = await http.patch(`collection/update/${id}`, updateCollectionDto);
            return response.data;
        } catch (error) {
            console.error('Error updating collection:', error);
            throw error;
        }
    },

    deleteCollection: async (id) => {
        try {
            const response = await http.delete(`collection/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting collection:', error);
            throw error;
        }
    },

    // Работа с рецептами в коллекциях
    getRecipesFromCollection: async (collectionId) => {
        try {
            const response = await http.get(`collection/${collectionId}/recipes`);
            return response.data;
        } catch (error) {
            console.error('Error getting recipes from collection:', error);
            throw error;
        }
    },

    addRecipeToCollections: async (addRecipeDto) => {
        try {
            console.log("ADD API", addRecipeDto)
            const response = await http.post('collection/add-to-collections', addRecipeDto);
            return response.data;
        } catch (error) {
            console.error('Error adding recipe to collections:', error);
            throw error;
        }
    },

    removeRecipeFromCollection: async (removeDto) => {
        try {
            const response = await http.put('collection/remove-from-collection', removeDto);
            return response.data;
        } catch (error) {
            console.error('Error removing recipe from collection:', error);
            throw error;
        }
    },

    copyRecipesBetweenCollections: async (copyRecipesDto) => {
        try {
            console.log('9', copyRecipesDto)
            const response = await http.post('collection/copy', { ...copyRecipesDto, mode: "copy" });
            return response.data;
        } catch (error) {
            console.error('Error copying recipes:', error);
            throw error;
        }
    },

    moveRecipesBetweenCollections: async (moveRecipesDto) => {
        try {
            const response = await http.post('collection/move', { ...moveRecipesDto, mode: "move" });
            return response.data;
        } catch (error) {
            console.error('Error moving recipes:', error);
            throw error;
        }
    },

    // Избранное
    getFavorites: async (userId) => {
        try {
            const response = await http.get(`collection/fav/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting favorites:', error);
            throw error;
        }
    },

    addToFavorites: async (addRecipeDto) => {
        try {
            const response = await http.post('collection/add-to-fav', addRecipeDto);
            return response.data;
        } catch (error) {
            console.error('Error adding to favorites:', error);
            throw error;
        }
    },

    removeFromFavorites: async (removeDto) => {
        try {
            const response = await http.put('collection/remove-from-fav', removeDto);
            return response.data;
        } catch (error) {
            console.error('Error removing from favorites:', error);
            throw error;
        }
    },
};

export default collectionsApi;