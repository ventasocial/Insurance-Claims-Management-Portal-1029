import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { mockClaims, mockUsers, mockClientGroups } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import Filters from '../components/Filters';
import UserForm from '../components/UserForm';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiEye, FiCalendar, FiUser, FiUsers, FiCreditCard, FiFileText, FiClock, FiMapPin, FiPhone, FiUserPlus } = FiIcons;

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    keyword: '',
    status: { value: '', include: true },
    type: { value: '', include: true },
    dateFrom: '',
    dateTo: ''
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [groups, setGroups] = useState(mockClientGroups);
  const [assignedUsers, setAssignedUsers] = useState([]);

  // Simulamos que el agente tiene asignados ciertos grupos
  const agentId = user?.id || 0;
  const agentGroups = user?.assignedGroups || [];

  // Filtrar reclamos asignados al agente
  const agentClaims = mockClaims.filter(claim => claim.assignedAgentId === agentId);
  
  // Filtrar usuarios asignados al agente (pertenecen a los grupos que el agente gestiona)
  useEffect(() => {
    const users = mockUsers.filter(user => 
      user.role === 'client' && 
      user.groupId && 
      agentGroups.includes(user.groupId)
    );
    setAssignedUsers(users);
  }, [agentGroups]);

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
      }] : [])
    ];

    return people;
  };

  const filteredClaims = agentClaims.filter(claim => {
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

  const handleAddUser = () => {
    setShowUserModal(true);
  };

  const handleSaveUser = (userData) => {
    // Aquí implementaríamos la lógica para guardar el usuario
    // Para la simulación, mostraríamos un mensaje de éxito
    
    // Asignar automáticamente el usuario al agente actual
    const newUserWithAgent = {
      ...userData,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: agentId,
      lastLogin: 'Nunca'
    };

    alert(`Usuario ${newUserWithAgent.name} creado exitosamente y asignado a tu gestión`);
    setShowUserModal(false);
  };

  return (
    <Layout title="Panel del Agente">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Panel de Gestión</h2>
            <p className="text-gray-600">Gestiona los reclamos y usuarios asignados a ti</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/crear-reclamo')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="w-5 h-5" />
              <span>Nuevo Reclamo</span>
            </button>
            <button
              onClick={handleAddUser}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <SafeIcon icon={FiUserPlus} className="w-5 h-5" />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SafeIcon icon={FiFileText} className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Reclamos Asignados</p>
                <p className="text-2xl font-semibold text-gray-900">{agentClaims.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SafeIcon icon={FiUsers} className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Usuarios Asignados</p>
                <p className="text-2xl font-semibold text-gray-900">{assignedUsers.length}</p>
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
                <p className="text-2xl font-semibold text-gray-900">
                  {agentClaims.filter(c => c.status === 'Pendiente').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SafeIcon icon={FiUsers} className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Grupos Asignados</p>
                <p className="text-2xl font-semibold text-gray-900">{agentGroups.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Filters filters={filters} setFilters={setFilters} />

        {/* Sección de Usuarios Asignados */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Mis Usuarios ({assignedUsers.length})
            </h3>
          </div>
          <div className="p-6">
            {assignedUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUsers} className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes usuarios asignados</h3>
                <p className="text-gray-600 mb-4">Aún no tienes usuarios asignados a tus grupos</p>
                <button
                  onClick={handleAddUser}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
                >
                  <SafeIcon icon={FiUserPlus} className="w-4 h-4" />
                  <span>Registrar nuevo usuario</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignedUsers.map((user) => {
                      const group = groups.find(g => g.id === user.groupId);
                      return (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                                    <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.whatsapp || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {group ? group.name : 'Sin grupo'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => navigate(`/crear-reclamo?userId=${user.id}`)}
                              className="text-primary hover:text-primary-dark"
                            >
                              Crear reclamo
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Claims List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Reclamos Asignados ({filteredClaims.length})
            </h3>
          </div>
          {filteredClaims.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiCalendar} className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reclamos</h3>
              <p className="text-gray-600 mb-6">No tienes reclamos asignados que coincidan con los filtros seleccionados</p>
              <button
                onClick={() => navigate('/crear-reclamo')}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Crear nuevo reclamo
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredClaims.map((claim) => {
                  const claimCode = generateClaimCode();
                  const involvedPeople = getInvolvedPeople(claim);
                  return (
                    <div key={claim.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
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
                                <span className="font-medium text-gray-900 truncate max-w-[100px]" title={person.name}>
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
                        <button
                          onClick={() => navigate(`/reclamo/${claim.id}`)}
                          className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors px-3 py-2 border border-primary rounded-lg hover:bg-primary-light hover:bg-opacity-10 text-xs font-medium w-full justify-center"
                        >
                          <SafeIcon icon={FiEye} className="w-3 h-3" />
                          <span>Ver detalles</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal para crear nuevo usuario */}
        {showUserModal && (
          <UserForm
            onSave={handleSaveUser}
            onCancel={() => setShowUserModal(false)}
            title="Nuevo Usuario"
            currentUserRole="staff"
            groups={groups.filter(group => agentGroups.includes(group.id))}
          />
        )}
      </div>
    </Layout>
  );
};

export default AgentDashboard;