import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/hooks/useAuth';

/** Handles the login form state and submit flow for the page. */
export function useLoginController() {
  // Prefilled demo credentials so the sample app works immediately.
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
      // The page already reads loginError from the hook, so there is nothing else to do here.
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
