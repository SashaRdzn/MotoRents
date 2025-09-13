import { createBrowserRouter } from 'react-router-dom'
import Layout from '../Layout/Layout'
import Home from '../../pages/Home/Home'
import Login from '@/pages/Auth/Login/Login'
import Register from '@/pages/Auth/Register/Register'
import Catalog from '@/pages/Catalog/Catalog'
import MotoDetail from '@/pages/MotoDetail/MotoDetail'
import MyBookings from '@/pages/Bookings/MyBookings'
import Profile from '@/pages/Profile/Profile'
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute'
import NotFound from '@/components/NotFound/NotFound'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/profile',
                element: <ProtectedRoute><Profile /></ProtectedRoute>,
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
                element: <Catalog />,
            },
            {
                path: '/bookings',
                element: <ProtectedRoute><MyBookings /></ProtectedRoute>,
            },
            {
                path: "/motorcycle/:id",
                element: <MotoDetail />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
])