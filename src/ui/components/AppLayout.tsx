import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/hooks/useAuth';

/** Shared app shell with the navbar and the main content area. */
export function AppLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  // Controls the collapsed menu on small screens (hamburger toggle).
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
    await logout();
    closeMenu();
    navigate('/');
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link className="navbar-brand fw-bold" to="/" onClick={closeMenu}>
          base_v1
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="main-navbar"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`} id="main-navbar">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/users" onClick={closeMenu}>
                Users
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/products" onClick={closeMenu}>
                  Products
                </NavLink>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/account" onClick={closeMenu}>
                  Account
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {isAuthenticated ? (
              <>
                <span className="navbar-text text-light">{user?.name}</span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Sign out
                </button>
              </>
            ) : (
              <Link className="btn btn-primary btn-sm" to="/login" onClick={closeMenu}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="py-4 flex-grow-1">
        <Outlet />
      </main>

      <footer className="bg-dark text-light text-center py-3 mt-auto">
        <small>© {new Date().getFullYear()} base_v1 — Hexagonal template</small>
      </footer>
    </div>
  );
}
