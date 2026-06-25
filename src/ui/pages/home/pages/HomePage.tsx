import { Link } from 'react-router-dom';
import { useHomeController } from '../controller/useHomeController';
import styles from '../css/HomePage.module.css';

export function HomePage() {
  const { user, isAuthenticated } = useHomeController();

  return (
    <div>
      <h1 className="h3 mb-3">
        {isAuthenticated ? `Welcome, ${user?.name}` : 'Welcome'}
      </h1>
      <p className="text-muted">
        Base template with hexagonal architecture, TypeScript, React Query, and Zustand.
      </p>

      {!isAuthenticated && (
        <Link className="btn btn-primary mb-3" to="/login">
          Sign in
        </Link>
      )}

      <div className={`row g-3 ${styles.cards}`}>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Hexagonal</h5>
              <p className="card-text small text-muted">
                Domain, application, and infrastructure separated by module.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">React Query</h5>
              <p className="card-text small text-muted">
                Cache and server state without manual `useEffect`.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Zustand</h5>
              <p className="card-text small text-muted">
                Persisted global session state.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
