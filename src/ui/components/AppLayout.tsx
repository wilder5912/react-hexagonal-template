import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/hooks/useAuth';

/** Layout con navbar. Se muestra en paginas publicas y privadas. */
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
              Usuarios
            </NavLink>
          </li>
          {isAuthenticated && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                Productos
              </NavLink>
            </li>
          )}
          {isAuthenticated && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/account">
                Cuenta
              </NavLink>
            </li>
          )}
        </ul>

        {isAuthenticated ? (
          <>
            <span className="navbar-text text-light me-3">{user?.name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Salir
            </button>
          </>
        ) : (
          <Link className="btn btn-primary btn-sm" to="/login">
            Entrar
          </Link>
        )}
      </nav>

      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>
    </div>
  );
}
