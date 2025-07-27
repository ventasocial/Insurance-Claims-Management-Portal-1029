import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { mockClaims } from '../data/mockData';
import Filters from '../components/Filters';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiEye, FiCalendar, FiArchive, FiAlertTriangle, FiUser, FiUsers, FiCreditCard, FiFileText, FiClock, FiMapPin, FiPhone } = FiIcons;

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    keyword: '',
    status: { value: '', include: true },
    type: { value: '', include: true },
    dateFrom: '',
    dateTo: ''
  });
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [claimToArchive, setClaimToArchive] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Verificado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rechazado': return 'bg-red-100 text-red-800 border-red-200';
      case 'Enviado a Aseguradora': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Archivado': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Aprobado': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const generateClaimCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getClaimTypeDisplay = (claim) => {
    if (claim.claimType === 'Reembolso') {
      return claim.claimInitialType ? `Reembolso ${claim.claimInitialType}` : 'Reembolso';
    }
    return claim.claimType;
  };

  // Obtener avatar y nombre de personas involucradas
  const getInvolvedPeople = (claim) => {
    const people = [
      // Asegurado afectado (siempre presente)
      {
        role: 'affected',
        name: claim.customerName,
        avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`,
        roleLabel: 'Asegurado Afectado',
        icon: FiUser
      },
      // Asegurado titular (puede ser el mismo que el afectado)
      {
        role: 'policyholder',
        name: "Roberto Méndez García",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        roleLabel: 'Asegurado Titular',
        icon: FiUsers
      },
      // Titular de la cuenta bancaria (solo para reembolsos)
      ...(claim.claimType === 'Reembolso' ? [{
        role: 'accountHolder',
        name: claim.customerName, // Mismo que afectado en este ejemplo
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        roleLabel: 'Titular de Cuenta',
        icon: FiCreditCard
      }] : []),
      // Agente asignado
      {
        role: 'agent',
        name: "Carlos Rodríguez",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
        roleLabel: 'Agente',
        icon: FiUser
      }
    ];

    return people;
  };

  const filteredClaims = mockClaims.filter(claim => {
    const matchesKeyword = filters.keyword ? (
      claim.customerName.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      claim.policyNumber.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      claim.serviceType.toLowerCase().includes(filters.keyword.toLowerCase())
    ) : true;

    const matchesStatus = filters.status.value ? (
      filters.status.include ? claim.status === filters.status.value : claim.status !== filters.status.value
    ) : true;

    const matchesType = filters.type.value ? (
      filters.type.include ? claim.claimType === filters.type.value : claim.claimType !== filters.type.value
    ) : true;

    const claimDate = new Date(claim.date);
    const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;
    const matchesDateRange = (!dateFrom || claimDate >= dateFrom) && (!dateTo || claimDate <= dateTo);

    return matchesKeyword && matchesStatus && matchesType && matchesDateRange;
  });

  const handleArchive = (claim) => {
    setClaimToArchive(claim);
    setShowArchiveModal(true);
  };

  const confirmArchive = () => {
    // Simulación de archivado
    console.log(`Archivando reclamo ${claimToArchive.id}`);
    alert(`Reclamo - ${generateClaimCode()} archivado exitosamente`);
    setShowArchiveModal(false);
    setClaimToArchive(null);
  };

  const handleCreateComplement = (claim) => {
    const claimCode = generateClaimCode();
    // Navegar a crear reclamo con datos pre-cargados incluyendo todos los campos solicitados
    navigate('/crear-reclamo', {
      state: {
        complementData: {
          customerName: claim.customerName,
          customerEmail: claim.customerEmail,
          customerWhatsApp: claim.customerWhatsApp,
          policyNumber: claim.policyNumber,
          insurance: claim.insurance || "GNP", // Aseguramos que se pase el valor de la aseguradora
          claimType: claim.claimType, // Copia el tipo de reclamo original
          claimInitialType: 'Complemento', // Fuerza el tipo de siniestro a Complemento
          previousClaimNumber: `REC-${claimCode}` // Simular número de reclamo de aseguradora
        }
      }
    });
  };

  return (
    <Layout title="Panel del Cliente">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mis Reclamos</h2>
            <p className="text-gray-600">Gestiona y da seguimiento a tus reclamos de seguro</p>
          </div>
          <button
            onClick={() => navigate('/crear-reclamo')}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Nuevo Reclamo</span>
          </button>
        </div>

        {/* Filters */}
        <Filters filters={filters} setFilters={setFilters} />

        {/* Claims List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredClaims.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiCalendar} className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reclamos</h3>
              <p className="text-gray-600 mb-6">No tienes reclamos que coincidan con los filtros seleccionados</p>
              <button
                onClick={() => navigate('/crear-reclamo')}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Crear tu primer reclamo
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredClaims.map((claim) => {
                  const claimCode = generateClaimCode();
                  const involvedPeople = getInvolvedPeople(claim);
                  return (
                    <div
                      key={claim.id}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      {/* Header de la tarjeta con estatus */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              Reclamo - {claimCode}
                            </h3>
                            <p className="text-sm text-gray-600">REC-{claimCode}</p>
                          </div>
                          <div className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(claim.status)}`}>
                            {claim.status}
                          </div>
                        </div>

                        {/* Información principal del reclamo */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm">
                            <SafeIcon icon={FiFileText} className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Tipo:</span>
                            <span className="font-medium text-gray-900">{getClaimTypeDisplay(claim)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Asegurado:</span>
                            <span className="font-medium text-gray-900">{claim.customerName}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Fecha:</span>
                            <span className="font-medium text-gray-900">{claim.date}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Servicio:</span>
                            <span className="font-medium text-gray-900">{claim.serviceType}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <SafeIcon icon={FiFileText} className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Póliza:</span>
                            <span className="font-medium text-gray-900">{claim.policyNumber}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sección de personas involucradas */}
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Personas involucradas</h4>
                        <div className="flex flex-wrap gap-2">
                          {involvedPeople.map((person, index) => (
                            <div key={index} className="flex items-center bg-white rounded-full px-3 py-2 text-xs border border-gray-200">
                              <img
                                src={person.avatar}
                                alt={person.name}
                                className="w-5 h-5 rounded-full object-cover mr-2"
                              />
                              <div className="flex flex-col">
                                <span
                                  className="font-medium text-gray-900 truncate max-w-[100px]"
                                  title={person.name}
                                >
                                  {person.name}
                                </span>
                                <span className="text-gray-500 text-[10px]">
                                  {person.roleLabel}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="p-6 pt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {/* Botón Complemento - Solo visible para Reembolso Inicial */}
                          {claim.claimType === 'Reembolso' && claim.claimInitialType === 'Inicial' && (
                            <button
                              onClick={() => handleCreateComplement(claim)}
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 text-xs font-medium"
                            >
                              <SafeIcon icon={FiPlus} className="w-3 h-3" />
                              <span>Complemento</span>
                            </button>
                          )}

                          {/* Botón Ver detalles */}
                          <button
                            onClick={() => navigate(`/reclamo/${claim.id}`)}
                            className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors px-3 py-2 border border-primary rounded-lg hover:bg-primary-light hover:bg-opacity-10 text-xs font-medium"
                          >
                            <SafeIcon icon={FiEye} className="w-3 h-3" />
                            <span>Ver detalles</span>
                          </button>
                        </div>

                        {/* Botón Archivar */}
                        {claim.status !== 'Archivado' && (
                          <button
                            onClick={() => handleArchive(claim)}
                            className="flex items-center space-x-1 text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 text-xs"
                          >
                            <SafeIcon icon={FiArchive} className="w-3 h-3" />
                            <span>Archivar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal de Confirmación de Archivo */}
        {showArchiveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-medium text-gray-900">Confirmar Archivo</h3>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  ¿Estás seguro de que deseas archivar este reclamo?
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Reclamo:</span> - {generateClaimCode()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Asegurado:</span> {claimToArchive?.customerName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Tipo:</span> {getClaimTypeDisplay(claimToArchive)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Fecha:</span> {claimToArchive?.date}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Esta acción no se puede deshacer. El reclamo se marcará como archivado.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowArchiveModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmArchive}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Archivar Reclamo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClientDashboard;