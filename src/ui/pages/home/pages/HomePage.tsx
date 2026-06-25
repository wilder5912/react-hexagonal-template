import { Link } from 'react-router-dom';
import { useHomeController } from '../controller/useHomeController';
import styles from '../css/HomePage.module.css';

export function HomePage() {
  const { user, isAuthenticated } = useHomeController();

  return (
    <div>
      <h1 className="h3 mb-3">
        {isAuthenticated ? `Bienvenido, ${user?.name}` : 'Bienvenido'}
      </h1>
      <p className="text-muted">
        Plantilla base con arquitectura hexagonal, TypeScript, React Query y Zustand.
      </p>

      {!isAuthenticated && (
        <Link className="btn btn-primary mb-3" to="/login">
          Iniciar sesion
        </Link>
      )}

      <div className={`row g-3 ${styles.cards}`}>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Hexagonal</h5>
              <p className="card-text small text-muted">
                Dominio, aplicacion e infraestructura separados por modulo.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">React Query</h5>
              <p className="card-text small text-muted">
                Cache y estado del servidor sin useEffect manual.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Zustand</h5>
              <p className="card-text small text-muted">
                Estado global de sesion, persistido.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
