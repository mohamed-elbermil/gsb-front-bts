import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isAdmin) {
      // Connexion administrateur
      if (login(email, password)) {
        navigate('/admin/requests');
      } else {
        setError('Identifiants administrateur incorrects');
      }
    } else {
      if (isRegistering) {
        // Inscription utilisateur
        if (register(name, email, password)) {
          setIsRegistering(false);
          setError('');
          alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        } else {
          setError('Cet email est déjà utilisé ou n\'est pas autorisé');
        }
      } else {
        // Connexion utilisateur
        if (login(email, password)) {
          navigate('/collaborator/my-requests');
        } else {
          setError('Identifiants incorrects');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isAdmin ? 'Connexion Administrateur' : (isRegistering ? 'Inscription Utilisateur' : 'Connexion Utilisateur')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isAdmin ? 'Accès réservé à l\'administrateur' : 'Espace utilisateur GSB'}
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setIsAdmin(false);
                  setIsRegistering(false);
                  setError('');
                }}
                className={`px-4 py-2 rounded-md ${
                  !isAdmin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Utilisateur
              </button>
              <button
                onClick={() => {
                  setIsAdmin(true);
                  setIsRegistering(false);
                  setError('');
                }}
                className={`px-4 py-2 rounded-md ${
                  isAdmin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Administrateur
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isAdmin && isRegistering && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={isAdmin ? "admin@gsb.com" : "votre@email.com"}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isRegistering ? "S'inscrire" : 'Se connecter'}
              </button>
            </div>

            {!isAdmin && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  {isRegistering ? 'Déjà inscrit ? Se connecter' : "Pas encore inscrit ? S'inscrire"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login; 