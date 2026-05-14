import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import './index.css'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import App from './App.jsx'
import { getMeThunk } from './features/auth/authSlice'
import { getToken } from './utils/storage'

NProgress.configure({ showSpinner: false });
NProgress.start();

const initialTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.classList.add(initialTheme);

store.subscribe(() => {
  const state = store.getState();
  const theme = state.theme?.theme || 'dark';
  if (theme === 'dark') {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
});

if (getToken()) {
  store.dispatch(getMeThunk()).finally(() => {
    NProgress.done();
  });
} else {
  NProgress.done();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
