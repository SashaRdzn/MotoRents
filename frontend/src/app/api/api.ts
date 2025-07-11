import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';
// import { authEndpoints } from './endpoints/auth.endpoints';
// import { tasksEndpoints } from './endpoints/tasks.endpoints';
// import { spacesEndpoints } from './endpoints/spaces.endpoints';

export enum ETags {
    AUTH = 'Auth',
    TASK = 'Task',
    SPACE = 'Space',
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: Object.values(ETags),
    endpoints: (builder) => ({
        // ...authEndpoints(builder),
        // ...tasksEndpoints(builder),
        // ...spacesEndpoints(builder),
    }),
});