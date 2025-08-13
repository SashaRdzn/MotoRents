import { createBrowserRouter } from 'react-router-dom'
import Layout from '../Layout/Layout'
import Home from '../../pages/Home/Home'
import Login from '@/pages/Auth/Login/Login'
import Register from '@/pages/Auth/Register/Register'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/home',
                element: <Home />,
            },
            {
                path: '/auth/register',
                element: <Register />,
            },
            {
                path: '/auth/login',
                element: <Login />,
            },
            {
                path: '/catalog',
                element: <Login />,
            }
        ]
    }
])