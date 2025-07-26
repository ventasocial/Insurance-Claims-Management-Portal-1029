import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiLogOut, FiUser, FiHome, FiUsers, FiEdit, FiX, FiSave, FiUserCheck } = FiIcons;

const Layout = ({ children, title }) => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    paternalLastName: user?.paternalLastName || '',
    maternalLastName: user?.maternalLastName || '',
    email: user?.email || '',
    whatsapp: user?.whatsapp || ''
  });
  const [errors, setErrors] = useState({});

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHome = () => {
    if (user?.role === 'admin' || user?.role === 'staff') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleUsersManagement = () => {
    navigate('/admin/usuarios');
  };

  const handleAgentsManagement = () => {
    navigate('/admin/agentes');
  };

  const handleGroupsManagement = () => {
    navigate('/admin/grupos');
  };

  const openProfileModal = () => {
    setProfileData({
      firstName: user?.firstName || '',
      paternalLastName: user?.paternalLastName || '',
      maternalLastName: user?.maternalLastName || '',
      email: user?.email || '',
      whatsapp: user?.whatsapp || ''
    });
    setErrors({});
    setShowProfileModal(true);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }
    
    if (!profileData.paternalLastName.trim()) {
      newErrors.paternalLastName = "El apellido paterno es requerido";
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "El email no es válido";
    }
    
    if (profileData.whatsapp && !profileData.whatsapp.startsWith('+')) {
      newErrors.whatsapp = "El número debe incluir el código de país (ej. +52)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = () => {
    if (!validateProfileForm()) return;
    
    updateUserProfile({
      ...user,
      firstName: profileData.firstName,
      paternalLastName: profileData.paternalLastName,
      maternalLastName: profileData.maternalLastName,
      email: profileData.email,
      whatsapp: profileData.whatsapp,
      name: `${profileData.firstName} ${profileData.paternalLastName} ${profileData.maternalLastName}`.trim()
    });
    
    setShowProfileModal(false);
  };

  // Determinar si el usuario actual es administrador
  const isAdmin = user?.role === 'admin';
  
  // Verificar páginas actuales
  const isUsersPage = location.pathname === '/admin/usuarios';
  const isAgentsPage = location.pathname === '/admin/agentes';
  const isGroupsPage = location.pathname === '/admin/grupos';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                src="https://storage.googleapis.com/msgsndr/HWRXLf7lstECUAG07eRw/media/685d77c05c72d29e532e823f.png"
                alt="Logo"
                className="h-10 w-auto"
              />
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
              >
                <SafeIcon icon={FiHome} className="w-5 h-5" />
                <span className="hidden sm:inline">Inicio</span>
              </button>
              
              {/* Botones de navegación solo para administradores */}
              {isAdmin && (
                <>
                  {!isUsersPage && (
                    <button
                      onClick={handleUsersManagement}
                      className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                    >
                      <SafeIcon icon={FiUsers} className="w-5 h-5" />
                      <span className="hidden sm:inline">Usuarios</span>
                    </button>
                  )}
                  
                  {!isAgentsPage && (
                    <button
                      onClick={handleAgentsManagement}
                      className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                    >
                      <SafeIcon icon={FiUserCheck} className="w-5 h-5" />
                      <span className="hidden sm:inline">Agentes</span>
                    </button>
                  )}
                  
                  {!isGroupsPage && (
                    <button
                      onClick={handleGroupsManagement}
                      className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                    >
                      <SafeIcon icon={FiUsers} className="w-5 h-5" />
                      <span className="hidden sm:inline">Grupos</span>
                    </button>
                  )}
                </>
              )}
              
              <button
                onClick={openProfileModal}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
              >
                <SafeIcon icon={FiUser} className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">{user?.name}</span>
                <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                  {user?.role === 'admin' 
                    ? 'Admin' 
                    : user?.role === 'staff'
                      ? 'Agente'
                      : 'Cliente'}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <SafeIcon icon={FiLogOut} className="w-5 h-5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">{children}</main>
      
      {/* Footer */}
      <footer className="bg-primary text-white py-4 mt-auto">
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

      {/* Modal de Edición de Perfil */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUser} className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-medium text-gray-900">Editar Perfil</h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombres*
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  className={`w-full border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                  placeholder="Nombres"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Paterno*
                </label>
                <input
                  type="text"
                  name="paternalLastName"
                  value={profileData.paternalLastName}
                  onChange={handleProfileChange}
                  className={`w-full border ${errors.paternalLastName ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                  placeholder="Apellido Paterno"
                />
                {errors.paternalLastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.paternalLastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido Materno
                </label>
                <input
                  type="text"
                  name="maternalLastName"
                  value={profileData.maternalLastName}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Apellido Materno"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={`w-full border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={profileData.whatsapp}
                  onChange={handleProfileChange}
                  className={`w-full border ${errors.whatsapp ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                  placeholder="+52 55 1234 5678"
                />
                {errors.whatsapp && (
                  <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                <SafeIcon icon={FiSave} className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;