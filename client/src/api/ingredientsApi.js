import axios from 'axios';
import http from './http';

const ingredientsApi = {
    getIngredients: async () => {
        try {
            const response = await http.get('ingredients');
            return {
                data: Array.isArray(response?.data) ? response.data : []
            };
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            return { data: [] };
        }
    },
    fetchIngredientUnits: async () => {
        try {
            const response = await http.get('ingredients/unit');
            console.log(response)
            return response.data;
        } catch (error) {
            console.error('Error getting ingredients/unit:', error);
            throw error;
        }
    }
};

export default ingredientsApi;