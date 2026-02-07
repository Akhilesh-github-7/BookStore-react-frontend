import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import './i18n';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import LoadingSpinner from './components/LoadingSpinner';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <ThemeProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </ThemeProvider>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
