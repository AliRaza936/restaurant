import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  variants?: {
    id: string;
    size?: string;
    pieces?: number;
    price: number;
  }[];
}

interface FavoritesState {
  items: FavoriteItem[]
  count: number
}

// Load favorites from localStorage
const loadFavoritesFromStorage = (): FavoritesState => {
  try {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites)
      return {
        items: parsedFavorites.items || [],
        count: parsedFavorites.count || 0
      }
    }
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error)
  }
  
  return {
    items: [],
    count: 0
  }
}

const initialState: FavoritesState = loadFavoritesFromStorage()

// Save favorites to localStorage
const saveFavoritesToStorage = (favorites: FavoritesState) => {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error)
  }
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
   addToFavorites: (state, action: PayloadAction<FavoriteItem>) => {
  const existingItem = state.items.find(item => item.id === action.payload.id);

  if (!existingItem) {
    state.items.push(action.payload);
    state.count = state.items.length;
    saveFavoritesToStorage(state);
  }
},
    
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.count = state.items.length
      // Save to localStorage
      saveFavoritesToStorage(state)
    },
    
    clearFavorites: (state) => {
      state.items = []
      state.count = 0
      // Save to localStorage
      saveFavoritesToStorage(state)
    }
  }
})

export const { 
  addToFavorites, 
  removeFromFavorites, 
  clearFavorites 
} = favoritesSlice.actions

export default favoritesSlice.reducer
