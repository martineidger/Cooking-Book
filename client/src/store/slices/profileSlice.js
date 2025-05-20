// src/store/profileSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http from '../../api/http';


const initialState = {
    profileUser: null,
    collections: [],
    recipes: [],
    subscriptions: [],
    isLoading: false,
    collectionsPage: 1,
    recipesPage: 1,
    hasMoreCollections: true,
    hasMoreRecipes: true,
};

export const fetchUserProfile = createAsyncThunk(
    'profile/fetchUserProfile',
    async (userId) => {
        const response = await http.get(`/users/${userId}/profile`);
        console.log('PROFILE USER', response)
        return response.data;
    }
);

export const updateUserProfile = createAsyncThunk(
    'profile/updateUserProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem('userId')
            console.log("UPDATE USER", userData)
            const response = await http.patch(`users/${userId}`, { username: userData.username });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUserCollections = createAsyncThunk(
    'profile/fetchUserCollections',
    async ({ userId, initialLoad = false }) => {
        console.log(123456)
        //const state = getState();
        // const page = initialLoad ? 1 : state.profile.collectionsPage;
        const page = 1;
        const response = await http.get(`/collection/user/${userId}`, {
            params: { page, limit: 10 }
        });
        console.log('PROFILE COL', response)

        return {
            collections: response.data.data,
            page,
            hasMore: response.data.hasMore
        };
    }
);

// export const fetchUserRecipes = createAsyncThunk(
//     'profile/fetchUserRecipes',
//     async ({ userId, initialLoad = false }, { getState }, { rejectWithValue }) => {
//         try {
//             const state = getState().profile;
//             const page = initialLoad ? 1 : state.profile.recipesPage;
//             //const page = 1;
//             const response = await http.get(`/recipes/user/${userId}`, {
//                 params: { page, limit: 10 }
//             });

//             console.log('PROFILE RECipes', response)

//             return {
//                 recipes: response.data.recipes,
//                 page,
//                 hasMore: response.data.hasMore
//             };
//         } catch {
//             return rejectWithValue(error.response?.data || error.message);
//         }

//     }
// );

export const fetchUserRecipes = createAsyncThunk(
    'profile/fetchUserRecipes',
    async ({ userId, initialLoad = false }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const currentPage = state.profile.recipesPage;
            const page = initialLoad ? 1 : currentPage + 1;

            const response = await http.get(`/recipes/user/${userId}`, {
                params: { page, limit: 10 }
            });

            return {
                recipes: response.data.recipes,
                page,
                hasMore: response.data.hasMore,
                initialLoad
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profileUser = action.payload;
                state.subscriptions = action.payload.subscriptions;
            })
            .addCase(fetchUserProfile.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profileUser = { ...action.payload };
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchUserCollections.pending, (state) => {
                if (state.collectionsPage === 1) {
                    state.isLoading = true;
                }
            })
            .addCase(fetchUserCollections.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.page === 1) {
                    state.collections = action.payload.collections;
                } else {
                    state.collections = [...state.collections, ...action.payload.collections];
                }
                state.collectionsPage = action.payload.page + 1;
                state.hasMoreCollections = action.payload.hasMore;
            })
            .addCase(fetchUserCollections.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchUserRecipes.pending, (state) => {
                if (state.recipesPage === 1) {
                    state.isLoading = true;
                }
            })
            .addCase(fetchUserRecipes.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.page === 1) {
                    state.recipes = action.payload.recipes;
                } else {
                    state.recipes = [...state.recipes, ...action.payload.recipes];
                }
                state.recipesPage = action.payload.page + 1;
                state.hasMoreRecipes = action.payload.hasMore;
            })
            .addCase(fetchUserRecipes.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export default profileSlice.reducer;