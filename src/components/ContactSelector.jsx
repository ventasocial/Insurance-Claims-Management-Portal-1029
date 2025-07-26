import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiX, FiSearch, FiUsers } = FiIcons;

// Datos de ejemplo para desarrollo
const mockContacts = [
  {
    id: '1',
    name: 'Juan Pérez García',
    email: 'juan.perez@email.com',
    whatsapp: '+52 55 1234 5678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    roles: ['policyholder', 'affected'], // Roles que ha tenido este contacto
    createdBy: 2 // ID del usuario que creó este contacto
  },
  {
    id: '2',
    name: 'María López Hernández',
    email: 'maria.lopez@email.com',
    whatsapp: '+52 55 9876 5432',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=100&h=100&fit=crop&crop=face',
    roles: ['accountHolder'],
    createdBy: 2 // ID del usuario que creó este contacto
  },
  {
    id: '3',
    name: 'Roberto Gómez Sánchez',
    email: 'roberto.gomez@email.com',
    whatsapp: '+52 55 5555 1234',
    avatar: '',
    roles: ['manager'],
    createdBy: 3 // ID de otro usuario
  },
  {
    id: '4',
    name: 'Ana Martínez Torres',
    email: 'ana.martinez@email.com',
    whatsapp: '+52 55 7777 8888',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    roles: ['affected', 'accountHolder'],
    createdBy: 2 // ID del usuario que creó este contacto
  },
  {
    id: '5',
    name: 'Carlos Rodríguez Silva',
    email: 'carlos.rodriguez@email.com',
    whatsapp: '+52 55 5555 1234',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    roles: ['policyholder', 'manager'],
    createdBy: 3 // ID de otro usuario
  }
];

// Mapa de roles a etiquetas en español
const roleLabels = {
  'policyholder': 'Asegurado Titular',
  'affected': 'Asegurado Afectado',
  'accountHolder': 'Titular de Cuenta',
  'manager': 'Gestor'
};

const ContactSelector = ({ onSelect, onClose, role, userId }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar contactos basados en el término de búsqueda y el usuario actual
  const filteredContacts = contacts.filter(contact => 
    (contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.whatsapp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Simular carga de contactos y filtrar por el usuario actual
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Filtrar contactos que pertenecen al usuario actual
      const userContacts = mockContacts.filter(contact => contact.createdBy === userId);
      setContacts(userContacts);
      setLoading(false);
    }, 500);
  }, [userId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiUsers} className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-gray-900">
              Seleccionar {role || 'Contacto'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        {/* Buscador */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar por nombre, email o teléfono..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <SafeIcon icon={FiX} className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Lista de contactos */}
        <div className="space-y-3 mt-4">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-6">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <SafeIcon icon={FiUsers} className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No se encontraron contactos</p>
              <p className="text-sm text-gray-400">Solo se muestran contactos que has guardado previamente</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => onSelect(contact)}
                className="p-3 border border-gray-200 rounded-md hover:border-primary hover:bg-primary-light hover:bg-opacity-10 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10">
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                        <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.email}</p>
                    <p className="text-xs text-gray-500">{contact.whatsapp}</p>
                  </div>
                  {/* Roles que ha tenido este contacto */}
                  {contact.roles && contact.roles.length > 0 && (
                    <div className="flex flex-wrap gap-1 max-w-[120px]">
                      {contact.roles.map((role) => (
                        <span 
                          key={role}
                          className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {roleLabels[role] || role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactSelector;