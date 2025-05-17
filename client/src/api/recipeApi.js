import axios from 'axios';
import http from './http';

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
        searchTerm, // Добавляем параметр поиска
    }) {
        const params = {
            page,
            limit,
            ...(categoryId && { categoryId }), // Добавляем только если есть значение
            ...(cuisineId && { cuisineId }),
            ...(ingredientIds?.length && { ingredientIds: ingredientIds.join(',') }),
            ...(sortBy && { sortBy }),
            sortOrder,
            ...(searchTerm && { searchTerm }), // Добавляем поисковый запрос
        };

        const response = await http.get(API_BASE_URL, { params });
        return response.data;
    }

    /**
     * Получить рецепт по ID
     */
    async getRecipeById(id) {
        const response = await http.get(`${API_BASE_URL}/${id}`);
        return response.data; // { recipe, allergens }
    }

    /**
     * Создать рецепт
     */
    async createRecipe(recipeData) {
        const response = await http.post(API_BASE_URL, recipeData);
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
    // async countPortionsStrict(ingredients) {
    //     try {
    //         // Создаем параметры в формате: ingredientIds[]=id1=quantity1&ingredientIds[]=id2=quantity2
    //         const params = new URLSearchParams();
    //         ingredients.forEach(ingredient => {
    //             params.append('ingredientIds', `${ingredient.id}=${ingredient.quantity}`);
    //         });

    //         const apiUrl = `/recipes/count-portions?${params.toString()}`;
    //         const response = await http.get(apiUrl);
    //         console.log(apiUrl)
    //         console.log(response)
    //         return response.data;
    //     } catch (error) {
    //         console.error('Ошибка при подсчете порций:', error);
    //         throw error;
    //     }
    // }

    // async countPortionsPartial(ingredients) {
    //     try {
    //         // Создаем параметры в формате: ingredientIds[]=id1=quantity1&ingredientIds[]=id2=quantity2
    //         const params = new URLSearchParams();
    //         ingredients.forEach(ingredient => {
    //             params.append('ingredientIds', `${ingredient.id}=${ingredient.quantity}`);
    //         });

    //         const apiUrl = `/recipes/count-portions-partial?${params.toString()}`;
    //         const response = await http.get(apiUrl);
    //         console.log(apiUrl)
    //         console.log(response)
    //         return response.data;
    //     } catch (error) {
    //         console.error('Ошибка при подсчете порций:', error);
    //         throw error;
    //     }
    // }

    async countPortionsStrict(ingredientsMap) {
        try {
            const params = new URLSearchParams();

            // Преобразуем Map в массив пар [key, value]
            Array.from(ingredientsMap.entries()).forEach(([id, quantity]) => {
                params.append('ingredientIds', `${id}=${quantity}`);
            });

            const apiUrl = `/recipes/count-portions?${params.toString()}`;
            const response = await http.get(apiUrl);
            return response.data;
        } catch (error) {
            console.error('Ошибка при подсчете порций (strict):', error);
            throw error;
        }
    }

    async countPortionsPartial(ingredientsMap) {
        try {
            const params = new URLSearchParams();

            // Аналогичное преобразование для partial версии
            Array.from(ingredientsMap.entries()).forEach(([id, quantity]) => {
                params.append('ingredientIds', `${id}=${quantity}`);
            });

            const apiUrl = `/recipes/count-portions-partial?${params.toString()}`;
            const response = await http.get(apiUrl);
            return response.data;
        } catch (error) {
            console.error('Ошибка при подсчете порций (partial):', error);
            throw error;
        }
    }


    getIngredients = async () => axios.get('/api/ingredients')
    getCategories = async () => axios.get('/api/categories')
    getCuisines = async () => axios.get('/api/cuisines')

    async searchRecipesByIngredients(ingredientIds, categoryId, cuisineId) {
        const params = new URLSearchParams();
        params.append('ingredientIds', ingredientIds.join(','));
        if (categoryId) params.append('categoryId', categoryId);
        if (cuisineId) params.append('cuisineId', cuisineId);
        return http.get(`/recipes/with-ingredients?${params.toString()}`);
    }

    async calculatePortions(ingredients) {
        return http.get('/recipes/count-portions', {
            params: { ingredientIds: ingredients }
        });
    }

    async fetchCategories() {
        try {
            const response = await http.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Error getting categories:', error);
            throw error;
        }
    }

    async fetchCuisines() {
        try {
            const response = await http.get('/cuisines');
            return response.data;
        } catch (error) {
            console.error('Error getting cuisines:', error);
            throw error;
        }
    }

}

export const recipeApi = new RecipeApi();