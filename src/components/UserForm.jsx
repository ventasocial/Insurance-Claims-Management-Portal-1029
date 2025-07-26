import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AvatarUploader from './AvatarUploader';
import EmailManager from './EmailManager';

const { FiUser, FiPhone, FiUsers, FiX, FiSave, FiUserCheck, FiShield } = FiIcons;

const UserForm = ({
  user = {},
  onSave,
  onCancel,
  title = "Nuevo Usuario",
  isEditing = false,
  currentUserRole = "admin",
  groups = []
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    emails: [],
    whatsapp: '',
    avatar: '',
    role: 'client',
    status: 'active',
    groupId: '',
    ...user
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      // Si viene un objeto user con datos, usar esos datos
      setFormData({
        firstName: user.firstName || '',
        paternalLastName: user.paternalLastName || '',
        maternalLastName: user.maternalLastName || '',
        emails: user.emails || (user.email ? [{ email: user.email, isPrimary: true, id: Date.now() }] : []),
        whatsapp: user.whatsapp || '',
        avatar: user.avatar || '',
        role: user.role || 'client',
        status: user.status || 'active',
        groupId: user.groupId || '',
        ...user
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!formData.paternalLastName?.trim()) {
      newErrors.paternalLastName = "El apellido paterno es requerido";
    }

    if (!formData.emails || formData.emails.length === 0) {
      newErrors.emails = "Debe tener al menos un email";
    } else {
      // Validar que al menos un email sea válido
      const validEmails = formData.emails.filter(emailObj => 
        emailObj.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailObj.email)
      );
      if (validEmails.length === 0) {
        newErrors.emails = "Debe tener al menos un email válido";
      }
    }

    if (formData.whatsapp && !formData.whatsapp.startsWith('+')) {
      newErrors.whatsapp = "El número debe incluir el código de país (ej. +52)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Construir el objeto de usuario con nombre completo
    const userData = {
      ...formData,
      name: `${formData.firstName} ${formData.paternalLastName} ${formData.maternalLastName || ''}`.trim(),
      // Obtener el email principal
      email: formData.emails.find(e => e.isPrimary)?.email || formData.emails[0]?.email || ''
    };

    onSave(userData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEmailsChange = (emails) => {
    setFormData(prev => ({
      ...prev,
      emails
    }));

    // Limpiar error de emails cuando se actualicen
    if (errors.emails) {
      setErrors(prev => ({
        ...prev,
        emails: ''
      }));
    }
  };

  const handleAvatarChange = (avatarUrl) => {
    setFormData(prev => ({
      ...prev,
      avatar: avatarUrl
    }));
  };

  const getFullName = () => {
    return `${formData.firstName} ${formData.paternalLastName} ${formData.maternalLastName || ''}`.trim();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiUser} className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-medium text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex justify-center pb-6 border-b border-gray-200">
            <AvatarUploader
              currentAvatar={formData.avatar}
              onAvatarChange={handleAvatarChange}
              size="lg"
            />
          </div>

          {/* Campos de Nombre - Sección principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre(s) *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full border ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                placeholder="Nombres"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido Paterno *
              </label>
              <input
                type="text"
                name="paternalLastName"
                value={formData.paternalLastName}
                onChange={handleInputChange}
                className={`w-full border ${
                  errors.paternalLastName ? 'border-red-300' : 'border-gray-300'
                } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                placeholder="Apellido Paterno"
              />
              {errors.paternalLastName && (
                <p className="mt-1 text-xs text-red-500">{errors.paternalLastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido Materno
              </label>
              <input
                type="text"
                name="maternalLastName"
                value={formData.maternalLastName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Apellido Materno"
              />
            </div>
          </div>

          {/* Previsualización del nombre completo */}
          {(formData.firstName || formData.paternalLastName) && (
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUserCheck} className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Nombre completo:</span>
                <span className="text-sm text-blue-900">{getFullName()}</span>
              </div>
            </div>
          )}

          {/* Gestión de Emails */}
          <div className={errors.emails ? 'border border-red-300 rounded-md p-4' : ''}>
            <EmailManager
              emails={formData.emails}
              onEmailsChange={handleEmailsChange}
              showPrimarySelector={true}
            />
            {errors.emails && (
              <p className="mt-2 text-xs text-red-500">{errors.emails}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <SafeIcon icon={FiPhone} className="w-4 h-4 inline mr-1" />
              Número de WhatsApp
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              className={`w-full border ${
                errors.whatsapp ? 'border-red-300' : 'border-gray-300'
              } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
              placeholder="+52 55 1234 5678"
            />
            {errors.whatsapp && (
              <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Incluye el código de país (ej. +52 para México)
            </p>
          </div>

          {/* Configuración de usuario */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <SafeIcon icon={FiShield} className="w-4 h-4 mr-2" />
              Configuración de cuenta
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="client">Cliente</option>
                  {/* Solo los administradores pueden crear otros roles */}
                  {currentUserRole === "admin" && (
                    <>
                      <option value="staff">Agente</option>
                      <option value="admin">Administrador</option>
                    </>
                  )}
                </select>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              {/* Grupo (si el rol es cliente) */}
              {(formData.role === 'client' && groups.length > 0) && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <SafeIcon icon={FiUsers} className="w-4 h-4 inline mr-1" />
                    Grupo
                  </label>
                  <select
                    name="groupId"
                    value={formData.groupId}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Sin grupo</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4" />
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Usuario'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;