import { Link } from 'react-router-dom';

/** Page shown when the URL does not match any route (404). */
export function Page404() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1 fw-bold">404</h1>
      <p className="h4 mb-3">Page not found</p>
      <p className="text-muted mb-4">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link className="btn btn-primary" to="/">
        Back to home
      </Link>
    </div>
  );
}
