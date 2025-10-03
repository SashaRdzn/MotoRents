import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store/store'
import { authLoginApi } from '@/pages/Auth/authApi'
import { catalogApi } from '@/pages/Catalog/catalogApi'
import { bookingApi } from '@/components/BookingModal/bookingApi'
import type { CustomBaseQuery } from '@/types/typesAll'
import { setTokens } from '../store/slices/authSlice'

export const TAG_TYPES = {
    AUTH: 'Auth',
    TASK: 'Task',
    SPACE: 'Space',
} as const

const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    // credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.tokenAc
        if (token) headers.set('Authorization', `Bearer ${token}`)
        return headers
    },
}) as CustomBaseQuery

const baseQueryWithReauth: CustomBaseQuery = async (args, api, extra) => {
    let result = await rawBaseQuery(args, api, extra)
    if ((result as any)?.error?.status === 401) {
        const state = api.getState() as RootState
        const refresh = state.auth.tokenRef
        if (refresh) {
            const refreshResult = await rawBaseQuery({ url: '/auth/refresh', method: 'POST', body: { refresh } }, api, extra)
            const newAccess = (refreshResult as any)?.data?.access
            if (newAccess) {
                api.dispatch(setTokens({ access: newAccess, refresh }))
                try { localStorage.setItem('token_access', newAccess) } catch {}
                result = await rawBaseQuery(args, api, extra)
            }
        }
    }
    return result
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: Object.values(TAG_TYPES),
    endpoints: (builder) => ({
        ...authLoginApi(builder),
        ...catalogApi(builder),
        ...bookingApi(builder)
    }),
})

export const {
    useLoginMutation,
    useSend_codeMutation,
    useRegisterMutation,
    useVerify_codeMutation,
    useGetMeQuery,
    useUpdateMeMutation,
    useUpdateRoleMutation,
    useUploadAvatarMutation,
    useLogoutMutation,
    useGetMotorcyclesQuery,
    useGetMotorcycleByIdQuery,
    useGetMyMotorcyclesQuery,
    useCreateMotorcycleMutation,
    useUpdateMotorcycleMutation,
    useDeleteMotorcycleMutation,
    useToggleMotorcyclePublicMutation,
    useCreateBookingMutation,
    useGetMyBookingsQuery,
    useCancelBookingMutation,
} = api

export type AppApi = typeof api