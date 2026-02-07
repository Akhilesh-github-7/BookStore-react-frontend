import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PublicLibrary from './components/PublicLibrary';
import PersonalLibrary from './components/PersonalLibrary';
import CategoryPage from './components/CategoryPage';
import SearchResults from './components/SearchResults';
import Recommendations from './components/Recommendations';
import Favorites from './components/Favorites';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {loading && <LoadingSpinner />}

      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/public-library" element={<PublicLibrary />} />
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personal-library"
            element={
              <ProtectedRoute>
                <PersonalLibrary />
              </ProtectedRoute>
            }
          />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
              <Route path="/category/:categoryName" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </main>

      <footer className="bg-gray-800 p-4 text-white text-center">
        <p>&copy; 2025 BookStore App</p>
      </footer>
    </div>
  );
}

export default App;
