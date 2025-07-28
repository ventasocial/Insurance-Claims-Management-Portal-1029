import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AvatarUploader from './AvatarUploader';
import EmailManager from '../components/EmailManager';

const { FiLogOut, FiUser, FiHome, FiUsers, FiEdit, FiX, FiSave, FiUserCheck, FiCheck } = FiIcons;

const Layout = ({ children, title }) => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    paternalLastName: user?.paternalLastName || '',
    maternalLastName: user?.maternalLastName || '',
    emails: user?.emails || (user?.email ? [{ email: user?.email, isPrimary: true, id: Date.now() }] : []),
    groupId: user?.groupId || '',
    avatar: user?.avatar || '',
    whatsapp: user?.whatsapp || ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHome = () => {
    // Corregir la navegación según el rol del usuario
    if (user?.role === 'superadmin') {
      navigate('/superadmin');
    } else if (user?.role === 'admin' || user?.role === 'staff') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleUsersManagement = () => {
    if (user?.role === 'admin') {
      navigate('/admin/usuarios');
    } else if (user?.role === 'staff') {
      navigate('/admin/usuarios-agente');
    }
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
      emails: user?.emails || (user?.email ? [{ email: user?.email, isPrimary: true, id: Date.now() }] : []),
      groupId: user?.groupId || '',
      avatar: user?.avatar || '',
      whatsapp: user?.whatsapp || ''
    });
    setFormErrors({});
    setShowProfileModal(true);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailsChange = (emails) => {
    setProfileData(prev => ({
      ...prev,
      emails
    }));
  };

  const handleAvatarChange = (avatarUrl) => {
    setProfileData(prev => ({
      ...prev,
      avatar: avatarUrl
    }));
  };

  const validateProfileForm = () => {
    const errors = {};

    if (!profileData.firstName.trim()) {
      errors.firstName = "El nombre es requerido";
    }

    if (!profileData.paternalLastName.trim()) {
      errors.paternalLastName = "El apellido paterno es requerido";
    }

    if (!profileData.emails || profileData.emails.length === 0) {
      errors.emails = "Debe tener al menos un email";
    } else {
      // Validar que al menos un email sea válido
      const validEmails = profileData.emails.filter(emailObj => 
        emailObj.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailObj.email)
      );
      if (validEmails.length === 0) {
        errors.emails = "Debe tener al menos un email válido";
      }
    }

    if (profileData.whatsapp && !profileData.whatsapp.startsWith('+')) {
      errors.whatsapp = "El número debe incluir el código de país (ej. +52)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = () => {
    if (!validateProfileForm()) return;

    const primaryEmail = profileData.emails.find(e => e.isPrimary)?.email || profileData.emails[0]?.email;

    updateUserProfile({
      ...user,
      firstName: profileData.firstName,
      paternalLastName: profileData.paternalLastName,
      maternalLastName: profileData.maternalLastName,
      email: primaryEmail,
      emails: profileData.emails,
      avatar: profileData.avatar,
      whatsapp: profileData.whatsapp,
      name: `${profileData.firstName} ${profileData.paternalLastName} ${profileData.maternalLastName || ''}`.trim()
    });

    setShowProfileModal(false);
  };

  const getFullName = () => {
    return `${profileData.firstName} ${profileData.paternalLastName} ${profileData.maternalLastName || ''}`.trim();
  };

  // Determinar si el usuario actual es administrador o agente
  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';
  const isSuperAdmin = user?.role === 'superadmin';

  // Verificar páginas actuales
  const isUsersPage = location.pathname === '/admin/usuarios' || location.pathname === '/admin/usuarios-agente';
  const isAgentsPage = location.pathname === '/admin/agentes';
  const isGroupsPage = location.pathname === '/admin/grupos';

  // Función para obtener el badge del rol correcto
  const getRoleBadge = () => {
    switch (user?.role) {
      case 'superadmin':
        return (
          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
            SuperAdmin
          </span>
        );
      case 'admin':
        return (
          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
            Admin
          </span>
        );
      case 'staff':
        return (
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
            Agente
          </span>
        );
      case 'client':
        return (
          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
            Cliente
          </span>
        );
      default:
        return (
          <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded-full">
            Usuario
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                src="https://storage.googleapis.com/msgsndr/HWRXLf7lstECUAG07eRw/media/685d77c05c72d29e532e823f.png"
                alt="Logo"
                className="h-8 sm:h-10 w-auto"
              />
              {/* Ocultar el título en pantallas pequeñas (menos de 768px) */}
              <h1 className="hidden md:block text-lg lg:text-xl font-semibold text-gray-900">{title}</h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleHome}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-primary transition-colors"
              >
                <SafeIcon icon={FiHome} className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="hidden sm:inline text-sm">Inicio</span>
              </button>

              {/* Botones de navegación para administradores y agentes (no para SuperAdmin) */}
              {(isAdmin || isStaff) && !isSuperAdmin && (
                <>
                  {!isUsersPage && (
                    <button
                      onClick={handleUsersManagement}
                      className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-primary transition-colors"
                    >
                      <SafeIcon icon={FiUsers} className="w-4 sm:w-5 h-4 sm:h-5" />
                      <span className="hidden sm:inline text-sm">Usuarios</span>
                    </button>
                  )}

                  {/* Solo administradores pueden ver agentes y grupos */}
                  {isAdmin && (
                    <>
                      {!isAgentsPage && (
                        <button
                          onClick={handleAgentsManagement}
                          className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-primary transition-colors"
                        >
                          <SafeIcon icon={FiUserCheck} className="w-4 sm:w-5 h-4 sm:h-5" />
                          <span className="hidden sm:inline text-sm">Agentes</span>
                        </button>
                      )}

                      {!isGroupsPage && (
                        <button
                          onClick={handleGroupsManagement}
                          className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-primary transition-colors"
                        >
                          <SafeIcon icon={FiUsers} className="w-4 sm:w-5 h-4 sm:h-5" />
                          <span className="hidden sm:inline text-sm">Grupos</span>
                        </button>
                      )}
                    </>
                  )}
                </>
              )}

              <button
                onClick={openProfileModal}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-primary transition-colors"
              >
                <SafeIcon icon={FiUser} className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="text-sm hidden sm:inline truncate max-w-20 lg:max-w-none">{user?.name}</span>
                {getRoleBadge()}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <SafeIcon icon={FiLogOut} className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="hidden sm:inline text-sm">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-grow w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-2 sm:mb-0">
              <p className="text-sm">Powered by agendia.ai</p>
            </div>
            <div>
              <p className="text-sm text-center sm:text-left">
                ¿Necesitas ayuda?{' '}
                <a
                  href="mailto:hola@agendia.ai"
                  className="underline hover:text-blue-200 transition-colors"
                >
                  hola@agendia.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de Edición de Perfil */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiEdit} className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                <h3 className="text-lg sm:text-xl font-medium text-gray-900">Editar Perfil</h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 sm:w-6 h-5 sm:h-6" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Avatar Section */}
              <div className="flex justify-center pb-4 sm:pb-6 border-b border-gray-200">
                <AvatarUploader
                  currentAvatar={profileData.avatar}
                  onAvatarChange={handleAvatarChange}
                  size="lg"
                />
              </div>

              {/* Campos de Nombre */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre(s) *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className={`w-full border ${
                      formErrors.firstName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm`}
                    placeholder="Nombres"
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido Paterno *
                  </label>
                  <input
                    type="text"
                    name="paternalLastName"
                    value={profileData.paternalLastName}
                    onChange={handleProfileChange}
                    className={`w-full border ${
                      formErrors.paternalLastName ? 'border-red-300' : 'border-gray-300'
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm`}
                    placeholder="Apellido Paterno"
                  />
                  {formErrors.paternalLastName && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.paternalLastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    name="maternalLastName"
                    value={profileData.maternalLastName}
                    onChange={handleProfileChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                    placeholder="Apellido Materno"
                  />
                </div>
              </div>

              {/* Previsualización del nombre completo */}
              {(profileData.firstName || profileData.paternalLastName) && (
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Nombre completo:</span>
                    <span className="text-sm text-blue-900">{getFullName()}</span>
                  </div>
                </div>
              )}

              {/* Gestión de Emails */}
              <div className={formErrors.emails ? 'border border-red-300 rounded-md p-4' : ''}>
                <EmailManager
                  emails={profileData.emails}
                  onEmailsChange={handleEmailsChange}
                  showPrimarySelector={true}
                />
                {formErrors.emails && (
                  <p className="mt-2 text-xs text-red-500">{formErrors.emails}</p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={profileData.whatsapp}
                  onChange={handleProfileChange}
                  className={`w-full border ${
                    formErrors.whatsapp ? 'border-red-300' : 'border-gray-300'
                  } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm`}
                  placeholder="+52 55 1234 5678"
                />
                {formErrors.whatsapp && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.whatsapp}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm"
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