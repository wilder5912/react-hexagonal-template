import { useUsersController } from '../controller/useUsersController';
import styles from '../css/UsersPage.module.css';

export function UsersPage() {
  const { users, isLoading, isError } = useUsersController();

  return (
    <div>
      <h1 className="h3 mb-3">Users</h1>

      {isLoading && <div className="spinner-border" role="status" />}
      {isError && <div className="alert alert-danger">Could not load users.</div>}

      {users && (
        <table className={`table table-striped table-hover ${styles.table}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.company}</td>
                <td>{u.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
