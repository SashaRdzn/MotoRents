import { Outlet, Link } from 'react-router-dom';

export const MainLayout = () => (
  <div>
    <header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/auth">Auth</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </header>
    <main>
      <Outlet />
    </main>
  </div>
);