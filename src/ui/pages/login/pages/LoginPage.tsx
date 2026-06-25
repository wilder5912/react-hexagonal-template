import { useLoginController } from '../controller/useLoginController';
import styles from '../css/LoginPage.module.css';

export function LoginPage() {
  const { register, errors, submit, isLoggingIn, loginError } = useLoginController();

  return (
    <div className="container">
      <div className={styles.screen}>
        <div className={`card shadow-sm ${styles.card}`}>
          <div className="card-body">
            <h1 className="h4 mb-3 text-center">Sign in</h1>

            {loginError && (
              <div className="alert alert-danger py-2">Invalid credentials.</div>
            )}

            <form onSubmit={submit} noValidate>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className={`form-control${errors.username ? ' is-invalid' : ''}`}
                  {...register('username')}
                />
                {errors.username && (
                  <div className="invalid-feedback">{errors.username.message}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control${errors.password ? ' is-invalid' : ''}`}
                  {...register('password')}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password.message}</div>
                )}
              </div>
              <button className="btn btn-primary w-100" disabled={isLoggingIn}>
                {isLoggingIn ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
