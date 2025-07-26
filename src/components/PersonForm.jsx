import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AvatarUploader from './AvatarUploader';
import EmailManager from './EmailManager';

const { FiUser, FiPhone, FiUsers, FiX, FiSave, FiUserCheck } = FiIcons;

const PersonForm = ({
  person = {},
  onSave,
  onCancel,
  title = "Nueva Persona",
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    emails: [],
    whatsapp: '',
    avatar: '',
    ...person
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (person && Object.keys(person).length > 0) {
      // Si viene un objeto person con datos, usar esos datos
      setFormData({
        firstName: person.firstName || '',
        paternalLastName: person.paternalLastName || '',
        maternalLastName: person.maternalLastName || '',
        emails: person.emails || (person.email ? [{ email: person.email, isPrimary: true, id: Date.now() }] : []),
        whatsapp: person.whatsapp || '',
        avatar: person.avatar || '',
        ...person
      });
    }
  }, [person]);

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

    // Construir el objeto de persona con nombre completo
    const personData = {
      ...formData,
      name: `${formData.firstName} ${formData.paternalLastName} ${formData.maternalLastName || ''}`.trim(),
      // Obtener el email principal
      email: formData.emails.find(e => e.isPrimary)?.email || formData.emails[0]?.email || ''
    };

    onSave(personData);
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
              <span>{isEditing ? 'Guardar Cambios' : 'Guardar Persona'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonForm;