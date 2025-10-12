import { Link, useLocation, useParams } from 'react-router-dom'
import styles from './header.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { selectIsAuthenticated } from '@pages/Auth/authSelectors'
import type { RootState } from '@/app/store/store'
import LogoutConfirm from '@/components/LogoutConfirm/LogoutConfirm'
import React from 'react'
import { useLogoutMutation } from '@/app/api/api'
import { logout } from '@/app/store/slices/authSlice'
import { useToast } from '@/components/Toast/ToastProvider'
import {NAVIGATION_PATHS} from '../../constant/constant'

const Header = () => {
    const dispatch = useDispatch()
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const role = useSelector((s: RootState)=> s.auth.user?.role)
    const email = useSelector((s: RootState)=> s.auth.user?.email)
    const [isOpen, setIsOpen] = React.useState(false)
    const [logoutReq] = useLogoutMutation()
    const { show } = useToast()
    const [isHidden, setIsHidden] = React.useState(false)
    const lastScrollYRef = React.useRef<number>(0)
    const tickingRef = React.useRef<boolean>(false)
    const location = useLocation()



    const getActiveClass = (path: string) => location.pathname === path ? styles.active : ''


    React.useEffect(() => {
        const handleScroll = () => {
            if (tickingRef.current) return
            window.requestAnimationFrame(() => {
                const currentY = window.scrollY
                const lastY = lastScrollYRef.current
                const delta = currentY - lastY
                const isScrollingDown = delta > 0

                if (currentY < 20) {
                    setIsHidden(false)
                } else {
                    const threshold = 6
                    if (Math.abs(delta) > threshold) {
                        setIsHidden(isScrollingDown)
                    }
                }

                lastScrollYRef.current = currentY
                tickingRef.current = false
            })
            tickingRef.current = true
        }

        lastScrollYRef.current = window.scrollY
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`${styles.header} ${isHidden ? styles.hidden : ''}`}>
            <nav className={styles.navigate}>
                <div className={styles.leftNav}>
                    {NAVIGATION_PATHS.LEFT.map((item, index) => (
                        <Link 
                            key={index} 
                            to={item.path}
                            className={getActiveClass(item.path)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className={styles.rightNav}>
                    {isAuthenticated ? (
                        <>
                            {NAVIGATION_PATHS.AUTHENTICATED.map((item, index) => {
                                if (item.roles && !item.roles.includes(role!)) {
                                    return null
                                }
                                return (
                                    <Link 
                                        key={index}
                                        to={item.path}
                                        className={getActiveClass(item.path)}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            })}
                            <button onClick={()=>setIsOpen(true)} className={styles.logoutButton}>Выйти</button>
                        </>
                    ) : (
                        NAVIGATION_PATHS.UNAUTHENTICATED.map((item, index) => (
                            <Link 
                                key={index}
                                to={item.path}
                                className={getActiveClass(item.path)}
                            >
                                {item.label}
                            </Link>
                        ))
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