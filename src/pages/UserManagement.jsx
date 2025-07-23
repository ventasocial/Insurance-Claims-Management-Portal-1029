// Actualiza solo las funciones relevantes para la integración con Supabase
// Manteniendo el resto del archivo igual

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiUsers, FiUserPlus, FiEdit, FiTrash2, FiSearch, FiX, FiCheck, FiArrowLeft, FiUserX, FiFilter, FiUser } = FiIcons;

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'client',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles_asdl5678f')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching users:', error);
          return;
        }

        // Formatear los datos para que coincidan con la estructura esperada
        const formattedUsers = data.map(user => ({
          id: user.id,
          name: `${user.first_name} ${user.paternal_last_name} ${user.maternal_last_name}`.trim(),
          email: user.email,
          role: user.role,
          status: user.status,
          createdAt: new Date(user.created_at).toISOString().split('T')[0],
          lastLogin: user.last_login ? new Date(user.last_login).toISOString().split('T')[0] + ' ' + 
                     new Date(user.last_login).toTimeString().split(' ')[0] : 'Nunca'
        }));

        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrar usuarios
  useEffect(() => {
    let result = users;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.email.toLowerCase().includes(searchTerm.toLowerCase())
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

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleAddUser = () => {
    setCurrentUser(null);
    setNewUser({
      name: '',
      email: '',
      role: 'client',
      status: 'active'
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!newUser.name.trim()) {
      errors.name = "El nombre es requerido";
    }
    
    if (!newUser.email.trim()) {
      errors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = "El email no es válido";
    } else if (!currentUser && users.some(user => user.email === newUser.email)) {
      errors.email = "Este email ya está registrado";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (currentUser) {
        // Extraer nombre y apellidos
        const nameParts = newUser.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const paternalLastName = nameParts[1] || '';
        const maternalLastName = nameParts.slice(2).join(' ') || '';

        // Actualizar usuario existente
        const { error } = await supabase
          .from('user_profiles_asdl5678f')
          .update({
            first_name: firstName,
            paternal_last_name: paternalLastName,
            maternal_last_name: maternalLastName,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status
          })
          .eq('id', currentUser.id);

        if (error) {
          console.error('Error updating user:', error);
          return;
        }

        // Actualizar el estado local
        setUsers(users.map(user => 
          user.id === currentUser.id ? {
            ...user,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status
          } : user
        ));
      } else {
        // Crear nuevo usuario
        // En un entorno real, esto requeriría crear primero un usuario en auth y luego actualizar su perfil
        alert('Para crear un nuevo usuario, por favor utilice la función de registro de Supabase Auth');
      }

      setShowModal(false);
    } catch (err) {
      console.error('Error:', err);
      alert('Error al procesar la solicitud');
    }
  };

  const confirmDelete = async () => {
    if (!currentUser) return;

    try {
      // En un entorno real, esto requeriría eliminar el usuario de auth y su perfil
      alert('La eliminación de usuarios debe hacerse a través del panel de Supabase Auth');
      
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar el usuario');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Admin</span>;
      case 'staff': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Staff</span>;
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

  if (loading) {
    return (
      <Layout title="Gestión de Usuarios">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // El resto del componente permanece igual
  return (
    <Layout title="Gestión de Usuarios">
      {/* ... */}
    </Layout>
  );
};

export default UserManagement;