import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Bills from './pages/Bills';
import RequestsManagement from './pages/Admin/RequestsManagement';
import RequestForm from './pages/Collaborator/RequestForm';
import MyRequests from './pages/Collaborator/MyRequests';

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

function Navigation() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-gray-300">Tableau de bord</Link>
          <Link to="/bills" className="hover:text-gray-300">Factures</Link>
          {user.role === 'admin' ? (
            <Link to="/admin/requests" className="hover:text-gray-300">Gestion des demandes</Link>
          ) : (
            <>
              <Link to="/collaborator/new-request" className="hover:text-gray-300">Nouvelle demande</Link>
              <Link to="/collaborator/my-requests" className="hover:text-gray-300">Mes demandes</Link>
            </>
          )}
        </div>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/bills"
              element={
                <PrivateRoute>
                  <Bills />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <PrivateRoute roles={['admin']}>
                  <RequestsManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/collaborator/new-request"
              element={
                <PrivateRoute roles={['collaborator']}>
                  <RequestForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/collaborator/my-requests"
              element={
                <PrivateRoute roles={['collaborator']}>
                  <MyRequests />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
