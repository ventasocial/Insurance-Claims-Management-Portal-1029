import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { mockUsers, mockClientGroups, mockClaims } from '../data/mockData';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AvatarUploader from '../components/AvatarUploader';
import EmailManager from '../components/EmailManager';

const { FiUsers, FiUserPlus, FiSearch, FiX, FiCheck, FiArrowLeft, FiUserX, FiFilter, FiUser, FiSettings, FiAlertTriangle, FiTrash, FiRefreshCw, FiSave, FiEdit, FiLock } = FiIcons;

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  const [trashedUsers, setTrashedUsers] = useState([]);
  const [groups, setGroups] = useState(mockClientGroups);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [showTrashCan, setShowTrashCan] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showProtectionModal, setShowProtectionModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTrashedUsers, setSelectedTrashedUsers] = useState([]);
  const [batchAction, setBatchAction] = useState('');
  const [batchValue, setBatchValue] = useState('');
  const [protectedUsers, setProtectedUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    emails: [],
    role: 'client',
    status: 'active',
    groupId: '',
    avatar: '',
    whatsapp: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Función para verificar si un usuario está vinculado a reclamos
  const isUserLinkedToClaims = (userId) => {
    return mockClaims.some(claim => 
      claim.customerEmail === users.find(u => u.id === userId)?.email ||
      claim.assignedAgentId === userId
    );
  };

  // Filtrar usuarios
  useEffect(() => {
    let result = users;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.emails && user.emails.some(emailObj => 
            emailObj.email.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      );
    }

    // Filtrar por rol
    if (roleFilter) {
      result = result.filter(user => user.role === roleFilter);
    }

    // Filtrar por estado
    if (statusFilter) {
      result = result.filter(user => user.status === statusFilter);
    }

    // Filtrar por grupo
    if (groupFilter) {
      if (groupFilter === 'no-group') {
        result = result.filter(user => !user.groupId);
      } else {
        result = result.filter(user => user.groupId === parseInt(groupFilter));
      }
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter, groupFilter]);

  const handleAddUser = () => {
    setCurrentUser(null);
    setNewUser({
      firstName: '',
      paternalLastName: '',
      maternalLastName: '',
      emails: [],
      role: 'client',
      status: 'active',
      groupId: '',
      avatar: '',
      whatsapp: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setNewUser({
      firstName: user.firstName || '',
      paternalLastName: user.paternalLastName || '',
      maternalLastName: user.maternalLastName || '',
      emails: user.emails || (user.email ? [{ email: user.email, isPrimary: true, id: Date.now() }] : []),
      role: user.role,
      status: user.status,
      groupId: user.groupId || '',
      avatar: user.avatar || '',
      whatsapp: user.whatsapp || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEditProfile = () => {
    if (selectedUsers.length !== 1) return;
    
    const userId = selectedUsers[0];
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setCurrentUser(user);
    setNewUser({
      firstName: user.firstName || '',
      paternalLastName: user.paternalLastName || '',
      maternalLastName: user.maternalLastName || '',
      emails: user.emails || (user.email ? [{ email: user.email, isPrimary: true, id: Date.now() }] : []),
      role: user.role,
      status: user.status,
      groupId: user.groupId || '',
      avatar: user.avatar || '',
      whatsapp: user.whatsapp || ''
    });
    setFormErrors({});
    setShowEditProfileModal(true);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectTrashedUser = (userId) => {
    setSelectedTrashedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleSelectAllTrashed = () => {
    if (selectedTrashedUsers.length === trashedUsers.length) {
      setSelectedTrashedUsers([]);
    } else {
      setSelectedTrashedUsers(trashedUsers.map(user => user.id));
    }
  };

  const handleBatchAction = (action) => {
    if (selectedUsers.length === 0) {
      alert('Por favor selecciona al menos un usuario');
      return;
    }

    // Verificar usuarios protegidos para eliminación
    if (action === 'delete') {
      const linkedUsers = selectedUsers.filter(userId => isUserLinkedToClaims(userId));
      if (linkedUsers.length > 0) {
        const linkedUserNames = linkedUsers.map(userId => {
          const user = users.find(u => u.id === userId);
          return user ? user.name : 'Usuario desconocido';
        });
        setProtectedUsers(linkedUserNames);
        setShowProtectionModal(true);
        return;
      }
    }

    setBatchAction(action);
    setBatchValue('');
    setShowBatchModal(true);
  };

  const handleProtectedUsersAction = (action) => {
    setShowProtectionModal(false);
    
    if (action === 'deactivate') {
      // Desactivar usuarios protegidos
      const linkedUserIds = selectedUsers.filter(userId => isUserLinkedToClaims(userId));
      const updatedUsers = users.map(user => {
        if (linkedUserIds.includes(user.id)) {
          return { ...user, status: 'inactive' };
        }
        return user;
      });
      setUsers(updatedUsers);
      
      // Continuar con eliminación de usuarios no protegidos
      const unlinkedUserIds = selectedUsers.filter(userId => !isUserLinkedToClaims(userId));
      if (unlinkedUserIds.length > 0) {
        setSelectedUsers(unlinkedUserIds);
        setBatchAction('delete');
        setShowBatchModal(false);
        setShowTrashModal(true);
      } else {
        setSelectedUsers([]);
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!newUser.firstName.trim()) {
      errors.firstName = "El nombre es requerido";
    }

    if (!newUser.paternalLastName.trim()) {
      errors.paternalLastName = "El apellido paterno es requerido";
    }

    if (!newUser.emails || newUser.emails.length === 0) {
      errors.emails = "Debe tener al menos un email";
    } else {
      // Validar que al menos un email sea válido
      const validEmails = newUser.emails.filter(emailObj => 
        emailObj.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailObj.email)
      );
      if (validEmails.length === 0) {
        errors.emails = "Debe tener al menos un email válido";
      } else {
        // Verificar que no exista ya el email principal (solo para nuevos usuarios)
        const primaryEmail = newUser.emails.find(e => e.isPrimary)?.email || newUser.emails[0]?.email;
        if (!currentUser && primaryEmail && users.some(user => user.email === primaryEmail)) {
          errors.emails = "El email principal ya está registrado";
        }
      }
    }

    if (newUser.whatsapp && !newUser.whatsapp.startsWith('+')) {
      errors.whatsapp = "El número debe incluir el código de país (ej. +52)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const primaryEmail = newUser.emails.find(e => e.isPrimary)?.email || newUser.emails[0]?.email;
    const fullName = `${newUser.firstName} ${newUser.paternalLastName} ${newUser.maternalLastName || ''}`.trim();
    
    const userData = {
      ...newUser,
      name: fullName,
      email: primaryEmail,
      groupId: newUser.groupId ? parseInt(newUser.groupId) : null
    };

    if (currentUser) {
      // Actualizar usuario existente
      const updatedUsers = users.map(user =>
        user.id === currentUser.id ? { ...user, ...userData } : user
      );
      setUsers(updatedUsers);
    } else {
      // Crear nuevo usuario
      const newUserId = Math.max(...users.map(user => user.id)) + 1;
      const today = new Date().toISOString().split('T')[0];
      const newUserComplete = {
        id: newUserId,
        ...userData,
        createdAt: today,
        lastLogin: 'Nunca'
      };
      setUsers([...users, newUserComplete]);
    }

    setShowModal(false);
    setShowEditProfileModal(false);
    setSelectedUsers([]);
  };

  const moveToTrash = () => {
    if (selectedUsers.length === 0) return;

    // Obtener usuarios seleccionados
    const usersToTrash = users.filter(user => selectedUsers.includes(user.id));

    // Añadir fecha de eliminación
    const now = new Date();
    const trashedUsersWithDate = usersToTrash.map(user => ({
      ...user,
      trashedAt: now.toISOString(),
      deleteOn: new Date(now.setDate(now.getDate() + 30)).toISOString() // Eliminar definitivamente en 30 días
    }));

    // Mover a papelera
    setTrashedUsers(prev => [...prev, ...trashedUsersWithDate]);

    // Eliminar de usuarios activos
    const remainingUsers = users.filter(user => !selectedUsers.includes(user.id));
    setUsers(remainingUsers);
    setSelectedUsers([]);
    setShowTrashModal(false);
  };

  const handleRestoreUsers = () => {
    if (selectedTrashedUsers.length === 0) return;

    // Obtener usuarios a restaurar
    const usersToRestore = trashedUsers.filter(user => selectedTrashedUsers.includes(user.id));

    // Restaurar usuarios
    setUsers(prev => [...prev, ...usersToRestore.map(user => {
      // Eliminar propiedades relacionadas con la papelera
      const { trashedAt, deleteOn, ...restoredUser } = user;
      return restoredUser;
    })]);

    // Eliminar de la papelera
    const remainingTrashedUsers = trashedUsers.filter(user => !selectedTrashedUsers.includes(user.id));
    setTrashedUsers(remainingTrashedUsers);
    setSelectedTrashedUsers([]);
    setShowRestoreModal(false);
  };

  const handleDeletePermanently = () => {
    if (selectedTrashedUsers.length === 0) return;

    // Eliminar de la papelera
    const remainingTrashedUsers = trashedUsers.filter(user => !selectedTrashedUsers.includes(user.id));
    setTrashedUsers(remainingTrashedUsers);
    setSelectedTrashedUsers([]);
  };

  const confirmBatchAction = () => {
    if (!batchValue && batchAction !== 'delete') {
      alert('Por favor selecciona un valor');
      return;
    }

    const updatedUsers = users.map(user => {
      if (selectedUsers.includes(user.id)) {
        switch (batchAction) {
          case 'role':
            return { ...user, role: batchValue };
          case 'status':
            return { ...user, status: batchValue };
          case 'group':
            return { ...user, groupId: batchValue ? parseInt(batchValue) : null };
          default:
            return user;
        }
      }
      return user;
    });

    if (batchAction === 'delete') {
      setShowBatchModal(false);
      setShowTrashModal(true);
    } else {
      setUsers(updatedUsers);
      setSelectedUsers([]);
      setShowBatchModal(false);
      setBatchAction('');
      setBatchValue('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailsChange = (emails) => {
    setNewUser(prev => ({
      ...prev,
      emails
    }));
  };

  const handleAvatarChange = (avatarUrl) => {
    setNewUser(prev => ({
      ...prev,
      avatar: avatarUrl
    }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
    setGroupFilter('');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Admin</span>;
      case 'staff': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Agente</span>;
      case 'client': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Cliente</span>;
      default: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{role}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Activo</span>;
      case 'inactive': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Inactivo</span>;
      default: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getGroupName = (groupId) => {
    if (!groupId) return 'Sin grupo';
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : 'Grupo eliminado';
  };

  const getBatchActionTitle = () => {
    switch (batchAction) {
      case 'role': return 'Cambiar Rol en Lote';
      case 'status': return 'Cambiar Estado en Lote';
      case 'group': return 'Cambiar Grupo en Lote';
      case 'delete': return 'Eliminar Usuarios en Lote';
      default: return 'Acción en Lote';
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFullName = () => {
    return `${newUser.firstName} ${newUser.paternalLastName} ${newUser.maternalLastName || ''}`.trim();
  };

  // Limpiar automáticamente la papelera de usuarios con más de 30 días
  useEffect(() => {
    const now = new Date();
    const cleanedTrashedUsers = trashedUsers.filter(user => {
      if (!user.deleteOn) return true;
      const deleteDate = new Date(user.deleteOn);
      return deleteDate > now;
    });

    if (cleanedTrashedUsers.length !== trashedUsers.length) {
      setTrashedUsers(cleanedTrashedUsers);
    }
  }, [trashedUsers]);

  return (
    <Layout title="Gestión de Usuarios">
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
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
              <p className="text-gray-600">Administra los usuarios del sistema</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowTrashCan(!showTrashCan)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showTrashCan ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <SafeIcon icon={FiTrash} className="w-5 h-5" />
              <span>Papelera{trashedUsers.length > 0 ? ` (${trashedUsers.length})` : ''}</span>
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

        {/* Batch Actions - Sticky mejorado */}
        {selectedUsers.length > 0 && (
          <div className="sticky top-0 z-20 py-2 bg-gray-50">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiSettings} className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    {selectedUsers.length} usuario(s) seleccionado(s)
                  </span>
                </div>
                <div className="flex space-x-2">
                  {/* Botón Editar Perfil - Solo visible cuando se selecciona exactamente 1 usuario */}
                  {selectedUsers.length === 1 && (
                    <button
                      onClick={handleEditProfile}
                      className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                    >
                      <SafeIcon icon={FiEdit} className="w-4 h-4" />
                      <span>Editar Perfil</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleBatchAction('role')}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Cambiar Rol
                  </button>
                  <button
                    onClick={() => handleBatchAction('status')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  >
                    Cambiar Estado
                  </button>
                  <button
                    onClick={() => handleBatchAction('group')}
                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Cambiar Grupo
                  </button>
                  <button
                    onClick={() => handleBatchAction('delete')}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Batch Actions for Trash Can - Sticky */}
        {showTrashCan && selectedTrashedUsers.length > 0 && (
          <div className="sticky top-0 z-20 py-2 bg-gray-50">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiSettings} className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">
                    {selectedTrashedUsers.length} usuario(s) en papelera seleccionado(s)
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowRestoreModal(true)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                      <span>Restaurar</span>
                    </div>
                  </button>
                  <button
                    onClick={handleDeletePermanently}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                  >
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiX} className="w-4 h-4" />
                      <span>Eliminar permanentemente</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {!showTrashCan && (
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
                    placeholder="Buscar por nombre o email..."
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

              {/* Filtro por Rol */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="">Todos los roles</option>
                  <option value="admin">Administrador</option>
                  <option value="staff">Agente</option>
                  <option value="client">Cliente</option>
                </select>
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

              {/* Filtro por Grupo */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo
                </label>
                <select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="">Todos los grupos</option>
                  <option value="no-group">Sin grupo</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        {!showTrashCan ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Usuarios ({filteredUsers.length})
              </h3>
            </div>
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <SafeIcon icon={FiUserX} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
                <p className="text-gray-600">No hay usuarios que coincidan con los filtros seleccionados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grupo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Creación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Último Acceso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectUser(user.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </td>
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
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.whatsapp && (
                                <div className="text-xs text-gray-400">{user.whatsapp}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getGroupName(user.groupId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {isUserLinkedToClaims(user.id) && (
                              <div className="flex items-center text-orange-600" title="Usuario vinculado a reclamos">
                                <SafeIcon icon={FiLock} className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Trash Can */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiTrash} className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Papelera ({trashedUsers.length})
                  </h3>
                </div>
                <button
                  onClick={() => setShowTrashCan(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Los usuarios se eliminarán permanentemente después de 30 días en la papelera
              </p>
            </div>
            {trashedUsers.length === 0 ? (
              <div className="p-12 text-center">
                <SafeIcon icon={FiTrash} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">La papelera está vacía</h3>
                <p className="text-gray-600">No hay usuarios en la papelera</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedTrashedUsers.length === trashedUsers.length && trashedUsers.length > 0}
                          onChange={handleSelectAllTrashed}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grupo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Eliminado el
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Se eliminará el
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trashedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectTrashedUser(user.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedTrashedUsers.includes(user.id)}
                            onChange={() => handleSelectTrashedUser(user.id)}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </td>
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
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.whatsapp && (
                                <div className="text-xs text-gray-400">{user.whatsapp}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getGroupName(user.groupId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.trashedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {formatDate(user.deleteOn)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal para Agregar/Editar Usuario */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiUser} className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-medium text-gray-900">
                    {currentUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex justify-center pb-6 border-b border-gray-200">
                  <AvatarUploader
                    currentAvatar={newUser.avatar}
                    onAvatarChange={handleAvatarChange}
                    size="lg"
                  />
                </div>

                {/* Campos de Nombre */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre(s) *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleChange}
                      className={`w-full border ${
                        formErrors.firstName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      placeholder="Nombres"
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido Paterno *
                    </label>
                    <input
                      type="text"
                      name="paternalLastName"
                      value={newUser.paternalLastName}
                      onChange={handleChange}
                      className={`w-full border ${
                        formErrors.paternalLastName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      placeholder="Apellido Paterno"
                    />
                    {formErrors.paternalLastName && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.paternalLastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido Materno
                    </label>
                    <input
                      type="text"
                      name="maternalLastName"
                      value={newUser.maternalLastName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Apellido Materno"
                    />
                  </div>
                </div>

                {/* Previsualización del nombre completo */}
                {(newUser.firstName || newUser.paternalLastName) && (
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Nombre completo:</span>
                      <span className="text-sm text-blue-900">{getFullName()}</span>
                    </div>
                  </div>
                )}

                {/* Gestión de Emails */}
                <div className={formErrors.emails ? 'border border-red-300 rounded-md p-4' : ''}>
                  <EmailManager
                    emails={newUser.emails}
                    onEmailsChange={handleEmailsChange}
                    showPrimarySelector={true}
                  />
                  {formErrors.emails && (
                    <p className="mt-2 text-xs text-red-500">{formErrors.emails}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de WhatsApp
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={newUser.whatsapp}
                    onChange={handleChange}
                    className={`w-full border ${
                      formErrors.whatsapp ? 'border-red-300' : 'border-gray-300'
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                    placeholder="+52 55 1234 5678"
                  />
                  {formErrors.whatsapp && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.whatsapp}</p>
                  )}
                </div>

                {/* Rol */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="client">Cliente</option>
                    <option value="staff">Agente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                {/* Grupo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grupo
                  </label>
                  <select
                    name="groupId"
                    value={newUser.groupId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Sin grupo</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="status"
                    value={newUser.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  <span>{currentUser ? 'Guardar Cambios' : 'Crear Usuario'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para Editar Perfil */}
        {showEditProfileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiEdit} className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-xl font-medium text-gray-900">Editar Perfil de Usuario</h3>
                </div>
                <button
                  onClick={() => setShowEditProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex justify-center pb-6 border-b border-gray-200">
                  <AvatarUploader
                    currentAvatar={newUser.avatar}
                    onAvatarChange={handleAvatarChange}
                    size="lg"
                  />
                </div>

                {/* Campos de Nombre */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre(s) *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleChange}
                      className={`w-full border ${
                        formErrors.firstName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      placeholder="Nombres"
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido Paterno *
                    </label>
                    <input
                      type="text"
                      name="paternalLastName"
                      value={newUser.paternalLastName}
                      onChange={handleChange}
                      className={`w-full border ${
                        formErrors.paternalLastName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      placeholder="Apellido Paterno"
                    />
                    {formErrors.paternalLastName && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.paternalLastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido Materno
                    </label>
                    <input
                      type="text"
                      name="maternalLastName"
                      value={newUser.maternalLastName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="Apellido Materno"
                    />
                  </div>
                </div>

                {/* Previsualización del nombre completo */}
                {(newUser.firstName || newUser.paternalLastName) && (
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Nombre completo:</span>
                      <span className="text-sm text-blue-900">{getFullName()}</span>
                    </div>
                  </div>
                )}

                {/* Gestión de Emails */}
                <div className={formErrors.emails ? 'border border-red-300 rounded-md p-4' : ''}>
                  <EmailManager
                    emails={newUser.emails}
                    onEmailsChange={handleEmailsChange}
                    showPrimarySelector={true}
                  />
                  {formErrors.emails && (
                    <p className="mt-2 text-xs text-red-500">{formErrors.emails}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de WhatsApp
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={newUser.whatsapp}
                    onChange={handleChange}
                    className={`w-full border ${
                      formErrors.whatsapp ? 'border-red-300' : 'border-gray-300'
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                    placeholder="+52 55 1234 5678"
                  />
                  {formErrors.whatsapp && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.whatsapp}</p>
                  )}
                </div>

                {/* Rol */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="client">Cliente</option>
                    <option value="staff">Agente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                {/* Grupo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grupo
                  </label>
                  <select
                    name="groupId"
                    value={newUser.groupId}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Sin grupo</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="status"
                    value={newUser.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Protección de Usuarios */}
        {showProtectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiLock} className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-medium text-gray-900">Usuarios Protegidos</h3>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Los siguientes usuarios están vinculados a reclamos y no pueden ser eliminados:
                </p>
                <div className="bg-orange-50 p-4 rounded-md border border-orange-200 mb-4">
                  <ul className="text-sm text-orange-800 space-y-1">
                    {protectedUsers.map((userName, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <SafeIcon icon={FiAlertTriangle} className="w-4 h-4" />
                        <span>{userName}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-gray-600">
                  ¿Te gustaría desactivar estos usuarios en su lugar? Los usuarios desactivados no podrán acceder al sistema pero mantendrán su vinculación con los reclamos.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowProtectionModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleProtectedUsersAction('deactivate')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Desactivar Usuarios
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Acciones en Lote */}
        {showBatchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={batchAction === 'delete' ? FiTrash : FiSettings} className={`w-6 h-6 ${batchAction === 'delete' ? 'text-red-500' : 'text-blue-500'}`} />
                <h3 className="text-lg font-medium text-gray-900">{getBatchActionTitle()}</h3>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  {batchAction === 'delete' 
                    ? `¿Estás seguro de que deseas mover a la papelera ${selectedUsers.length} usuario(s)?`
                    : `Selecciona el nuevo valor para ${selectedUsers.length} usuario(s) seleccionado(s).`
                  }
                </p>
                {batchAction !== 'delete' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nuevo valor
                    </label>
                    {batchAction === 'role' && (
                      <select
                        value={batchValue}
                        onChange={(e) => setBatchValue(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Seleccionar rol</option>
                        <option value="client">Cliente</option>
                        <option value="staff">Agente</option>
                        <option value="admin">Administrador</option>
                      </select>
                    )}
                    {batchAction === 'status' && (
                      <select
                        value={batchValue}
                        onChange={(e) => setBatchValue(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Seleccionar estado</option>
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                      </select>
                    )}
                    {batchAction === 'group' && (
                      <select
                        value={batchValue}
                        onChange={(e) => setBatchValue(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Sin grupo</option>
                        {groups.map(group => (
                          <option key={group.id} value={group.id}>{group.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Usuarios seleccionados:</span> {selectedUsers.length}
                  </p>
                  <div className="text-xs text-gray-500 max-h-20 overflow-y-auto">
                    {selectedUsers.map(userId => {
                      const user = users.find(u => u.id === userId);
                      return user ? `${user.name} (${user.email})` : '';
                    }).join(', ')}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmBatchAction}
                  className={`px-4 py-2 text-white rounded-md transition-colors ${
                    batchAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {batchAction === 'delete' ? 'Mover a la Papelera' : 'Aplicar Cambios'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Envío a Papelera */}
        {showTrashModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiTrash} className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-medium text-gray-900">Mover a la Papelera</h3>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  ¿Estás seguro de que deseas mover {selectedUsers.length} usuario(s) a la papelera?
                </p>
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm text-yellow-700">
                      Los usuarios se mantendrán en la papelera durante 30 días antes de ser eliminados permanentemente.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Usuarios seleccionados:</span> {selectedUsers.length}
                  </p>
                  <div className="text-xs text-gray-500 max-h-20 overflow-y-auto">
                    {selectedUsers.map(userId => {
                      const user = users.find(u => u.id === userId);
                      return user ? `${user.name} (${user.email})` : '';
                    }).join(', ')}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTrashModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={moveToTrash}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Mover a la Papelera
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Restauración */}
        {showRestoreModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiRefreshCw} className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-medium text-gray-900">Restaurar Usuarios</h3>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  ¿Estás seguro de que deseas restaurar {selectedTrashedUsers.length} usuario(s) de la papelera?
                </p>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-700">
                      Los usuarios seleccionados volverán a estar activos en el sistema.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Usuarios seleccionados:</span> {selectedTrashedUsers.length}
                  </p>
                  <div className="text-xs text-gray-500 max-h-20 overflow-y-auto">
                    {selectedTrashedUsers.map(userId => {
                      const user = trashedUsers.find(u => u.id === userId);
                      return user ? `${user.name} (${user.email})` : '';
                    }).join(', ')}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRestoreModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRestoreUsers}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Restaurar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserManagement;