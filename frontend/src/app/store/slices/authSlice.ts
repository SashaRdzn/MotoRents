import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    isAuthenticated: boolean
    tokenAc: null | string
    tokenRef: null | string
    user: null | { name?: string; email: string; role?: string }
}

// Инициализация из localStorage
const getInitialState = (): AuthState => {
    const tokenAc = localStorage.getItem('token_access');
    const tokenRef = localStorage.getItem('token_refresh');
    
    return {
        isAuthenticated: !!(tokenAc && tokenRef),
        tokenAc,
        tokenRef,
        user: null
    };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens(state, action: PayloadAction<{ access: string; refresh: string }>) {
            state.isAuthenticated = true
            state.tokenAc = action.payload.access
            state.tokenRef = action.payload.refresh
        },
        setUser(state, action: PayloadAction<{ name?: string; email: string; role?: string } | null>) {
            state.user = action.payload ? { name: action.payload.name, email: action.payload.email, role: action.payload.role } : null
        },
        logout(state) {
            state.isAuthenticated = false
            state.user = null
            state.tokenAc = null
            state.tokenRef = null
        }
    }
})

export const { setTokens, setUser, logout } = authSlice.actions
export default authSlice.reducer