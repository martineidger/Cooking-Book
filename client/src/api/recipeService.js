// api/recipeService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const getRecipes = async (params) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/recipes`, { params });
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRecipeById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/recipes/${id}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
};