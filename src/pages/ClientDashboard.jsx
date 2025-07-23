// Actualiza solo las funciones relevantes para la integración con Supabase
// Manteniendo el resto del archivo igual

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import Filters from '../components/Filters';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';

const { FiPlus, FiEye, FiCalendar, FiArchive, FiAlertTriangle } = FiIcons;

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    status: { value: '', include: true },
    type: { value: '', include: true },
    dateFrom: '',
    dateTo: ''
  });
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [claimToArchive, setClaimToArchive] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('claims_asdl5678f')
          .select('*')
          .eq('user_id', user.id)
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
  }, [user]);

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

  const getClaimTypeDisplay = (claim) => {
    if (claim.claim_type === 'Reembolso') {
      return claim.claim_initial_type ? `Reembolso ${claim.claim_initial_type}` : 'Reembolso';
    }
    return claim.claim_type;
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

  const handleArchive = (claim) => {
    setClaimToArchive(claim);
    setShowArchiveModal(true);
  };

  const confirmArchive = async () => {
    try {
      const { error } = await supabase
        .from('claims_asdl5678f')
        .update({ status: 'Archivado' })
        .eq('id', claimToArchive.id);

      if (error) {
        console.error('Error archiving claim:', error);
        return;
      }

      // Actualizar el estado local
      setClaims(claims.map(claim => 
        claim.id === claimToArchive.id ? { ...claim, status: 'Archivado' } : claim
      ));

      // Registrar actividad
      await supabase
        .from('activity_logs_asdl5678f')
        .insert({
          claim_id: claimToArchive.id,
          user_id: user.id,
          type: 'status',
          description: 'Estatus: Archivado'
        });

      alert(`Reclamo - ${claimToArchive.claim_code} archivado exitosamente`);
      setShowArchiveModal(false);
      setClaimToArchive(null);
    } catch (err) {
      console.error('Error:', err);
      alert('Error al archivar el reclamo');
    }
  };

  const handleCreateComplement = (claim) => {
    // Navegar a crear reclamo con datos pre-cargados
    navigate('/crear-reclamo', {
      state: {
        complementData: {
          customerName: claim.customer_name,
          customerEmail: claim.customer_email,
          customerWhatsApp: claim.customer_whatsapp,
          policyNumber: claim.policy_number,
          insurance: claim.insurance,
          claimType: claim.claim_type,
          claimInitialType: 'Complemento',
          previousClaimNumber: claim.claim_number || `REC-${claim.claim_code}`
        }
      }
    });
  };

  if (loading) {
    return (
      <Layout title="Panel del Cliente">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // El resto del componente permanece igual
  return (
    <Layout title="Panel del Cliente">
      {/* ... */}
    </Layout>
  );
};

export default ClientDashboard;