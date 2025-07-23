import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { mockClaims } from '../data/mockData';
import Filters from '../components/Filters';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiEye, FiCalendar, FiArchive, FiAlertTriangle } = FiIcons;

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
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Verificado': return 'bg-blue-100 text-blue-800';
      case 'Rechazado': return 'bg-red-100 text-red-800';
      case 'Enviado a Aseguradora': return 'bg-purple-100 text-purple-800';
      case 'Archivado': return 'bg-gray-100 text-gray-800';
      case 'Aprobado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
          insurance: claim.insurance,
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
            <div className="divide-y divide-gray-200">
              {filteredClaims.map((claim) => {
                const claimCode = generateClaimCode();
                return (
                <div key={claim.id} className="p-6 hover:bg-gray-50 transition-colors relative">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-8">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          Reclamo - {claimCode}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Asegurado:</span> {claim.customerName}</p>
                        <p><span className="font-medium">Número de Reclamo:</span> REC-{claimCode}</p>
                        <p><span className="font-medium">Tipo:</span> {getClaimTypeDisplay(claim)}</p>
                        <p><span className="font-medium">Servicio:</span> {claim.serviceType}</p>
                        <p><span className="font-medium">Fecha:</span> {claim.date}</p>
                        <p><span className="font-medium">Póliza:</span> {claim.policyNumber}</p>
                      </div>
                    </div>
                    
                    {/* Botones principales de acción */}
                    <div className="flex items-center space-x-2">
                      {/* Botón Complemento - Solo visible para Reembolso Inicial */}
                      {claim.claimType === 'Reembolso' && claim.claimInitialType === 'Inicial' && (
                        <button
                          onClick={() => handleCreateComplement(claim)}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors px-3 py-1 border border-blue-300 rounded-md hover:bg-blue-50"
                        >
                          <SafeIcon icon={FiPlus} className="w-4 h-4" />
                          <span className="text-sm">Complemento</span>
                        </button>
                      )}
                      
                      {/* Botón Ver detalles */}
                      <button
                        onClick={() => navigate(`/reclamo/${claim.id}`)}
                        className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors px-3 py-1 border border-primary rounded-md hover:bg-primary-light hover:bg-opacity-10"
                      >
                        <SafeIcon icon={FiEye} className="w-4 h-4" />
                        <span className="text-sm">Ver detalles</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Botón Archivar - Posicionado en la esquina inferior derecha */}
                  {claim.status !== 'Archivado' && (
                    <button
                      onClick={() => handleArchive(claim)}
                      className="absolute bottom-3 right-3 flex items-center space-x-1 text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-100 text-xs"
                    >
                      <SafeIcon icon={FiArchive} className="w-3 h-3" />
                      <span>Archivar</span>
                    </button>
                  )}
                </div>
              )})}
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