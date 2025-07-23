import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiLoader } = FiIcons;

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Esperar a que el usuario se cargue
        const timeout = setTimeout(() => {
          setError('Se agotó el tiempo de espera. Por favor intenta de nuevo.');
        }, 10000); // 10 segundos de timeout

        // Si el usuario ya está autenticado, redirigir
        if (user) {
          clearTimeout(timeout);
          if (user.role === 'admin' || user.role === 'staff') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        setError('Error al procesar la autenticación');
        console.error('Error en callback:', error);
      }
    };

    handleCallback();
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <img 
            src="https://storage.googleapis.com/msgsndr/HWRXLf7lstECUAG07eRw/media/685d77c05c72d29e532e823f.png" 
            alt="Logo" 
            className="h-16 w-auto mx-auto mb-6" 
          />
          <h2 className="text-2xl font-bold text-gray-900">
            Procesando autenticación
          </h2>
          {!error ? (
            <div className="mt-6 flex flex-col items-center">
              <SafeIcon icon={FiLoader} className="animate-spin h-8 w-8 text-primary mb-4" />
              <p className="text-sm text-gray-600">
                Por favor espera mientras te redirigimos...
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-sm text-red-600 mb-4">
                {error}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Volver al inicio de sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;