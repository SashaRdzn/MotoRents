import { MainLayout } from '../layouts/mainlayout';
import { Homepage } from '../modules/home/pages/homepage';
import { Authpage } from '../modules/auth/pages/authpage';
import { Profilepage } from '../modules/profile/pages/profilepage';
import type { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Homepage /> },
            { path: 'auth', element: <Authpage /> },
            { path: 'profile', element: <Profilepage /> },
        ],
    },
]; 