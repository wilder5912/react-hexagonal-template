import { useAccountController } from '../controller/useAccountController';
import styles from '../css/AccountPage.module.css';

export function AccountPage() {
  const { user } = useAccountController();

  return (
    <div>
      <h1 className="h3 mb-3">Mi cuenta</h1>
      <ul className={`list-group ${styles.list}`}>
        <li className="list-group-item d-flex justify-content-between">
          <span className="text-muted">Nombre</span>
          <span>{user?.name}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span className="text-muted">Email</span>
          <span>{user?.email}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span className="text-muted">ID</span>
          <span>{user?.id}</span>
        </li>
      </ul>
    </div>
  );
}
