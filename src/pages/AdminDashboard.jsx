// Actualiza solo las funciones relevantes para la integración con Supabase
// Manteniendo el resto del archivo igual

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import Filters from '../components/Filters';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiEye, FiUsers, FiFileText, FiClock, FiCheck, FiThumbsUp } = FiIcons;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    status: { value: '', include: true },
    type: { value: '', include: true },
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const { data, error } = await supabase
          .from('claims_asdl5678f')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching claims:', error);
          return;
        }

        setClaims(data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

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

  const filteredClaims = claims.filter(claim => {
    const matchesKeyword = filters.keyword ? (
      claim.customer_name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      claim.policy_number.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      (claim.service_type && claim.service_type.toLowerCase().includes(filters.keyword.toLowerCase()))
    ) : true;

    const matchesStatus = filters.status.value ? (
      filters.status.include ? claim.status === filters.status.value : claim.status !== filters.status.value
    ) : true;

    const matchesType = filters.type.value ? (
      filters.type.include ? claim.claim_type === filters.type.value : claim.claim_type !== filters.type.value
    ) : true;

    const claimDate = new Date(claim.created_at);
    const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;

    const matchesDateRange = (!dateFrom || claimDate >= dateFrom) && (!dateTo || claimDate <= dateTo);

    return matchesKeyword && matchesStatus && matchesType && matchesDateRange;
  });

  // Calculamos las estadísticas basadas en los reclamos filtrados
  const stats = {
    total: filteredClaims.length,
    pending: filteredClaims.filter(c => c.status === 'Pendiente').length,
    verified: filteredClaims.filter(c => c.status === 'Verificado').length,
    sent: filteredClaims.filter(c => c.status === 'Enviado a Aseguradora').length,
    approved: filteredClaims.filter(c => c.status === 'Aprobado').length,
  };

  if (loading) {
    return (
      <Layout title="Panel de Administración">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // El resto del componente permanece igual
  return (
    <Layout title="Panel de Administración">
      {/* ... */}
    </Layout>
  );
};

export default AdminDashboard;