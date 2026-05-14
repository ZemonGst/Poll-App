import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import './index.css'
import App from './App.jsx'
import { getMeThunk } from './features/auth/authSlice'
import { getToken } from './utils/storage'

document.documentElement.classList.add('dark');

if (getToken()) {
  store.dispatch(getMeThunk());
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
