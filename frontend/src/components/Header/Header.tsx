import { Link } from 'react-router-dom'
import styles from './header.module.scss'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@pages/Auth/authSelectors'

const Header = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated)

    return (
        <header className={styles.header}>
            <nav className={styles.navigate}>
                <div className={styles.leftNav}>
                    <Link to={'/home'}>Главная</Link>
                    <Link to={'/catalog'}>Каталог</Link>
                </div>

                <div className={styles.rightNav}>
                    {isAuthenticated ? (
                        <>
                            <Link to={'/home'}>Мои брони</Link>
                            <Link to={'/logout'}>Выйти</Link>
                        </>
                    ) : (
                        <Link to={'/auth/login'}>Войти</Link>
                    )}
                </div>
            </nav>
        </header>   
    )
}

export default Header