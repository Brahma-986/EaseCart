import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i._id === item._id || i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      state.totalItems += 1;
      state.totalAmount += item.price;
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const item = state.items.find((i) => i._id === itemId || i.id === itemId);
      if (item) {
        state.totalItems -= item.quantity;
        state.totalAmount -= item.price * item.quantity;
        state.items = state.items.filter((i) => i._id !== itemId && i.id !== itemId);
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        const delta = quantity - item.quantity;
        state.totalItems += delta;
        state.totalAmount += delta * item.price;
        item.quantity = quantity;
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
    setCartFromStorage: (state, action) => {
      state.items = action.payload.items || [];
      state.totalItems = action.payload.totalItems || 0;
      state.totalAmount = action.payload.totalAmount || 0;
    },
    incrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.items.find((i) => i._id === itemId || i.id === itemId);
      if (item) {
        item.quantity += 1;
        state.totalItems += 1;
        state.totalAmount += item.price;
      }
    },
    decrementQuantity: (state, action) => {
      const itemId = action.payload;
      const item = state.items.find((i) => i._id === itemId || i.id === itemId);
      if (item) {
        item.quantity -= 1;
        state.totalItems -= 1;
        state.totalAmount -= item.price;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i._id !== itemId && i.id !== itemId);
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartFromStorage, incrementQuantity, decrementQuantity, clearError } = cartSlice.actions;
export default cartSlice.reducer;
