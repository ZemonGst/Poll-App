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

document.documentElement.classList.add('dark');

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
