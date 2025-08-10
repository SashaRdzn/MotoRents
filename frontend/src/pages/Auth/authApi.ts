import type { ApiBuilder } from "@/types/typesAll";

interface User {
    email: string;
    name?: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

interface LoginCredentials {
    email: string;
    password: string;
}
interface EmailRequest {
    email: string
}
interface EmailRequestAndCode extends EmailRequest {
    code: string
}
interface SendCodeResponse {
    message: string
}
interface RegisterData extends LoginCredentials {
    name?: string;
}

export const authLoginApi = (builder: ApiBuilder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
        query: (credentials: LoginCredentials) => ({
            url: '/auth/login',
            method: 'POST',
            body: credentials,
        }),
        invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<AuthResponse, RegisterData>({
        query: (userData: RegisterData) => ({
            url: '/auth/register',
            method: 'POST',
            body: userData,
        }),
        invalidatesTags: ['Auth'],
    }),
    send_code: builder.mutation<SendCodeResponse, EmailRequest>({
        query: (email: EmailRequest) => ({
            url: '/auth/send-code',
            method: 'POST',
            body: email,
        }),
        invalidatesTags: ['Auth'],
    }),
    verify_code: builder.mutation<SendCodeResponse, EmailRequestAndCode>({
        query: (data: EmailRequestAndCode) => ({
            url: '/auth/verify-code',
            method: 'POST',
            body: data,
        }),
        invalidatesTags: ['Auth'],
    }),

    getMe: builder.query<Omit<AuthResponse, 'token'>, void>({
        query: () => '/auth/me',
        providesTags: ['Auth'],
    }),
});