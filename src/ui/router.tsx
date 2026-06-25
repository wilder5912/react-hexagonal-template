import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { LoginPage } from './pages/login';
import { HomePage } from './pages/home';
import { AccountPage } from './pages/account';
import { UsersPage } from './pages/users';
import { ProductsPage } from './pages/products';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    // El layout (con navbar) envuelve tanto paginas publicas como privadas.
    element: <AppLayout />,
    children: [
      // Publicas: visibles sin sesion.
      { path: '/', element: <HomePage /> },
      { path: '/users', element: <UsersPage /> },
      {
        // Privadas: requieren sesion (ProtectedRoute redirige a /login).
        element: <ProtectedRoute />,
        children: [
          { path: '/account', element: <AccountPage /> },
          { path: '/products', element: <ProductsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
