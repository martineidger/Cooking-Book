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
    }
};

export default ingredientsApi;