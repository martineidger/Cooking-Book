import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../api/http';


export const fetchCuisineDetails = createAsyncThunk(
    'cuisines/fetchCuisineDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await http.get(`cuisines/${id}/detail`);
            console.log('FETCH CUISINE', response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }


);

const cuisinesSlice = createSlice({
    name: 'cuisines',
    initialState: {
        details: null,
        isLoading: false,
        error: null,
        recipes: []
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCuisineDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCuisineDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.details = action.payload;
                state.recipes = action.payload.recipes
            })
            .addCase(fetchCuisineDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const selectCuisineDetails = (state) => state.cuisines.details;

export default cuisinesSlice.reducer;