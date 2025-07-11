import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    user: { id: string; email: string } | null;
}

const initialState: AuthState = {
    token: null,
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            // action: PayloadAction<{ token: string; user: AuthState['user'] }>
        ) => {
            // state.token = action.payload.token;
            // state.user = action.payload.user;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;