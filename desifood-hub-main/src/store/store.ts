import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import favoritesReducer from './favoritesSlice'
import categoryReducer from './category/categorySlice'
import productReducer from './product/productSlice'
import orderReducer from './order/orderSlice'
import authReducer from './auth/authSlice'
import analyticsReducer from './analytics/analyticsSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
    categories: categoryReducer,
    products: productReducer,
    orders: orderReducer,
    auth: authReducer,
    analytics: analyticsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
