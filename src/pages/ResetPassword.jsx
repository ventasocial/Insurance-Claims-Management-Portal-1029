import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiMail, FiArrowLeft, FiAlertCircle, FiCheck } = FiIcons;

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);
    setIsSuccess(false);

    if (!email.trim()) {
      setMessage('Por favor ingresa tu correo electrónico');
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/cambiar-password`,
      });

      if (error) {
        throw error;
      }

      setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico');
      setIsSuccess(true);
    } catch (error) {
      setMessage(error.message || 'Error al enviar el correo de recuperación');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <img 
              src="https://storage.googleapis.com/msgsndr/HWRXLf7lstECUAG07eRw/media/685d77c05c72d29e532e823f.png" 
              alt="Logo" 
              className="h-16 w-auto mx-auto mb-6" 
            />
            <h2 className="text-3xl font-bold text-gray-900">
              Recuperar contraseña
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingresa tu correo electrónico para recibir un enlace de recuperación
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiMail} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {message && (
              <div className={`${isError ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-600'} border px-4 py-3 rounded-md text-sm flex items-start`}>
                <SafeIcon icon={isError ? FiAlertCircle : FiCheck} className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
            </div>

            <div className="flex justify-center">
              <Link to="/login" className="flex items-center text-sm text-primary hover:text-primary-dark">
                <SafeIcon icon={FiArrowLeft} className="h-4 w-4 mr-1" />
                Volver a inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-2 sm:mb-0">
              <p className="text-sm">Powered by agendia.ai</p>
            </div>
            <div>
              <p className="text-sm">¿Necesitas ayuda? <a href="mailto:hola@agendia.ai" className="underline hover:text-blue-200 transition-colors">hola@agendia.ai</a></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResetPassword;