import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import recipesReducer from './slices/recipesSlice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        recipes: recipesReducer
    },
})