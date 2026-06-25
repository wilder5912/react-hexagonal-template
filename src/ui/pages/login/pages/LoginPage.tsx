import { useLoginController } from '../controller/useLoginController';
import styles from '../css/LoginPage.module.css';

export function LoginPage() {
  const { username, setUsername, password, setPassword, handleSubmit, isLoggingIn, loginError } =
    useLoginController();

  return (
    <div className={styles.screen}>
      <div className={`card shadow-sm ${styles.card}`}>
        <div className="card-body">
          <h1 className="h4 mb-3 text-center">Iniciar sesion</h1>

          {loginError && (
            <div className="alert alert-danger py-2">Credenciales invalidas.</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contrasena</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary w-100" disabled={isLoggingIn}>
              {isLoggingIn ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
