import { useSelector, useDispatch } from 'react-redux';
import { loginThunk, registerThunk, logoutThunk } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginThunk(credentials));
  const register = (userData) => dispatch(registerThunk(userData));
  const logout = () => dispatch(logoutThunk());

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};
