import { Link } from 'react-router-dom'
import styles from './header.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { selectIsAuthenticated } from '@pages/Auth/authSelectors'
import type { RootState } from '@/app/store/store'
import LogoutConfirm from '@/components/LogoutConfirm/LogoutConfirm'
import React from 'react'
import { useLogoutMutation } from '@/app/api/api'
import { logout } from '@/app/store/slices/authSlice'
import { useToast } from '@/components/Toast/ToastProvider'

const Header = () => {
    const dispatch = useDispatch()
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const role = useSelector((s: RootState)=> s.auth.user?.role)
    const email = useSelector((s: RootState)=> s.auth.user?.email)
    const [isOpen, setIsOpen] = React.useState(false)
    const [logoutReq] = useLogoutMutation()
    const { show } = useToast()

    return (
        <header className={styles.header}>
            <nav className={styles.navigate}>
                <div className={styles.leftNav}>
                    <Link to={'/'}>Главная</Link>
                    <Link to={'/catalog'}>Каталог</Link>
                </div>

                <div className={styles.rightNav}>
                    {isAuthenticated ? (
                        <>
                            <Link to={'/bookings'}>Мои брони</Link>
                            {role === 'landlord' && (
                                <Link to={'/my-motorcycles'}>Мои мотоциклы</Link>
                            )}
                            <Link to={'/profile'}>Профиль</Link>
                            {role === 'admin' && (
                                <>
                                    <Link to={'/admin/create-listing'}>Создать объявление</Link>
                                    <Link to={'/admin'}>Админ</Link>
                                </>
                            )}
                            <button onClick={()=>setIsOpen(true)} className={styles.logoutButton}>Выйти</button>
                        </>
                    ) : (
                        <Link to={'/auth/login'}>Войти</Link>
                    )}
                </div>
                <LogoutConfirm
                    isOpen={isOpen}
                    email={email}
                    onCancel={()=>setIsOpen(false)}
                    onConfirm={async ()=>{
                        try {
                            const refresh = localStorage.getItem('token_refresh') || ''
                            if (refresh) await logoutReq({ refresh }).unwrap()
                        } catch {}
                        localStorage.removeItem('token_access')
                        localStorage.removeItem('token_refresh')
                        dispatch(logout())
                        setIsOpen(false)
                        show('Вы вышли из аккаунта', 'success')
                    }}
                />
            </nav>
        </header>   
    )
}

export default Header