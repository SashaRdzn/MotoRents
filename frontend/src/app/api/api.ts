import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store/store'
import { authLoginApi } from '@/pages/Auth/authApi'
import type { CustomBaseQuery } from '@/types/typesAll'

export const TAG_TYPES = {
    AUTH: 'Auth',
    TASK: 'Task',
    SPACE: 'Space',
} as const

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.tokenAc
            if (token) headers.set('Authorization', `Bearer ${token}`)
            return headers
        },
    }) as CustomBaseQuery,
    tagTypes: Object.values(TAG_TYPES),
    endpoints: (builder) => ({
        ...authLoginApi(builder)
    }),
})

export const {
    useLoginMutation,
    useSend_codeMutation,
    useRegisterMutation,
    useVerify_codeMutation,
    useGetMeQuery,
} = api

export type AppApi = typeof api