import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/hooks/useAuth';

/** Controlador de la pagina de login: estado del formulario + submit. */
export function useLoginController() {
  // Credenciales de demo validas en DummyJSON.
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const { login, isLoggingIn, loginError } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate('/');
    } catch {
      // El error se muestra en la vista via loginError.
    }
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    handleSubmit,
    isLoggingIn,
    loginError,
  };
}
