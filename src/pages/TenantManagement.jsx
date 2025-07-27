import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiUsers, FiArrowLeft, FiPlus, FiSearch, FiX, FiFilter, 
  FiEdit, FiTrash2, FiCheck, FiLock, FiGlobe, FiAlertTriangle,
  FiCreditCard, FiMail, FiRefreshCw, FiDownload
} = FiIcons;

const TenantManagement = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  // Mock data for tenants
  useEffect(() => {
    const mockTenants = [
      { 
        id: 1, 
        name: 'Seguros MX', 
        email: 'admin@segurosmx.com', 
        plan: 'Profesional', 
        status: 'active',
        createdAt: '2024-06-01',
        domain: 'reclamos.segurosmx.com',
        usersCount: 24,
        subscriptionEnds: '2025-06-01',
        contactName: 'Roberto Méndez',
        contactPhone: '+52 55 1234 5678'
      },
      { 
        id: 2, 
        name: 'Aseguradora Global', 
        email: 'admin@aseglobal.com', 
        plan: 'Empresarial', 
        status: 'active',
        createdAt: '2024-05-28',
        domain: 'claims.aseglobal.com',
        usersCount: 85,
        subscriptionEnds: '2025-05-28',
        contactName: 'María Hernández',
        contactPhone: '+52 55 8765 4321'
      },
      { 
        id: 3, 
        name: 'Seguros del Valle', 
        email: 'admin@segurosdelvalle.com', 
        plan: 'Básico', 
        status: 'pending',
        createdAt: '2024-05-25',
        domain: 'pendiente',
        usersCount: 0,
        subscriptionEnds: '2025-05-25',
        contactName: 'Carlos Rodríguez',
        contactPhone: '+52 55 2233 4455'
      },
      { 
        id: 4, 
        name: 'Protección Total', 
        email: 'admin@protecciontotal.com', 
        plan: 'Profesional', 
        status: 'suspended',
        createdAt: '2024-04-15',
        domain: 'reclamos.protecciontotal.com',
        usersCount: 12,
        subscriptionEnds: '2024-07-15',
        contactName: 'Ana Martínez',
        contactPhone: '+52 55 5566 7788'
      },
      { 
        id: 5, 
        name: 'Seguros Unidos', 
        email: 'admin@segurosunidos.com', 
        plan: 'Básico', 
        status: 'active',
        createdAt: '2024-03-20',
        domain: 'app.segurosunidos.com',
        usersCount: 8,
        subscriptionEnds: '2025-03-20',
        contactName: 'Luis Sánchez',
        contactPhone: '+52 55 9900 1122'
      },
    ];

    setTimeout(() => {
      setTenants(mockTenants);
      setLoading(false);
    }, 500);
  }, []);

  // Filter tenants
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = searchTerm 
      ? tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.domain.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter ? tenant.status === statusFilter : true;
    const matchesPlan = planFilter ? tenant.plan === planFilter : true;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleSelectTenant = (tenantId) => {
    setSelectedTenants(prev => {
      if (prev.includes(tenantId)) {
        return prev.filter(id => id !== tenantId);
      } else {
        return [...prev, tenantId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTenants.length === filteredTenants.length) {
      setSelectedTenants([]);
    } else {
      setSelectedTenants(filteredTenants.map(tenant => tenant.id));
    }
  };

  const handleDeleteTenant = (tenant) => {
    setCurrentTenant(tenant);
    setShowDeleteModal(true);
  };

  const confirmDeleteTenant = () => {
    setTenants(prev => prev.filter(t => t.id !== currentTenant.id));
    setShowDeleteModal(false);
    setCurrentTenant(null);
  };

  const handleBulkAction = (action) => {
    if (selectedTenants.length === 0) {
      alert('Por favor selecciona al menos un tenant');
      return;
    }
    
    setBulkAction(action);
    setShowBulkActionModal(true);
  };

  const confirmBulkAction = () => {
    let updatedTenants = [...tenants];
    
    switch (bulkAction) {
      case 'activate':
        updatedTenants = tenants.map(tenant => 
          selectedTenants.includes(tenant.id) ? {...tenant, status: 'active'} : tenant
        );
        break;
      case 'suspend':
        updatedTenants = tenants.map(tenant => 
          selectedTenants.includes(tenant.id) ? {...tenant, status: 'suspended'} : tenant
        );
        break;
      case 'delete':
        updatedTenants = tenants.filter(tenant => !selectedTenants.includes(tenant.id));
        break;
      default:
        break;
    }
    
    setTenants(updatedTenants);
    setSelectedTenants([]);
    setShowBulkActionModal(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPlanFilter('');
  };

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'Básico': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Básico</span>;
      case 'Profesional': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Profesional</span>;
      case 'Empresarial': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Empresarial</span>;
      default: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{plan}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Activo</span>;
      case 'pending': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>;
      case 'suspended': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Suspendido</span>;
      default: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getBulkActionTitle = () => {
    switch (bulkAction) {
      case 'activate': return 'Activar Tenants';
      case 'suspend': return 'Suspender Tenants';
      case 'delete': return 'Eliminar Tenants';
      default: return 'Acción Múltiple';
    }
  };

  return (
    <Layout title="Gestión de Tenants">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/superadmin')}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Tenants</h2>
              <p className="text-gray-600">Administra las cuentas de clientes en la plataforma</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/superadmin/tenants/new')}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Nuevo Tenant</span>
          </button>
        </div>

        {/* Batch Actions - Sticky */}
        {selectedTenants.length > 0 && (
          <div className="sticky top-0 z-20 py-2 bg-gray-50">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiUsers} className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    {selectedTenants.length} tenant(s) seleccionado(s)
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiCheck} className="w-4 h-4" />
                      <span>Activar</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleBulkAction('suspend')}
                    className="px-3 py-1 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiLock} className="w-4 h-4" />
                      <span>Suspender</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      <span>Eliminar</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
            </div>
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-primary flex items-center space-x-1"
            >
              <SafeIcon icon={FiX} className="w-4 h-4" />
              <span>Resetear filtros</span>
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, email o dominio..."
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
            </div>
            
            {/* Filtro por Estado */}
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="pending">Pendiente</option>
                <option value="suspended">Suspendido</option>
              </select>
            </div>
            
            {/* Filtro por Plan */}
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan
              </label>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              >
                <option value="">Todos los planes</option>
                <option value="Básico">Básico</option>
                <option value="Profesional">Profesional</option>
                <option value="Empresarial">Empresarial</option>
              </select>
            </div>

            {/* Acciones adicionales */}
            <div className="w-full md:w-auto flex space-x-2">
              <button 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
                <span>Exportar</span>
              </button>
              <button 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tenants List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando tenants...</p>
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="p-12 text-center">
              <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tenants</h3>
              <p className="text-gray-600">No hay tenants que coincidan con los filtros seleccionados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedTenants.length === filteredTenants.length && filteredTenants.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dominio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuarios
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTenants.map((tenant) => (
                    <tr 
                      key={tenant.id} 
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedTenants.includes(tenant.id)}
                          onChange={() => handleSelectTenant(tenant.id)}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-600">
                              {tenant.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                            <div className="text-sm text-gray-500">{tenant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPlanBadge(tenant.plan)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(tenant.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <SafeIcon icon={FiGlobe} className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-900">{tenant.domain}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tenant.usersCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tenant.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/superadmin/tenants/${tenant.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <SafeIcon icon={FiEdit} className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTenant(tenant)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && currentTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiTrash2} className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-medium text-gray-900">Confirmar Eliminación</h3>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                ¿Estás seguro de que deseas eliminar el tenant <span className="font-medium">{currentTenant.name}</span>?
                Esta acción no se puede deshacer.
              </p>
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    Se eliminarán todos los datos asociados a este tenant, incluyendo usuarios, reclamos y documentos.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Tenant:</span> {currentTenant.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {currentTenant.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Dominio:</span> {currentTenant.domain}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteTenant}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Eliminar Tenant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de acciones en lote */}
      {showBulkActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon 
                icon={bulkAction === 'delete' ? FiTrash2 : bulkAction === 'activate' ? FiCheck : FiLock} 
                className={`w-6 h-6 ${
                  bulkAction === 'delete' ? 'text-red-500' : 
                  bulkAction === 'activate' ? 'text-green-500' : 
                  'text-orange-500'
                }`} 
              />
              <h3 className="text-lg font-medium text-gray-900">{getBulkActionTitle()}</h3>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                ¿Estás seguro de que deseas {
                  bulkAction === 'delete' ? 'eliminar' : 
                  bulkAction === 'activate' ? 'activar' : 
                  'suspender'
                } {selectedTenants.length} tenant(s) seleccionado(s)?
              </p>
              
              {bulkAction === 'delete' && (
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm text-yellow-700">
                      Esta acción eliminará permanentemente los tenants seleccionados y todos sus datos asociados.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Tenants seleccionados:</span> {selectedTenants.length}
                </p>
                <div className="text-xs text-gray-500 max-h-20 overflow-y-auto">
                  {selectedTenants.map(id => {
                    const tenant = tenants.find(t => t.id === id);
                    return tenant ? `${tenant.name} (${tenant.email})` : '';
                  }).join(', ')}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBulkActionModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBulkAction}
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  bulkAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : 
                  bulkAction === 'activate' ? 'bg-green-600 hover:bg-green-700' : 
                  'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TenantManagement;