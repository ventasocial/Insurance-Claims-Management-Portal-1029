import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { mockClaims } from '../data/mockData';
import Filters from '../components/Filters';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiEye, FiCalendar } = FiIcons;

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    keyword: '',
    status: { value: '', include: true },
    type: { value: '', include: true },
    dateFrom: '',
    dateTo: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Verificado': return 'bg-blue-100 text-blue-800';
      case 'Enviado a Aseguradora': return 'bg-purple-100 text-purple-800';
      case 'Archivado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClaims = mockClaims.filter(claim => {
    const matchesKeyword = filters.keyword ? 
      (claim.customerName.toLowerCase().includes(filters.keyword.toLowerCase()) ||
       claim.policyNumber.toLowerCase().includes(filters.keyword.toLowerCase()) ||
       claim.serviceType.toLowerCase().includes(filters.keyword.toLowerCase()))
      : true;

    const matchesStatus = filters.status.value ? 
      (filters.status.include ? claim.status === filters.status.value : claim.status !== filters.status.value)
      : true;

    const matchesType = filters.type.value ? 
      (filters.type.include ? claim.claimType === filters.type.value : claim.claimType !== filters.type.value)
      : true;

    const claimDate = new Date(claim.date);
    const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;
    
    const matchesDateRange = 
      (!dateFrom || claimDate >= dateFrom) &&
      (!dateTo || claimDate <= dateTo);

    return matchesKeyword && matchesStatus && matchesType && matchesDateRange;
  });

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
              {filteredClaims.map((claim) => (
                <div key={claim.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          Reclamo #{claim.id}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Tipo:</span> {claim.claimType}</p>
                        <p><span className="font-medium">Servicio:</span> {claim.serviceType}</p>
                        <p><span className="font-medium">Fecha:</span> {claim.date}</p>
                        <p><span className="font-medium">Póliza:</span> {claim.policyNumber}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/reclamo/${claim.id}`)}
                      className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                    >
                      <SafeIcon icon={FiEye} className="w-5 h-5" />
                      <span>Ver detalles</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClientDashboard;