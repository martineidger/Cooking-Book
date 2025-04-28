import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recipeApi } from '../../api/recipeApi';

// Состояние по умолчанию
const initialState = {
    recipes: [],          // Список рецептов
    currentRecipe: null,  // Текущий открытый рецепт
    status: 'idle',       // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,          // Ошибка, если есть
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    },
    filters: {
        categoryId: null,
        cuisineId: null,
        ingredientIds: [],
        sortBy: 'title',
        sortOrder: 'asc',
    },
};

// ======================== Async Thunks ========================

// Загрузка всех рецептов с пагинацией и фильтрами
export const fetchRecipes = createAsyncThunk(
    'recipes/fetchRecipes',
    async ({ page = 1, limit = 10, categoryId, cuisineId, ingredientIds, sortBy, sortOrder }, { rejectWithValue }) => {
        try {
            const response = await recipeApi.getAllRecipes({
                page,
                limit,
                categoryId,
                cuisineId,
                ingredientIds,
                sortBy,
                sortOrder,
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Получение одного рецепта по ID
export const fetchRecipeById = createAsyncThunk(
    'recipes/fetchRecipeById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await recipeApi.getRecipeById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Создание рецепта
export const createRecipe = createAsyncThunk(
    'recipes/createRecipe',
    async (recipeData, { rejectWithValue }) => {
        try {
            const response = await recipeApi.createRecipe(recipeData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Обновление рецепта
export const updateRecipe = createAsyncThunk(
    'recipes/updateRecipe',
    async ({ id, recipeData }, { rejectWithValue }) => {
        try {
            const response = await recipeApi.updateRecipe(id, recipeData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Удаление рецепта
export const deleteRecipe = createAsyncThunk(
    'recipes/deleteRecipe',
    async (id, { rejectWithValue }) => {
        try {
            const response = await recipeApi.deleteRecipe(id);
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// ======================== Slice ========================

const recipesSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        // Синхронные редьюсеры для фильтров
        setFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.page = 1; // Сброс страницы при изменении фильтров
        },
        resetFilters(state) {
            state.filters = initialState.filters;
            state.pagination.page = 1;
        },
        // Синхронные редьюсеры для пагинации
        setPage(state, action) {
            state.pagination.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // ======================== fetchRecipes ========================
            .addCase(fetchRecipes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRecipes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recipes = action.payload.recipes;
                state.pagination = {
                    page: action.payload.page,
                    limit: action.payload.limit,
                    total: action.payload.total,
                    totalPages: action.payload.totalPages,
                };
            })
            .addCase(fetchRecipes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch recipes';
            })

            // ======================== fetchRecipeById ========================
            .addCase(fetchRecipeById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRecipeById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentRecipe = action.payload;
            })
            .addCase(fetchRecipeById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch recipe';
            })

            // ======================== createRecipe ========================
            .addCase(createRecipe.fulfilled, (state, action) => {
                state.recipes.unshift(action.payload); // Добавляем в начало списка
            })

            // ======================== updateRecipe ========================
            .addCase(updateRecipe.fulfilled, (state, action) => {
                const index = state.recipes.findIndex(recipe => recipe.id === action.payload.id);
                if (index !== -1) {
                    state.recipes[index] = action.payload;
                }
                if (state.currentRecipe?.id === action.payload.id) {
                    state.currentRecipe = action.payload;
                }
            })

            // ======================== deleteRecipe ========================
            .addCase(deleteRecipe.fulfilled, (state, action) => {
                state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload.id);
                if (state.currentRecipe?.id === action.payload.id) {
                    state.currentRecipe = null;
                }
            });
    },
});

// Экспортируем actions и reducer
export const { setFilters, resetFilters, setPage } = recipesSlice.actions;
export default recipesSlice.reducer;

// ======================== Селекторы ========================
export const selectAllRecipes = (state) => state.recipes.recipes;
export const selectCurrentRecipe = (state) => state.recipes.currentRecipe;
export const selectRecipesStatus = (state) => state.recipes.status;
export const selectRecipesError = (state) => state.recipes.error;
export const selectPagination = (state) => state.recipes.pagination;
export const selectFilters = (state) => state.recipes.filters;