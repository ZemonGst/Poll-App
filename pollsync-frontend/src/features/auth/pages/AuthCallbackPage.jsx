import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { saveToken } from '../../../utils/storage';
import { setToken, getMeThunk } from '../authSlice';
import Spinner from '../../../components/ui/Spinner';

const consumeReturnUrl = () => {
  const returnUrl = localStorage.getItem('returnUrl');
  localStorage.removeItem('returnUrl');

  if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
    return returnUrl;
  }

  return '/dashboard';
};

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {

      saveToken(token);
      
      dispatch(setToken(token));
      
      dispatch(getMeThunk())
        .unwrap()
        .then(() => {

          navigate(consumeReturnUrl(), { replace: true });
        })
        .catch((error) => {
          console.error('Failed to fetch user after OAuth:', error);
          navigate('/?error=session_failed', { replace: true });
        });
    } else {

      const error = searchParams.get('error');
      console.error('OAuth error from URL:', error);
      navigate(`/?error=${error || 'oauth_failed'}`, { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  return <Spinner variant="fullpage" />;
};

export default AuthCallbackPage;
