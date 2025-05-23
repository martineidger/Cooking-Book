import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import collectionsApi from '../../api/collectionsApi';
import { recipeApi } from '../../api/recipeApi';

const initialState = {
    collections: [],
    favorites: [],
    currentCollection: null,
    recipesOnCollection: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

export const fetchCollectionById = createAsyncThunk(
    'collections/fetchCollectionById',
    async (collectionId, { rejectWithValue }) => {
        try {
            const responce = await collectionsApi.getCollectionById(collectionId);
            console.log(9877, responce)
            return responce
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// Асинхронные операции
export const fetchUserCollections = createAsyncThunk(
    'collections/fetchUserCollections',
    async (_, { rejectWithValue }) => {
        try {
            const id = localStorage.getItem('userId')
            const responce = await collectionsApi.getUserCollections(id);
            console.log('FETCH COL', responce)
            return responce
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchCollectionByRecipeId = createAsyncThunk(
    'collections/fetchCollectionByRecipeId',
    async (recipeId, { rejectWithValue }) => {
        try {
            return await collectionsApi.fetchCollectionsByRecipeId(recipeId);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchRecipesFromCollection = createAsyncThunk(
    'collections/fetchRecipesFromCollection',
    async (collectionId, { rejectWithValue }) => {
        try {
            return await collectionsApi.getRecipesFromCollection(collectionId);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const fetchFavorites = createAsyncThunk(
    'collections/fetchFavorites',
    async (_, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem('userId')
            return await collectionsApi.getFavorites(userId);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createNewCollection = createAsyncThunk(
    'collections/createNewCollection',
    async (createCollectionDto, { rejectWithValue }) => {
        try {
            return await collectionsApi.createCollection(createCollectionDto);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateExistingCollection = createAsyncThunk(
    'collections/updateExistingCollection',
    async ({ id, updateCollectionDto }, { rejectWithValue }) => {
        try {
            console.log("UPD SLICE", id, updateCollectionDto)
            return await collectionsApi.updateCollection(id, updateCollectionDto);
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteUserCollection = createAsyncThunk(
    'collections/deleteUserCollection',
    async (collectionId, { rejectWithValue }) => {
        try {
            await collectionsApi.deleteCollection(collectionId);
            return collectionId;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addRecipeToCollections = createAsyncThunk(
    'collections/addRecipeToCollections',
    async (addRecipeDto, { rejectWithValue }) => {
        try {
            console.log("ADD SlICE", addRecipeDto)
            const id = localStorage.getItem('userId')
            return await collectionsApi.addRecipeToCollections({ recipeId: addRecipeDto.recipeId, collectionIds: addRecipeDto.collectionIds, userId: id });
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const removeRecipeFromUserCollection = createAsyncThunk(
    'collections/removeRecipeFromUserCollection',
    async (removeDto, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem('userId')
            await collectionsApi.removeRecipeFromCollection({
                userId: userId,
                collectionIds: removeDto.collectionIds,
                recipeId: removeDto.recipeId
            });
            return removeDto;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const removeRecipesFromUserCollection = createAsyncThunk(
    'collections/removeRecipesFromUserCollection',
    async (removeDto, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem('userId')
            console.log(987654, removeDto)
            await collectionsApi.removeRecipesFromCollection({
                userId: userId,
                collectionId: removeDto.collectionId,
                recipesIds: removeDto.recipeIds
            });
            return removeDto;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const moveRecipes = createAsyncThunk(
    'collections/moveRecipes',
    async (moveRecipesDto, { rejectWithValue }) => {
        try {
            const responce = await collectionsApi.moveRecipesBetweenCollections(moveRecipesDto);
            console.log(9988, responce)
            return { ...responce, ...moveRecipesDto }
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const copyRecipes = createAsyncThunk(
    'collections/copyRecipes',
    async (copyRecipesDto, { rejectWithValue }) => {
        try {
            console.log("COPY SLICE", copyRecipesDto)
            const responce = await collectionsApi.copyRecipesBetweenCollections(copyRecipesDto);
            return { ...responce, ...copyRecipesDto }
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const addToUserFavorites = createAsyncThunk(
    'collections/addToUserFavorites',
    async (addRecipeDto, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem('userId')
            console.log("ADD", addRecipeDto)
            return await collectionsApi.addToFavorites({
                userId: userId,
                recipesIds: [addRecipeDto],
            });
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const removeFromUserFavorites = createAsyncThunk(
    'collections/removeFromUserFavorites',
    async (removeDto, { rejectWithValue }) => {
        try {
            console.log("REMOVE", removeDto)
            const userId = localStorage.getItem('userId')
            await collectionsApi.removeFromFavorites({
                userId: userId,
                recipesIds: [...removeDto],
            });
            return removeDto.recipeId;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const collectionsSlice = createSlice({
    name: 'collections',
    initialState,
    reducers: {
        addToFavorites: (state, action) => {
            if (!state.favorites.includes(action.payload)) {
                state.favorites.push(action.payload);
            }
        },
        removeFromFavorites: (state, action) => {
            state.favorites = state.favorites.filter(id => id !== action.payload);
        },
        addCollection: (state, action) => {
            state.collections.push(action.payload);
        },
        updateCollection: (state, action) => {
            const index = state.collections.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.collections[index] = action.payload;
            }
        },
        deleteCollection: (state, action) => {
            state.collections = state.collections.filter(c => c.id !== action.payload);
        },
        addRecipeToCollection: (state, action) => {
            const { collectionId, recipeId } = action.payload;
            const collection = state.collections.find(c => c.id === collectionId);
            if (collection && !collection.recipes.includes(recipeId)) {
                collection.recipes.push(recipeId);
            }
        },
        removeRecipeFromCollection: (state, action) => {
            const { collectionId, recipeId } = action.payload;
            const collection = state.collections.find(c => c.id === collectionId);
            if (collection) {
                collection.recipes = collection.recipes.filter(id => id !== recipeId);
            }
        },
        moveRecipesBetweenCollections: (state, action) => {
            const { sourceId, targetId, recipeIds } = action.payload;
            const source = state.collections.find(c => c.id === sourceId);
            const target = state.collections.find(c => c.id === targetId);

            if (source && target) {
                // Remove from source
                source.recipes = source.recipes.filter(id => !recipeIds.includes(id));
                // Add to target (only if not already present)
                recipeIds.forEach(id => {
                    if (!target.recipes.includes(id)) {
                        target.recipes.push(id);
                    }
                });
            }
        },
        copyRecipesBetweenCollections: (state, action) => {
            const { targetId, recipeIds } = action.payload;
            const target = state.collections.find(c => c.id === targetId);

            if (target) {
                recipeIds.forEach(id => {
                    if (!target.recipes.includes(id)) {
                        target.recipes.push(id);
                    }
                });
            }
        },
        setCollections: (state, action) => {
            state.collections = action.payload;
        },
        setFavorites: (state, action) => {
            state.favorites = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Сначала все конкретные обработчики .addCase
            .addCase(fetchUserCollections.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.collections = action.payload;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.favorites = action.payload;
            })
            .addCase(createNewCollection.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.collections.push(action.payload);
            })
            .addCase(updateExistingCollection.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.collections.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.collections[index] = action.payload;
                }
            })
            .addCase(deleteUserCollection.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.collections = state.collections.filter(c => c.id !== action.payload);
            })
            .addCase(addRecipeToCollections.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { recipeId, collectionIds } = action.meta.arg;

            })
            .addCase(removeRecipeFromUserCollection.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { collectionId, recipeId } = action.meta.arg;
                const collection = state.collections.find(c => c.id === collectionId);
                if (collection) {
                    collection.recipes = collection.recipes.filter(id => id !== recipeId);
                }
            })
            .addCase(removeRecipesFromUserCollection.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { collectionId, recipeId } = action.meta.arg;
                const collection = state.collections.find(c => c.id === collectionId);
                if (collection) {
                    collection.recipes = collection.recipes.filter(id => id !== recipeId);
                }
            })
            .addCase(moveRecipes.fulfilled, (state, action) => {
                // console.log(55666, action.payload)
                // console.log(11223, state.recipesOnCollection)
                // state.recipesOnCollection.filter(recipe => !recipeIds.includes(recipe.recipeId));
                // const target = state.collections.find(c => c.id === targetCollectionId);

                // state.status = 'succeeded';
                // // if (source && target) {
                // //     source.recipes = source.recipes.filter(id => !recipeIds.includes(id));
                // //     recipeIds.forEach(id => {
                // //         if (!target.recipes.includes(id)) {
                // //             target.recipes.push(id);
                // //         }
                // //     });
                // // }
                const { sourceId, targetId, recipeIds } = action.payload;

                // Удаляем рецепты из source коллекции
                const source = state.collections.find(c => c.id === sourceId);
                const target = state.collections.find(c => c.id === targetId);

                if (source && target) {
                    source.recipes = source.recipes.filter(id => !recipeIds.includes(id));
                    recipeIds.forEach(id => {
                        if (!target.recipes.includes(id)) {
                            target.recipes.push(id);
                        }
                    });
                }

                // Обновляем recipesOnCollection, если оно связано с source коллекцией
                if (state.currentCollection?.id === sourceId) {
                    state.recipesOnCollection = state.recipesOnCollection.filter(
                        recipe => !recipeIds.includes(recipe.recipeId)
                    );
                }

                // Если recipesOnCollection связан с target, можно добавить туда новые рецепты,
                // но скорее всего они не загружены — тогда нужно либо обновить с сервера, либо добавить вручную.

                state.status = 'succeeded';
            })

            .addCase(copyRecipes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { targetId, recipeIds } = action.payload;
                const target = state.collections.find(c => c.id === targetId);

                if (target) {
                    recipeIds.forEach(id => {
                        if (!target.recipes.includes(id)) {
                            target.recipes.push(id);
                        }
                    });
                }
            })
            .addCase(addToUserFavorites.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const recipeId = action.meta.arg.recipeId;
                if (!state.favorites.includes(recipeId)) {
                    state.favorites.push(recipeId);
                }
            })
            .addCase(removeFromUserFavorites.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.favorites = state.favorites.filter(id => id !== action.payload);
            })
            .addCase(fetchRecipesFromCollection.fulfilled, (state, action) => {
                state.status = 'succeeded';
                //state.recipes = state.recipes.filter(id => id !== action.payload);
            })
            .addCase(fetchCollectionByRecipeId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Возвращаем коллекции, где есть этот рецепт
                state.collectionsWithRecipe = action.payload;
            })
            .addCase(fetchCollectionById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Возвращаем коллекции, где есть этот рецепт
                state.currentCollection = action.payload;
                state.recipesOnCollection = action.payload.RecipeOnCollection
            })

            // Затем общие обработчики .addMatcher
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.status = 'loading';
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload || action.error.message;
                }
            );
    }
});

// Экспорты
// Экспорты действий и thunks
export const {
    addToFavorites,
    removeFromFavorites,
    addCollection,
    updateCollection,
    deleteCollection,
    addRecipeToCollection,
    removeRecipeFromCollection,
    moveRecipesBetweenCollections,
    copyRecipesBetweenCollections,
    setCollections,
    setFavorites,
} = collectionsSlice.actions;



export default collectionsSlice.reducer;