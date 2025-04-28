import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/recipes'; // Замените на ваш URL

class RecipeApi {
    // ======================== Основные методы ========================

    /**
     * Получить все рецепты с пагинацией и фильтрами
     */
    async getAllRecipes({
        page = 1,
        limit = 10,
        categoryId,
        cuisineId,
        ingredientIds,
        sortBy,
        sortOrder = 'asc',
    }) {
        const params = {
            page,
            limit,
            categoryId,
            cuisineId,
            ingredientIds: ingredientIds?.join(','),
            sortBy,
            sortOrder,
        };

        const response = await axios.get(API_BASE_URL, { params });
        return response.data; // { recipes, total, page, limit, totalPages }
    }

    /**
     * Получить рецепт по ID
     */
    async getRecipeById(id) {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data; // { recipe, allergens }
    }

    /**
     * Создать рецепт
     */
    async createRecipe(recipeData) {
        const response = await axios.post(API_BASE_URL, recipeData);
        return response.data; // Recipe
    }

    /**
     * Обновить рецепт
     */
    async updateRecipe(id, recipeData) {
        const response = await axios.put(`${API_BASE_URL}/${id}`, recipeData);
        return response.data; // Recipe
    }

    /**
     * Удалить рецепт
     */
    async deleteRecipe(id) {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        return response.data; // Recipe
    }

    // ======================== Дополнительные методы ========================

    /**
     * Найти рецепты по ингредиентам
     */
    async findRecipesByIngredients(ingredientIds, categoryId, cuisineId) {
        const params = {
            ingredientIds: ingredientIds.join(','),
            categoryId,
            cuisineId,
        };
        const response = await axios.get(`${API_BASE_URL}/with-ingredients`, { params });
        return response.data; // Array<{ recipe, matchCount, allergens }>
    }

    /**
     * Получить шаг приготовления
     */
    async getCookingStep(recipeId, stepNumber) {
        const response = await axios.get(`${API_BASE_URL}/${recipeId}/cook`, {
            params: { 'step-number': stepNumber },
        });
        return response.data; // CookingStep | null
    }

    /**
     * Добавить заметку к рецепту
     */
    async addNote(noteData) {
        const response = await axios.post(`${API_BASE_URL}/notes`, noteData);
        return response.data; // Note
    }

    /**
     * Подсчет порций по ингредиентам
     */
    async countPortions(ingredients) {
        // ingredients: Array<{ id: string, quantity: number }>
        const response = await axios.get(`${API_BASE_URL}/count-portions`, {
            params: { ingredientIds: ingredients.map(i => `${i.id},${i.quantity}`).join(';') },
        });
        return response.data; // Array<{ Recipe, minPortionsCount }>
    }
}

export const recipeApi = new RecipeApi();