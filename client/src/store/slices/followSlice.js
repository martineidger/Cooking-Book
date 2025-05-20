import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http from '../../api/http';

export const followUser = createAsyncThunk(
    'follow/followUser',
    async ({ followerId, followingId }, { rejectWithValue }) => {
        try {
            const response = await http.post('/follow', { followerId: followerId, followingId: followingId });
            console.log('FOLLOW', response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const unfollowUser = createAsyncThunk(
    'follow/unfollowUser',
    async ({ followerId, followingId }, { rejectWithValue }) => {
        try {
            const response = await http.delete('/follow', { data: { followerId, followingId } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const checkFollowStatus = createAsyncThunk(
    'follow/checkStatus',
    async ({ followerId, followingId }, { rejectWithValue }) => {
        try {
            const response = await http.get(`/follow/status?followerId=${followerId}&followingId=${followingId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getUserFollowings = createAsyncThunk(
    'follow/getUserFollowings',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await http.get(`/follow/followings/${userId}`);
            console.log("FOLLOWINGS", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getUserFollowers = createAsyncThunk(
    'follow/getUserFollowers',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await http.get(`/follow/followers/${userId}`);
            console.log("FOLLOWERS", response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchFollowwingsRecipes = createAsyncThunk(
    'follow/fetchFollowwingsRecipes',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await http.get(`/follow/recipes/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    followings: [],
    followers: [],
    followersCount: 0,
    status: 'idle',
    error: null,
    isFollowing: false,
    recipes: []
};

const followSlice = createSlice({
    name: 'follow',
    initialState,
    reducers: {
        resetFollowStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Обработка followUser
            .addCase(followUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(followUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isFollowing = true;
                // Обновляем список подписок
                //state.followings = [...state.followings, action.payload];
            })
            .addCase(followUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Обработка unfollowUser
            .addCase(unfollowUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(unfollowUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isFollowing = false;
                // Удаляем из списка подписок
                state.followings = state.followings.filter(
                    user => user.id !== action.meta.arg.followingId
                );
            })
            .addCase(unfollowUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Обработка checkFollowStatus
            .addCase(checkFollowStatus.fulfilled, (state, action) => {
                state.isFollowing = action.payload;
            })

            // Обработка getUserFollowings
            .addCase(getUserFollowings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUserFollowings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log('foll slice', action)
                state.followings = action.payload;
            })
            .addCase(getUserFollowings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Обработка getUserFollowers
            .addCase(getUserFollowers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUserFollowers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.followers = action.payload;
                state.followersCount = state.followers.count;
            })
            .addCase(getUserFollowers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Обработка getUserFollowers
            .addCase(fetchFollowwingsRecipes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFollowwingsRecipes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recipes = action.payload;
            })
            .addCase(fetchFollowwingsRecipes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetFollowStatus } = followSlice.actions;
export default followSlice.reducer;