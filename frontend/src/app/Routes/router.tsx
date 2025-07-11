import { createBrowserRouter } from 'react-router-dom'
import Layout from '../Layout/Layout'
import Home from '../../pages/Home/Home'
import Auth from '../../pages/Auth/Auth'

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
                path: '/auth',
                element: <Auth />,
            }
        ]
    }
])