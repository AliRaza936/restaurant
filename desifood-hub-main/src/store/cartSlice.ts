import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  pieces?: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

// Load cart from localStorage
const loadCartFromStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      return {
        items: parsedCart.items || [],
        total: parsedCart.total || 0,
        itemCount: parsedCart.itemCount || 0
      }
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
  }
  
  return {
    items: [],
    total: 0,
    itemCount: 0
  }
}

const initialState: CartState = loadCartFromStorage()

// Save cart to localStorage
const saveCartToStorage = (cart: CartState) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
  addToCart: (state, action: PayloadAction<CartItem>) => {
  const newItem = { ...action.payload, quantity: action.payload.quantity ?? 1 };

  // Check if item with same id, size, and pieces already exists
  const existingItemIndex = state.items.findIndex(item =>
    item.id === newItem.id &&
    item.size === newItem.size &&
    item.pieces === newItem.pieces
  );

  if (existingItemIndex !== -1) {
    // If item exists, increment quantity
    state.items[existingItemIndex].quantity += newItem.quantity;
  } else {
    // Otherwise add new item
    state.items.push(newItem);
  }

  // Update totals
  state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  // Save to localStorage
  saveCartToStorage(state);
},

    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      
      // Update totals
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
      
      // Save to localStorage
      saveCartToStorage(state)
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id)
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== action.payload.id)
        } else {
          item.quantity = action.payload.quantity
        }
        
        // Update totals
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
        
        // Save to localStorage
        saveCartToStorage(state)
      }
    },
    
    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
      
      // Save to localStorage
      saveCartToStorage(state)
    },
    
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload)
      if (item) {
        item.quantity += 1
        
        // Update totals
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
        
        // Save to localStorage
        saveCartToStorage(state)
      }
    },
    
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload)
      if (item && item.quantity > 1) {
        item.quantity -= 1
        
        // Update totals
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
        
        // Save to localStorage
        saveCartToStorage(state)
      }
    }
  }
})

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  incrementQuantity, 
  decrementQuantity 
} = cartSlice.actions

export default cartSlice.reducer
