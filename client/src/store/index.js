import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import productReducer from '../slices/productSlice';
import cartReducer from '../slices/cartSlice';
import orderReducer from '../slices/orderSlice';
import announcementReducer from '../slices/announcementSlice';
import complaintReducer from '../slices/complaintSlice';
import userReducer from '../slices/userSlice';
import contactReducer from '../slices/contactSlice';
import analyticsReducer from '../slices/analyticsSlice';
import engagementReducer from '../slices/engagementSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    announcements: announcementReducer,
    complaints: complaintReducer,
    users: userReducer,
    contact: contactReducer,
    analytics: analyticsReducer,
    engagement: engagementReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});
