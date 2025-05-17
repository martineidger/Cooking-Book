import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../api/http';

export const fetchAllUsers = createAsyncThunk(
    'users/fetchAll',
    async () => {
        const response = await http.get('/users');
        return response.data;
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default usersSlice.reducer;