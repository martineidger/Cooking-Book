import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import recipesReducer from './slices/recipesSlice.js'
import ingredientsReducer from './slices/ingredientsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        recipes: recipesReducer,
        ingredients: ingredientsReducer
    },
})