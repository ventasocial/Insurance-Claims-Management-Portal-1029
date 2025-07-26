import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { mockClientGroups } from '../data/mockData';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers, FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiX, FiSave, FiFilter, FiMail, FiPhone, FiUser } = FiIcons;

const ClientGroupManagement = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState(mockClientGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    representativeName: '',
    representativePhone: '',
    representativeEmail: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});

  // Filtrar grupos
  const filteredGroups = groups.filter(group => {
    const matchesSearch = searchTerm ? (
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.representativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.representativeEmail.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true;
    
    const matchesStatus = statusFilter ? group.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddGroup = () => {
    setCurrentGroup(null);
    setFormData({
      name: '',
      avatar: '',
      representativeName: '',
      representativePhone: '',
      representativeEmail: '',
      status: 'active'
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEditGroup = (group) => {
    setCurrentGroup(group);
    setFormData({
      name: group.name,
      avatar: group.avatar,
      representativeName: group.representativeName,
      representativePhone: group.representativePhone,
      representativeEmail: group.representativeEmail,
      status: group.status
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDeleteGroup = (group) => {
    setCurrentGroup(group);
    setShowDeleteModal(true);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "El nombre del grupo es requerido";
    }
    
    if (!formData.representativeName.trim()) {
      errors.representativeName = "El nombre del representante es requerido";
    }
    
    if (!formData.representativeEmail.trim()) {
      errors.representativeEmail = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.representativeEmail)) {
      errors.representativeEmail = "El email no es válido";
    }
    
    if (!formData.representativePhone.trim()) {
      errors.representativePhone = "El teléfono es requerido";
    } else if (!formData.representativePhone.startsWith('+')) {
      errors.representativePhone = "El número debe incluir el código de país (ej. +52)";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (currentGroup) {
      // Actualizar grupo existente
      const updatedGroups = groups.map(group =>
        group.id === currentGroup.id
          ? { ...group, ...formData }
          : group
      );
      setGroups(updatedGroups);
    } else {
      // Crear nuevo grupo
      const newGroupId = Math.max(...groups.map(group => group.id)) + 1;
      const today = new Date().toISOString().split('T')[0];
      const newGroup = {
        id: newGroupId,
        ...formData,
        avatar: formData.avatar || `https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face`,
        createdAt: today,
        clientsCount: 0,
        agentsCount: 0
      };
      setGroups([...groups, newGroup]);
    }
    
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (!currentGroup) return;
    
    const updatedGroups = groups.filter(group => group.id !== currentGroup.id);
    setGroups(updatedGroups);
    setShowDeleteModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    <Layout title="Gestión de Grupos de Clientes">
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
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Grupos de Clientes</h2>
              <p className="text-gray-600">Administra los grupos de clientes y sus representantes</p>
            </div>
          </div>
          <button
            onClick={handleAddGroup}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Nuevo Grupo</span>
          </button>
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
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre de grupo, representante o email..."
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

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={group.avatar}
                    alt={group.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(group.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span>{group.representativeName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <SafeIcon icon={FiMail} className="w-4 h-4" />
                    <span>{group.representativeEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <SafeIcon icon={FiPhone} className="w-4 h-4" />
                    <span>{group.representativePhone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>{group.clientsCount} clientes</span>
                    <span>{group.agentsCount} agentes</span>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditGroup(group)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <SafeIcon icon={FiEdit} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay grupos</h3>
            <p className="text-gray-600 mb-6">No hay grupos que coincidan con los filtros seleccionados</p>
            <button
              onClick={handleAddGroup}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Crear primer grupo
            </button>
          </div>
        )}

        {/* Modal para Agregar/Editar Grupo */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentGroup ? 'Editar Grupo' : 'Nuevo Grupo'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del grupo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.name ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                    placeholder="Nombre del grupo"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL del avatar
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="https://ejemplo.com/avatar.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del representante *
                  </label>
                  <input
                    type="text"
                    name="representativeName"
                    value={formData.representativeName}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.representativeName ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                    placeholder="Nombre completo"
                  />
                  {formErrors.representativeName && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.representativeName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono del representante *
                  </label>
                  <input
                    type="tel"
                    name="representativePhone"
                    value={formData.representativePhone}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.representativePhone ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                    placeholder="+52 55 1234 5678"
                  />
                  {formErrors.representativePhone && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.representativePhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email del representante *
                  </label>
                  <input
                    type="email"
                    name="representativeEmail"
                    value={formData.representativeEmail}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.representativeEmail ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                    placeholder="correo@ejemplo.com"
                  />
                  {formErrors.representativeEmail && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.representativeEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  <span>{currentGroup ? 'Guardar Cambios' : 'Crear Grupo'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Eliminación */}
        {showDeleteModal && currentGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiTrash2} className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-medium text-gray-900">Confirmar Eliminación</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  ¿Estás seguro de que deseas eliminar este grupo? Esta acción no se puede deshacer.
                </p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Grupo:</span> {currentGroup.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Representante:</span> {currentGroup.representativeName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Clientes:</span> {currentGroup.clientsCount}
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
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Eliminar Grupo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClientGroupManagement;