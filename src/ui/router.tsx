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
    // The shared layout gives both public and private pages the same navbar and page shell.
    element: <AppLayout />,
    children: [
      // These routes stay open even when nobody is logged in.
      { path: '/', element: <HomePage /> },
      { path: '/users', element: <UsersPage /> },
      {
        // These routes are behind auth. If there is no session, ProtectedRoute sends the user to /login.
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
