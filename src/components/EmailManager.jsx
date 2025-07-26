import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMail, FiPlus, FiX, FiStar, FiEdit2, FiCheck } = FiIcons;

const EmailManager = ({ 
  emails = [], 
  onEmailsChange, 
  disabled = false,
  showPrimarySelector = true 
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingEmail, setEditingEmail] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmail = () => {
    if (!newEmail.trim()) return;
    
    if (!validateEmail(newEmail)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    // Verificar que no exista ya
    if (emails.some(emailObj => emailObj.email.toLowerCase() === newEmail.toLowerCase())) {
      alert('Este email ya está agregado');
      return;
    }

    const newEmailObj = {
      email: newEmail.trim(),
      isPrimary: emails.length === 0, // El primer email es principal por defecto
      id: Date.now()
    };

    onEmailsChange([...emails, newEmailObj]);
    setNewEmail('');
  };

  const removeEmail = (index) => {
    const emailToRemove = emails[index];
    
    // No permitir eliminar si es el único email
    if (emails.length === 1) {
      alert('Debe existir al menos un email');
      return;
    }

    const updatedEmails = emails.filter((_, i) => i !== index);
    
    // Si eliminamos el email principal, hacer principal al primero de la lista
    if (emailToRemove.isPrimary && updatedEmails.length > 0) {
      updatedEmails[0].isPrimary = true;
    }

    onEmailsChange(updatedEmails);
  };

  const setPrimaryEmail = (index) => {
    if (!showPrimarySelector) return;
    
    const updatedEmails = emails.map((emailObj, i) => ({
      ...emailObj,
      isPrimary: i === index
    }));
    
    onEmailsChange(updatedEmails);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingEmail(emails[index].email);
  };

  const saveEdit = () => {
    if (!editingEmail.trim()) {
      cancelEdit();
      return;
    }

    if (!validateEmail(editingEmail)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    // Verificar que no exista ya (excepto el que estamos editando)
    if (emails.some((emailObj, i) => 
      i !== editingIndex && emailObj.email.toLowerCase() === editingEmail.toLowerCase()
    )) {
      alert('Este email ya está agregado');
      return;
    }

    const updatedEmails = emails.map((emailObj, i) => 
      i === editingIndex ? { ...emailObj, email: editingEmail.trim() } : emailObj
    );
    
    onEmailsChange(updatedEmails);
    setEditingIndex(-1);
    setEditingEmail('');
  };

  const cancelEdit = () => {
    setEditingIndex(-1);
    setEditingEmail('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Emails {emails.length === 0 && '*'}
        </label>
        <span className="text-xs text-gray-500">
          {emails.length} email{emails.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Lista de emails existentes */}
      {emails.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {emails.map((emailObj, index) => (
            <div
              key={emailObj.id || index}
              className={`flex items-center justify-between p-3 border rounded-lg ${
                emailObj.isPrimary ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center space-x-2 flex-1">
                <SafeIcon icon={FiMail} className={`w-4 h-4 ${
                  emailObj.isPrimary ? 'text-blue-600' : 'text-gray-500'
                }`} />
                
                {editingIndex === index ? (
                  <input
                    type="email"
                    value={editingEmail}
                    onChange={(e) => setEditingEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    autoFocus
                  />
                ) : (
                  <span className={`flex-1 text-sm ${
                    emailObj.isPrimary ? 'font-medium text-blue-900' : 'text-gray-900'
                  }`}>
                    {emailObj.email}
                  </span>
                )}

                {emailObj.isPrimary && showPrimarySelector && (
                  <span className="flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    <SafeIcon icon={FiStar} className="w-3 h-3 mr-1" />
                    Principal
                  </span>
                )}
              </div>

              {!disabled && (
                <div className="flex items-center space-x-1">
                  {editingIndex === index ? (
                    <>
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Guardar"
                      >
                        <SafeIcon icon={FiCheck} className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Cancelar"
                      >
                        <SafeIcon icon={FiX} className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {showPrimarySelector && !emailObj.isPrimary && emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setPrimaryEmail(index)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Hacer principal"
                        >
                          <SafeIcon icon={FiStar} className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => startEditing(index)}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="Editar"
                      >
                        <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                      </button>
                      
                      {emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmail(index)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Agregar nuevo email */}
      {!disabled && (
        <div className="flex space-x-2">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addEmail()}
            placeholder="Agregar email adicional..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <button
            type="button"
            onClick={addEmail}
            disabled={!newEmail.trim()}
            className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
          </button>
        </div>
      )}

      {emails.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No hay emails registrados. Agrega al menos uno.
        </p>
      )}
    </div>
  );
};

export default EmailManager;