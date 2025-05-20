import { createSlice, createAsyncThunk, combineSlices } from '@reduxjs/toolkit';
import http from '../../api/http';

export const fetchCategoryDetails = createAsyncThunk(
    'categories/fetchCategoryDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await http.get(`categories/${id}/detail`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const followCategory = createAsyncThunk(
    'categories/followCategory',
    async (id, { rejectWithValue }) => {
        try {

            const userId = localStorage.getItem('userId')
            console.log('sub', { categoryId: id, userId: userId })
            const response = await http.post(`categories/subscribe`, { categoryId: id, userId: userId });
            console.log('SUBSCRIBE', response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }


);

export const unfollowCategory = createAsyncThunk(
    'categories/unfollowCategory',
    async (id) => {
        const userId = localStorage.getItem('userId')

        const response = await http.delete(`categories/subscribe`, { categoryId: id, userId: userId });
        return response.data;
    }
);

export const checkFollowing = createAsyncThunk(
    'categories/checkFollowing',
    async (id, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem('userId')
            console.log('check', { categoryId: id, userId: userId })
            const response = await http.get(`categories/check?userId=${userId}&categoryId=${id}`);
            console.log('SUBSCRIBE', response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getUserSubscribedCategories = createAsyncThunk(
    'categories/getUserSubscribedCategories',
    async (_, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem('userId')
            const response = await http.get(`categories/for-user/${userId}`);
            console.log('CAT SUB', response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        details: null,
        isLoading: false,
        error: null,
        followedCategories: [],
        recipes: [],
        isFollowed: false
    },
    reducers: {
        setFollowed(state, action) {
            state.followedCategories[action.payload] = true;
        },
        unsetFollowed(state, action) {
            delete state.followedCategories[action.payload];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoryDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCategoryDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.details = action.payload;
                state.recipes = action.payload.recipes.map(rec => rec.recipe);
            })
            .addCase(fetchCategoryDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(followCategory.fulfilled, (state, action) => {
                state.followedCategories[action.payload.id] = true;
            })
            .addCase(unfollowCategory.fulfilled, (state, action) => {
                delete state.followedCategories[action.payload.id];
            })
            .addCase(checkFollowing.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkFollowing.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isFollowed = action.payload
            })
            .addCase(checkFollowing.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(getUserSubscribedCategories.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserSubscribedCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.followedCategories = action.payload
            })
            .addCase(getUserSubscribedCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            ;
    },
});

export const { setFollowed, unsetFollowed } = categoriesSlice.actions;

export const selectCategoryDetails = (state) => state.categories.details;
export const selectIsCategoryFollowed = (id) => (state) =>
    state.categories.followedCategories[id] || false;

export default categoriesSlice.reducer;