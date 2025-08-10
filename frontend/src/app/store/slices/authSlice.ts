import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
    isAuthenticated: boolean
    tokenAc: null | string
    tokenRef: null | string
    user: null | { name: string; email: string }
}

const initialState: AuthState = {
    isAuthenticated: false,
    tokenAc: null,
    tokenRef: null,
    user: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.isAuthenticated = true
            state.tokenAc = action.payload
            state.tokenRef = action.payload
            state.user = action.payload
        },
        logout(state) {
            state.isAuthenticated = false
            state.user = null
            state.tokenAc = null
            state.tokenRef = null
        }
    }
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer