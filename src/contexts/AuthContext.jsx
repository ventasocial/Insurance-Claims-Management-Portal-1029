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
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password }); // Debug log
      
      // Credenciales exactas para SuperAdmin
      if (email.trim() === 'superadmin@platform.com' && password.trim() === 'superadmin123') {
        const userData = {
          id: 0,
          email: 'superadmin@platform.com',
          name: 'SuperAdmin',
          firstName: 'Super',
          paternalLastName: 'Admin',
          maternalLastName: '',
          whatsapp: '+52 55 0000 0000',
          role: 'superadmin',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          emails: [{ email: 'superadmin@platform.com', isPrimary: true, id: Date.now() }]
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('SuperAdmin login successful'); // Debug log
        return { success: true };
      }
      // Admin credentials
      else if (email.trim() === 'admin@seguro.com' && password.trim() === 'admin123') {
        const userData = {
          id: 1,
          email: 'admin@seguro.com',
          name: 'Administrador',
          firstName: 'Admin',
          paternalLastName: 'Demo',
          maternalLastName: '',
          whatsapp: '+52 55 1234 5678',
          role: 'admin',
          emails: [{ email: 'admin@seguro.com', isPrimary: true, id: Date.now() }]
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
      // Staff credentials
      else if (email.trim() === 'staff@seguro.com' && password.trim() === 'staff123') {
        const userData = {
          id: 5,
          email: 'staff@seguro.com',
          name: 'Agente Demo',
          firstName: 'Agente',
          paternalLastName: 'Demo',
          maternalLastName: '',
          whatsapp: '+52 55 8765 4321',
          role: 'staff',
          emails: [{ email: 'staff@seguro.com', isPrimary: true, id: Date.now() }]
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
      // Client credentials
      else if (email.trim() === 'cliente@email.com' && password.trim() === 'cliente123') {
        const userData = {
          id: 2,
          email: 'cliente@email.com',
          name: 'Cliente Demo',
          firstName: 'Cliente',
          paternalLastName: 'Demo',
          maternalLastName: 'Test',
          whatsapp: '+52 55 9876 5432',
          role: 'client',
          emails: [{ email: 'cliente@email.com', isPrimary: true, id: Date.now() }]
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
      else {
        console.log('Invalid credentials provided:', { email, password }); // Debug log
        return { success: false, error: 'Credenciales inválidas' };
      }
    } catch (error) {
      console.error("Error en login:", error);
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