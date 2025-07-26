import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { mockUsers, mockClientGroups, mockAgentGroupAssignments } from '../data/mockData';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUserCheck, FiArrowLeft, FiUsers, FiEdit, FiCheck, FiX, FiFilter, FiUser, FiSettings } = FiIcons;

const AgentManagement = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [groups, setGroups] = useState(mockClientGroups);
  const [assignments, setAssignments] = useState(mockAgentGroupAssignments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);

  // Filtrar solo agentes (staff)
  useEffect(() => {
    const staffUsers = mockUsers.filter(user => user.role === 'staff');
    setAgents(staffUsers);
  }, []);

  // Filtrar agentes
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm ? (
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true;
    
    const matchesStatus = statusFilter ? agent.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const getAgentGroups = (agentId) => {
    const agentAssignments = assignments.filter(a => a.agentId === agentId);
    return agentAssignments.map(a => {
      const group = groups.find(g => g.id === a.groupId);
      return group ? group.name : 'Grupo eliminado';
    });
  };

  const getAgentGroupsCount = (agentId) => {
    return assignments.filter(a => a.agentId === agentId).length;
  };

  const handleEditAssignments = (agent) => {
    setCurrentAgent(agent);
    const agentAssignments = assignments.filter(a => a.agentId === agent.id);
    setSelectedGroups(agentAssignments.map(a => a.groupId));
    setShowAssignmentModal(true);
  };

  const handleGroupToggle = (groupId) => {
    setSelectedGroups(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };

  const handleSaveAssignments = () => {
    if (!currentAgent) return;

    // Remover asignaciones existentes del agente
    const newAssignments = assignments.filter(a => a.agentId !== currentAgent.id);
    
    // Agregar nuevas asignaciones
    const currentDate = new Date().toISOString().split('T')[0];
    selectedGroups.forEach(groupId => {
      newAssignments.push({
        agentId: currentAgent.id,
        groupId: groupId,
        assignedAt: currentDate
      });
    });

    setAssignments(newAssignments);
    setShowAssignmentModal(false);
    setCurrentAgent(null);
    setSelectedGroups([]);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Activo</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Inactivo</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <Layout title="Gestión de Agentes">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Agentes</h2>
              <p className="text-gray-600">Administra los agentes y sus asignaciones a grupos de clientes</p>
            </div>
          </div>
        </div>

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
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar agente
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              />
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
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Agents List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Agentes ({filteredAgents.length})
            </h3>
          </div>
          
          {filteredAgents.length === 0 ? (
            <div className="p-12 text-center">
              <SafeIcon icon={FiUserCheck} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay agentes</h3>
              <p className="text-gray-600">No hay agentes que coincidan con los filtros seleccionados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grupos Asignados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Acceso
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAgents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                            <SafeIcon icon={FiUserCheck} className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                            <div className="text-sm text-gray-500">{agent.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(agent.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiUsers} className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {getAgentGroupsCount(agent.id)} grupos
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {getAgentGroups(agent.id).slice(0, 2).join(', ')}
                            {getAgentGroups(agent.id).length > 2 && '...'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agent.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditAssignments(agent)}
                          className="text-primary hover:text-primary-dark flex items-center space-x-1"
                        >
                          <SafeIcon icon={FiSettings} className="w-4 h-4" />
                          <span>Gestionar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Asignación de Grupos */}
        {showAssignmentModal && currentAgent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Gestionar Asignaciones
                  </h3>
                  <p className="text-sm text-gray-600">
                    Agente: {currentAgent.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">
                  Seleccionar grupos de clientes:
                </h4>
                
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedGroups.includes(group.id)
                        ? 'border-primary bg-primary-light bg-opacity-10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleGroupToggle(group.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={group.avatar}
                          alt={group.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{group.name}</div>
                          <div className="text-sm text-gray-500">
                            {group.clientsCount} clientes • {group.representativeName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {selectedGroups.includes(group.id) ? (
                          <SafeIcon icon={FiCheck} className="w-5 h-5 text-primary" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAssignments}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  Guardar Asignaciones
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AgentManagement;