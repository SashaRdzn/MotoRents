import { Outlet, Link } from 'react-router-dom'

const Layout = () => {
    return (
        <>
            <header>
                <Link to={'/home'} >Home</Link>
                <Link to={'/auth'} >Auth</Link>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout
