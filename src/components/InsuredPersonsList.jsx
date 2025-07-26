import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrash2, FiUser } = FiIcons;

// Datos de ejemplo para desarrollo
const mockInsuredPersons = [
  {
    id: '1',
    full_name: 'Juan Pérez García',
    email: 'juan.perez@email.com',
    whatsapp: '+52 55 1234 5678',
    policy_number: 'POL-2024-001',
    insurance: 'GNP',
    created_at: '2024-01-15T10:30:00'
  },
  {
    id: '2',
    full_name: 'María López Hernández',
    email: 'maria.lopez@email.com',
    whatsapp: '+52 55 9876 5432',
    policy_number: 'POL-2024-002',
    insurance: 'AXA',
    created_at: '2024-01-10T14:45:00'
  }
];

const InsuredPersonsList = ({ onSelectPerson }) => {
  const [insuredPersons, setInsuredPersons] = useState(mockInsuredPersons);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    // Simulación de eliminación
    setInsuredPersons(prev => prev.filter(person => person.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Asegurados Guardados</h3>
      {insuredPersons.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay asegurados guardados</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {insuredPersons.map((person) => (
            <div key={person.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <div className="flex justify-between items-start">
                <button
                  onClick={() => onSelectPerson(person)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <SafeIcon icon={FiUser} className="w-5 h-5 text-primary" />
                    <span className="font-medium text-gray-900">{person.full_name}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Email: {person.email}</p>
                    <p>WhatsApp: {person.whatsapp}</p>
                    <p>Póliza: {person.policy_number}</p>
                    <p>Aseguradora: {person.insurance}</p>
                  </div>
                </button>
                <button
                  onClick={() => handleDelete(person.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                >
                  <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsuredPersonsList;