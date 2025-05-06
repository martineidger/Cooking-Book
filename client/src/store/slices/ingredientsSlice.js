import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/ingredientsApi';

export const fetchIngredients = createAsyncThunk(
    'ingredients/fetchIngredients',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.getIngredients();
            return Array.isArray(response?.data) ? response.data : [];
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to load ingredients');
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null
};

const ingredientsSlice = createSlice({
    name: 'ingredients',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchIngredients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIngredients.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchIngredients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default ingredientsSlice.reducer;