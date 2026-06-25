import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/hooks/useAuth';

/** Shared app shell with the navbar and the main content area. */
export function AppLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/">
          base_v1
        </Link>
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/users">
              Users
            </NavLink>
          </li>
          {isAuthenticated && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                Products
              </NavLink>
            </li>
          )}
          {isAuthenticated && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/account">
                Account
              </NavLink>
            </li>
          )}
        </ul>

        {isAuthenticated ? (
          <>
            <span className="navbar-text text-light me-3">{user?.name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Sign out
            </button>
          </>
        ) : (
          <Link className="btn btn-primary btn-sm" to="/login">
            Sign in
          </Link>
        )}
      </nav>

      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>

      <footer className="bg-dark text-light text-center py-3 mt-auto">
        <small>© {new Date().getFullYear()} base_v1 — Hexagonal template</small>
      </footer>
    </div>
  );
}
