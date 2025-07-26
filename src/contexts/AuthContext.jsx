import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulación de login - en producción conectar con backend real
      if (email === 'admin@seguro.com' && password === 'admin123') {
        const userData = {
          id: 1,
          email: 'admin@seguro.com',
          name: 'Administrador',
          firstName: 'Admin',
          paternalLastName: 'Demo',
          maternalLastName: '',
          whatsapp: '+52 55 1234 5678',
          role: 'admin'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else if (email === 'staff@seguro.com' && password === 'staff123') {
        const userData = {
          id: 5,
          email: 'staff@seguro.com',
          name: 'Staff Demo',
          firstName: 'Staff',
          paternalLastName: 'Demo',
          maternalLastName: '',
          whatsapp: '+52 55 8765 4321',
          role: 'staff'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else if (email === 'cliente@email.com' && password === 'cliente123') {
        const userData = {
          id: 2,
          email: 'cliente@email.com',
          name: 'Cliente Demo',
          firstName: 'Cliente',
          paternalLastName: 'Demo',
          maternalLastName: 'Test',
          whatsapp: '+52 55 9876 5432',
          role: 'client'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: 'Credenciales inválidas' };
      }
    } catch (error) {
      return { success: false, error: 'Error al iniciar sesión' };
    }
  };

  const updateUserProfile = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};