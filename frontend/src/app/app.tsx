import { RouterProvider } from 'react-router-dom';
import { router } from './Routes/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { setTokens } from './store/slices/authSlice';
import { useGetMeQuery } from './api/api';
import { setUser } from './store/slices/authSlice';
import { initializeTheme } from './store/slices/themeSlice';
import { ToastProvider } from '@/components/Toast/ToastProvider';


export function App() {
  const dispatch = useDispatch();
  const tokens = useSelector((s: RootState)=>({ ac: s.auth.tokenAc, ref: s.auth.tokenRef }))
  const { data: meData } = useGetMeQuery(undefined, { skip: !tokens.ac })
  useEffect(()=>{
    if (!tokens.ac || !tokens.ref) {
      const access = localStorage.getItem('token_access')
      const refresh = localStorage.getItem('token_refresh')
      if (access && refresh) {
        dispatch(setTokens({ access, refresh }))
      }
    }
    // Инициализируем тему при загрузке приложения
    dispatch(initializeTheme())
  },[])
  useEffect(()=>{
    const role = (meData as any)?.user?.role || (meData as any)?.role
    const email = (meData as any)?.user?.email || (meData as any)?.user_email
    const theme = (meData as any)?.theme
    if (email || role || theme) {
      dispatch(setUser({ email, role, theme }))
    }
  }, [meData])
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
} 