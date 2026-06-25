import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/hooks/useAuth';
import { loginSchema, type LoginFormValues } from './loginSchema';

/** Handles the login form state and submit flow for the page. */
export function useLoginController() {
  const { login, isLoggingIn, loginError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    // Prefilled demo credentials so the sample app works immediately.
    defaultValues: { username: 'emilys', password: 'emilyspass' },
  });

  // Only runs when validation passes.
  const submit = rhfHandleSubmit(async (values) => {
    try {
      await login(values);
      navigate('/');
    } catch {
      // The page already reads loginError from the hook, so there is nothing else to do here.
    }
  });

  return {
    register,
    errors,
    submit,
    isLoggingIn,
    loginError,
  };
}
