import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../api/http';

// Async Thunks
export const fetchFollowedCategories = createAsyncThunk(
    'subscriptions/fetchFollowedCategories',
    async (_, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem('userId')
            const response = await http.get(`/categories/followed?userId=${userId}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const followCategory = createAsyncThunk(
    'subscriptions/followCategory',
    async (categoryId, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem('userId')
            await http.post(`/categories/${categoryId}/follow?userId=${userId}`);
            return categoryId;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const unfollowCategory = createAsyncThunk(
    'subscriptions/unfollowCategory',
    async (categoryId, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem('userId')
            await http.post(`/categories/${categoryId}/unfollow?userId=${userId}`);
            return categoryId;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const fetchSubscriptionsRecipes = createAsyncThunk(
    'subscriptions/fetchSubscriptionsRecipes',
    async (_, { rejectWithValue }) => {
        try {
            const userId = localStorage.getItem('userId')
            await http.post(`/categories/sub/get-recipes?userId=${userId}`);
            return categoryId;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const initialState = {
    followedCategories: [],
    followersByCategory: {},
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    operationStatus: 'idle', // Для операций follow/unfollow
    operationError: null
};

const subscriptionsSlice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {
        resetSubscriptionStatus: (state) => {
            state.operationStatus = 'idle';
            state.operationError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Получение списка подписанных категорий
            .addCase(fetchFollowedCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFollowedCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.followedCategories = action.payload;
            })
            .addCase(fetchFollowedCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || action.error.message;
            })

            // Подписка на категорию
            .addCase(followCategory.pending, (state) => {
                state.operationStatus = 'loading';
            })
            .addCase(followCategory.fulfilled, (state, action) => {
                state.operationStatus = 'succeeded';
                if (!state.followedCategories.includes(action.payload)) {
                    state.followedCategories.push(action.payload);
                }
            })
            .addCase(followCategory.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload?.message || action.error.message;
            })

            // Отписка от категории
            .addCase(unfollowCategory.pending, (state) => {
                state.operationStatus = 'loading';
            })
            .addCase(unfollowCategory.fulfilled, (state, action) => {
                state.operationStatus = 'succeeded';
                state.followedCategories = state.followedCategories.filter(
                    id => id !== action.payload
                );
            })
            .addCase(unfollowCategory.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload?.message || action.error.message;
            })

            //
            .addCase(fetchSubscriptionsRecipes.pending, (state) => {
                state.operationStatus = 'loading';
            })
            .addCase(fetchSubscriptionsRecipes.fulfilled, (state, action) => {
                state.operationStatus = 'succeeded';
                state.recipesBySub = action.payload
            })
            .addCase(fetchSubscriptionsRecipes.rejected, (state, action) => {
                state.operationStatus = 'failed';
                state.operationError = action.payload?.message || action.error.message;
            })


    }
});