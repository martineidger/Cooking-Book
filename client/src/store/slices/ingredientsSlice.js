import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/ingredientsApi';

export const fetchIngredients = createAsyncThunk(
    'ingredients/fetchIngredients',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.getIngredients();
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to load ingredients');
        }
    }
);

export const fetchIngredientUnits = createAsyncThunk(
    'ingredients/fetchIngredientUnits',
    async (_, { rejectWithValue }) => {
        try {

            const response = await api.fetchIngredientUnits();
            console.log('FETCH UNIT', response)
            return response
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const initialState = {
    ingredients: [],
    units: [],
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
                state.ingredients = action.payload;
            })
            .addCase(fetchIngredients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchIngredientUnits.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.units = action.payload;
            })
            .addCase(fetchIngredientUnits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default ingredientsSlice.reducer;