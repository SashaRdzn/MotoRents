import { configureStore } from '@reduxjs/toolkit';
import { api } from '../api/api';
import authReducer from './slices/auth.slice';
// import modalReducer from './slices/modal.slice';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        // modal: modalReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;