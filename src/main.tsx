import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initStaticApiFallback } from './services/staticApiFallback';

// Enable seamless offline/GitHub Pages static mode fallback
initStaticApiFallback();

createRoot(document.getElementById('root')!).render(<App />);
