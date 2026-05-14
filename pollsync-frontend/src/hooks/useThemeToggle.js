import { useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';

export function useThemeToggle() {
  const dispatch = useDispatch();
  
  const toggle = () => {
    if (!document.startViewTransition) {
      dispatch(toggleTheme());
      return;
    }
    document.startViewTransition(() => {
      dispatch(toggleTheme());
    });
  };
  
  return toggle;
}
