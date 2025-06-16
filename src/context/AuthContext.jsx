import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Compte administrateur prédéfini
const ADMIN_CREDENTIALS = {
  email: 'admin@gsb.com',
  password: 'admin123',
  name: 'Administrateur GSB',
  role: 'admin'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password) => {
    // Vérification des identifiants de l'administrateur
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser({
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: 'admin'
      });
      localStorage.setItem('user', JSON.stringify({
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: 'admin'
      }));
      return true;
    }
    
    // Pour les utilisateurs normaux, on vérifie dans le localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = {
        email: foundUser.email,
        name: foundUser.name,
        role: 'user'
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = (name, email, password) => {
    // Vérifier si l'email n'est pas celui de l'admin
    if (email === ADMIN_CREDENTIALS.email) {
      return false;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Vérifier si l'email existe déjà
    if (users.some(u => u.email === email)) {
      return false;
    }

    // Ajouter le nouvel utilisateur
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
} 