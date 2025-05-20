import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import recipesReducer from './slices/recipesSlice.js'
import ingredientsReducer from './slices/ingredientsSlice';
import collectionsReducer from './slices/collectionsSlice.js';
import profileReducer from './slices/profileSlice.js'
import usersReducer from './slices/usersSlice.js'
import followReducer from './slices/followSlice.js'
import cuisineReducer from './slices/cuisineSlice.js'
import categoriesReducer from './slices/categoriesSlice.js'
import subscriptionsReducer from './slices/subscriptionsSlice.js'


export const store = configureStore({
    reducer: {
        auth: authReducer,
        recipes: recipesReducer,
        ingredients: ingredientsReducer,
        collections: collectionsReducer,
        profile: profileReducer,
        users: usersReducer,
        follow: followReducer,
        cuisine: cuisineReducer,
        categories: categoriesReducer,
        subscriptions: subscriptionsReducer
    },
})