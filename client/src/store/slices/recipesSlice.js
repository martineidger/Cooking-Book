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
        searchTerm: '',
        categoryId: null,
        cuisineId: null,
        ingredientIds: [],
        sortBy: 'title',
        sortOrder: 'asc',
    },
    categories: [],
    cuisines: []
};

// ======================== Async Thunks ========================

// Загрузка всех рецептов с пагинацией и фильтрами
export const fetchRecipes = createAsyncThunk(
    'recipes/fetchRecipes',
    async ({
        page = 1,
        limit = 10,
        categoryId,
        cuisineId,
        ingredientIds,
        sortBy,
        sortOrder,
        searchTerm // Добавляем параметр поиска
    }, { rejectWithValue }) => {
        try {
            const response = await recipeApi.getAllRecipes({
                page,
                limit,
                categoryId,
                cuisineId,
                ingredientIds,
                sortBy,
                sortOrder,
                searchTerm // Передаем в API
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchCuisines = createAsyncThunk(
    'recipes/fetchCuisines',
    async (_, { rejectWithValue }) => {  // Используем _ для пропуска первого параметра
        try {
            const response = await recipeApi.fetchCuisines();
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'recipes/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await recipeApi.fetchCategories();
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

export const searchRecipesByIngredients = createAsyncThunk(
    'recipes/searchRecipesByIngredients',
    async ({ ingredientIds, categoryId, cuisineId }, { rejectWithValue }) => {
        try {
            const response = await recipeApi.searchRecipesByIngredients(ingredientIds, categoryId, cuisineId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getRecipesPortionsByIngredientsStrict = createAsyncThunk(
    'recipes/getRecipesPortionsByIngredientsStrict',
    async (ingredientsMap, { rejectWithValue }) => {
        try {
            const response = await recipeApi.countPortionsStrict(ingredientsMap);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const getRecipesPortionsByIngredientsPartial = createAsyncThunk(
    'recipes/getRecipesPortionsByIngredientsPartial',
    async (ingredientsMap, { rejectWithValue }) => {
        try {
            const response = await recipeApi.countPortionsPartial(ingredientsMap);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

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

            // ======================== fetchCuisines ========================
            .addCase(fetchCuisines.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCuisines.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cuisines = action.payload.data;
            })
            .addCase(fetchCuisines.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch cuisines';
            })

            // ======================== fetchCategories ========================
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload.data;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch categories';
            })

            // ======================== searchRecipesByIngredients ========================
            .addCase(searchRecipesByIngredients.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(searchRecipesByIngredients.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.recipes = action.payload;
                // Сброс пагинации, так как это поиск
                state.pagination = initialState.pagination;
            })
            .addCase(searchRecipesByIngredients.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to search recipes';
            })

            // ======================== getRecipesPortionsByIngredientsStrict ========================
            .addCase(getRecipesPortionsByIngredientsStrict.fulfilled, (state, action) => {
                // Здесь предполагается, что action.payload содержит информацию о порциях
                // Обновляем соответствующие рецепты в state.recipes
                // Реализация зависит от структуры ответа от API
            })

            // ======================== getRecipesPortionsByIngredientsPartial ========================
            .addCase(getRecipesPortionsByIngredientsPartial.fulfilled, (state, action) => {
                // Аналогично обработчику выше
            })

            // ======================== createRecipe ========================
            .addCase(createRecipe.fulfilled, (state, action) => {
                state.recipes.unshift(action.payload);
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
export const selectCategories = (state) => state.recipes.categories;
export const selectCuisines = (state) => state.recipes.cuisines;