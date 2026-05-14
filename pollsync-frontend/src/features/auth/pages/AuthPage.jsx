import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import PageBackground from '../../../components/layout/PageBackground';
import { validateLogin, validateRegister } from '../authValidation';
import { toLoginDTO, toRegisterDTO } from '../authDTOs';

const consumeReturnUrl = () => {
  const returnUrl = localStorage.getItem('returnUrl');
  localStorage.removeItem('returnUrl');

  if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
    return returnUrl;
  }

  return '/dashboard';
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { login, register, isLoading, error, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(consumeReturnUrl(), { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormErrors({});
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (isLogin) {
      const { valid, errors } = validateLogin(formData);
      if (!valid) return setFormErrors(errors);

      try {
        await login(toLoginDTO(formData)).unwrap();
      } catch {
        // Redux handles setting the global error
      }
    } else {
      const { valid, errors } = validateRegister(formData);
      if (!valid) return setFormErrors(errors);

      try {
        await register(toRegisterDTO(formData)).unwrap();
        // Login immediately after register
        await login(toLoginDTO(formData)).unwrap();
      } catch {
        // Handle err
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/google';
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-5">
      <PageBackground />
      
      <div className="relative z-10 w-full max-w-md glass-panel rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2 text-primary">
            <span 
              className="material-symbols-outlined text-4xl" 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            <h1 className="font-sora text-3xl font-bold">PollSync</h1>
          </div>
          <p className="font-hanken-grotesk text-on-surface-variant text-sm">
            Real-time data, grounded in earth.
          </p>
        </div>

        {/* Google Auth Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-surface-container-high hover:bg-surface-bright text-on-surface border border-outline-variant/30 font-hanken-grotesk py-3 px-4 rounded-lg transition-colors duration-200 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex-1 h-px bg-outline-variant/30"></div>
          <span className="font-jetbrains-mono text-[12px] uppercase tracking-[0.1em] text-on-surface-variant">OR</span>
          <div className="flex-1 h-px bg-outline-variant/30"></div>
        </div>

        {/* Global Error Message */}
        {error && (
          <div className="bg-error-container text-on-error-container text-sm p-3 rounded-lg mb-6 font-hanken-grotesk border border-error/30">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {!isLogin && (
            <div>
              <label className="block font-jetbrains-mono text-[12px] uppercase tracking-[0.1em] text-on-surface-variant mb-2">
                FULL NAME
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">
                  person
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-surface-container-highest border border-outline-variant/50 rounded-lg py-3 pl-10 pr-4 text-on-surface font-hanken-grotesk focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-on-surface-variant/50"
                  placeholder="Jane Doe"
                />
              </div>
              {formErrors.name && <p className="text-error text-xs mt-1 font-hanken-grotesk">{formErrors.name}</p>}
            </div>
          )}

          <div>
            <label className="block font-jetbrains-mono text-[12px] uppercase tracking-[0.1em] text-on-surface-variant mb-2">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">
                mail
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface-container-highest border border-outline-variant/50 rounded-lg py-3 pl-10 pr-4 text-on-surface font-hanken-grotesk focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-on-surface-variant/50"
                placeholder="you@example.com"
              />
            </div>
            {formErrors.email && <p className="text-error text-xs mt-1 font-hanken-grotesk">{formErrors.email}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-jetbrains-mono text-[12px] uppercase tracking-[0.1em] text-on-surface-variant">
                PASSWORD
              </label>
              {isLogin && (
                <a href="#" className="font-hanken-grotesk text-sm text-primary hover:text-primary-fixed transition-colors">
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-surface-container-highest border border-outline-variant/50 rounded-lg py-3 pl-10 pr-10 text-on-surface font-hanken-grotesk focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-on-surface-variant/50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {formErrors.password && <p className="text-error text-xs mt-1 font-hanken-grotesk">{formErrors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 bg-primary text-on-primary font-hanken-grotesk text-lg py-3 px-6 rounded-lg shadow-[0_0_20px_rgba(218,194,175,0.2)] hover:bg-primary-fixed hover:shadow-[0_0_25px_rgba(218,194,175,0.3)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-on-surface-variant font-hanken-grotesk text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={handleToggle}
              className="text-primary hover:text-primary-fixed transition-colors font-medium"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
