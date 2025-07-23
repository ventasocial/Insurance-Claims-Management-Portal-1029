import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { mockClaims } from '../data/mockData';
import Filters from '../components/Filters';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiEye, FiUsers, FiFileText, FiClock, FiCheck, FiThumbsUp } = FiIcons;

const AdminDashboard = () => {
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
      case 'Aprobado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClaims = mockClaims.filter(claim => {
    const matchesKeyword = filters.keyword
      ? (claim.customerName.toLowerCase().includes(filters.keyword.toLowerCase()) ||
         claim.policyNumber.toLowerCase().includes(filters.keyword.toLowerCase()) ||
         claim.serviceType.toLowerCase().includes(filters.keyword.toLowerCase()))
      : true;

    const matchesStatus = filters.status.value
      ? (filters.status.include
        ? claim.status === filters.status.value
        : claim.status !== filters.status.value)
      : true;

    const matchesType = filters.type.value
      ? (filters.type.include
        ? claim.claimType === filters.type.value
        : claim.claimType !== filters.type.value)
      : true;

    const claimDate = new Date(claim.date);
    const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;

    const matchesDateRange =
      (!dateFrom || claimDate >= dateFrom) &&
      (!dateTo || claimDate <= dateTo);

    return matchesKeyword && matchesStatus && matchesType && matchesDateRange;
  });

  // Calculamos las estadísticas basadas en los reclamos filtrados, no en todos los reclamos
  const stats = {
    total: filteredClaims.length,
    pending: filteredClaims.filter(c => c.status === 'Pendiente').length,
    verified: filteredClaims.filter(c => c.status === 'Verificado').length,
    sent: filteredClaims.filter(c => c.status === 'Enviado a Aseguradora').length,
    approved: filteredClaims.filter(c => c.status === 'Aprobado').length,
  };

  return (
    <Layout title="Panel de Administración">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panel de Administración</h2>
          <p className="text-gray-600">Gestiona todos los reclamos del sistema</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SafeIcon icon={FiFileText} className="h-8 w-8 text-gray-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Reclamos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SafeIcon icon={FiClock} className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SafeIcon icon={FiCheck} className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Verificados</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.verified}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SafeIcon icon={FiUsers} className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Enviados</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.sent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SafeIcon icon={FiThumbsUp} className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Aprobados</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Filters filters={filters} setFilters={setFilters} />

        {/* Claims List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Todos los Reclamos ({filteredClaims.length})
            </h3>
          </div>

          {filteredClaims.length === 0 ? (
            <div className="p-12 text-center">
              <SafeIcon icon={FiFileText} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reclamos</h3>
              <p className="text-gray-600">No hay reclamos que coincidan con los filtros seleccionados</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredClaims.map((claim) => (
                <div key={claim.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          Reclamo #{claim.id}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          <p><span className="font-medium">Cliente:</span> {claim.customerName}</p>
                          <p><span className="font-medium">Email:</span> {claim.customerEmail}</p>
                          <p><span className="font-medium">Tipo:</span> {claim.claimType}</p>
                        </div>
                        <div className="space-y-1">
                          <p><span className="font-medium">Servicio:</span> {claim.serviceType}</p>
                          <p><span className="font-medium">Fecha:</span> {claim.date}</p>
                          <p><span className="font-medium">Póliza:</span> {claim.policyNumber}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/reclamo/${claim.id}`)}
                      className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                    >
                      <SafeIcon icon={FiEye} className="w-5 h-5" />
                      <span>Revisar</span>
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

export default AdminDashboard;