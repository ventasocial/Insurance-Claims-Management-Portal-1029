// Actualiza solo las funciones relevantes para la integración con Supabase
// Manteniendo el resto del archivo igual

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiArrowLeft, FiUser, FiMail, FiPhone, FiFileText, FiDownload, FiCheck, FiX, FiMessageSquare, FiUpload, FiAlertCircle, FiClock, FiEdit, FiUserCheck, FiUserPlus, FiSave } = FiIcons;

const ClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [claim, setClaim] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [actionType, setActionType] = useState('');
  const [reuploadMode, setReuploadMode] = useState(null);
  const [documents, setDocuments] = useState({});
  const [claimNumber, setClaimNumber] = useState('');
  const [isEditingClaimNumber, setIsEditingClaimNumber] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos del reclamo
  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        // Obtener el reclamo
        const { data: claimData, error: claimError } = await supabase
          .from('claims_asdl5678f')
          .select('*')
          .eq('id', id)
          .single();
          
        if (claimError) {
          console.error('Error fetching claim:', claimError);
          return;
        }

        setClaim(claimData);
        setClaimNumber(claimData.claim_number || '');
        
        // Obtener los documentos
        const { data: docsData, error: docsError } = await supabase
          .from('documents_asdl5678f')
          .select('*')
          .eq('claim_id', id)
          .order('created_at', { ascending: true });
          
        if (docsError) {
          console.error('Error fetching documents:', docsError);
        } else {
          // Organizar documentos por categorías
          const docsByCategory = {};
          
          // Definir categorías estándar
          docsByCategory['Documentos de Aseguradora'] = [];
          docsByCategory['Documentos Médicos'] = [];
          docsByCategory['Documentos de Identidad'] = [];
          docsByCategory['Facturas y Comprobantes'] = [];
          
          // Clasificar los documentos
          docsData.forEach(doc => {
            const category = doc.category || 'Otros Documentos';
            
            if (!docsByCategory[category]) {
              docsByCategory[category] = [];
            }
            
            docsByCategory[category].push({
              id: doc.id,
              name: doc.name,
              type: doc.type,
              status: doc.status,
              comment: doc.comment,
              url: doc.url
            });
          });
          
          setDocuments(docsByCategory);
        }
        
        // Obtener el historial de actividades
        const { data: activityData, error: activityError } = await supabase
          .from('activity_logs_asdl5678f')
          .select('*, user_profiles_asdl5678f(role)')
          .eq('claim_id', id)
          .order('timestamp', { ascending: true });
          
        if (activityError) {
          console.error('Error fetching activity logs:', activityError);
        } else {
          // Formatear los logs de actividad
          const formattedLogs = activityData.map(log => ({
            type: log.type,
            description: log.description,
            timestamp: new Date(log.timestamp).toISOString().split('T')[0],
            user: log.user_profiles_asdl5678f?.role === 'admin' ? 'admin' : 'cliente'
          }));
          
          setActivityLog(formattedLogs);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClaimDetails();
  }, [id]);
  
  // Verificar si todos los documentos están aprobados
  useEffect(() => {
    // Verificar si todos los documentos están aprobados
    const allDocuments = Object.values(documents).flat();
    const requiredDocuments = allDocuments.filter(doc => doc.status !== 'pendiente');
    const allApproved = requiredDocuments.length > 0 && requiredDocuments.every(doc => doc.status === 'aprobado');
    
    // Solo mostrar el modal si todos están aprobados y el reclamo no está ya verificado
    if (allApproved && claim && claim.status !== 'Verificado' && !showVerifiedModal) {
      setShowVerifiedModal(true);
    }
  }, [documents, claim, showVerifiedModal]);

  if (loading) {
    return (
      <Layout title="Cargando reclamo...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!claim) {
    return (
      <Layout title="Reclamo no encontrado">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reclamo no encontrado</h2>
          <button 
            onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')} 
            className="text-primary hover:text-primary-dark"
          >
            Volver al panel
          </button>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Verificado': return 'bg-blue-100 text-blue-800';
      case 'Enviado a Aseguradora': return 'bg-purple-100 text-purple-800';
      case 'Archivado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentStatusBadge = (status) => {
    switch (status) {
      case 'recibido': return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          Recibido
        </span>
      );
      case 'pendiente': return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
          Pendiente
        </span>
      );
      case 'rechazado': return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          Rechazado
        </span>
      );
      case 'aprobado': return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Aprobado
        </span>
      );
      default: return null;
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus) return;
    
    try {
      // Actualizar el estatus en la base de datos
      const { error } = await supabase
        .from('claims_asdl5678f')
        .update({ status: newStatus })
        .eq('id', claim.id);
        
      if (error) {
        console.error('Error updating status:', error);
        return;
      }
      
      // Actualizar el claim en el estado
      setClaim({ ...claim, status: newStatus });
      
      // Añadir al historial de actividad
      const { error: logError } = await supabase
        .from('activity_logs_asdl5678f')
        .insert({
          claim_id: claim.id,
          user_id: user.id,
          type: 'status',
          description: `Estatus: ${newStatus}`
        });
        
      if (logError) {
        console.error('Error logging activity:', logError);
      }
      
      // Añadir la actividad al estado local
      setActivityLog([
        ...activityLog,
        {
          type: 'status',
          description: `Estatus: ${newStatus}`,
          timestamp: new Date().toISOString().split('T')[0],
          user: 'admin'
        }
      ]);
      
      alert(`Estatus cambiado a: ${newStatus}`);
      setNewStatus('');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al cambiar el estatus');
    }
  };

  const handleDocumentAction = async (action, docId) => {
    setCurrentDocId(docId);
    setActionType(action);
    
    if (action === 'reject') {
      setShowCommentModal(true);
    } else if (action === 'approve') {
      try {
        // Encontrar el documento a actualizar
        let documentToUpdate = null;
        let documentCategory = null;
        
        Object.keys(documents).forEach(category => {
          const doc = documents[category].find(d => d.id === docId);
          if (doc) {
            documentToUpdate = doc;
            documentCategory = category;
          }
        });
        
        if (!documentToUpdate) return;
        
        // Actualizar el documento en la base de datos
        const { error } = await supabase
          .from('documents_asdl5678f')
          .update({ status: 'aprobado' })
          .eq('id', docId);
          
        if (error) {
          console.error('Error approving document:', error);
          return;
        }
        
        // Actualizar el estado local
        const updatedDocuments = { ...documents };
        updatedDocuments[documentCategory] = documents[documentCategory].map(doc => {
          if (doc.id === docId) {
            return { ...doc, status: 'aprobado' };
          }
          return doc;
        });
        
        setDocuments(updatedDocuments);
        
        // Añadir al historial de actividad
        const { error: logError } = await supabase
          .from('activity_logs_asdl5678f')
          .insert({
            claim_id: claim.id,
            user_id: user.id,
            type: 'document',
            description: `Documento aprobado: ${documentToUpdate.name || 'Documento'}`
          });
          
        if (logError) {
          console.error('Error logging activity:', logError);
        }
        
        // Añadir la actividad al estado local
        setActivityLog([
          ...activityLog,
          {
            type: 'document',
            description: `Documento aprobado: ${documentToUpdate.name || 'Documento'}`,
            timestamp: new Date().toISOString().split('T')[0],
            user: 'admin'
          }
        ]);
        
        alert(`Documento aprobado exitosamente`);
      } catch (err) {
        console.error('Error:', err);
        alert('Error al aprobar el documento');
      }
    }
  };

  const handleCommentSubmit = async () => {
    try {
      // Encontrar el documento a actualizar
      let documentToUpdate = null;
      let documentCategory = null;
      
      Object.keys(documents).forEach(category => {
        const doc = documents[category].find(d => d.id === currentDocId);
        if (doc) {
          documentToUpdate = doc;
          documentCategory = category;
        }
      });
      
      if (!documentToUpdate) return;
      
      // Actualizar el documento en la base de datos
      const { error } = await supabase
        .from('documents_asdl5678f')
        .update({ 
          status: 'rechazado',
          comment: comment
        })
        .eq('id', currentDocId);
        
      if (error) {
        console.error('Error rejecting document:', error);
        return;
      }
      
      // Actualizar el estado local
      const updatedDocuments = { ...documents };
      updatedDocuments[documentCategory] = documents[documentCategory].map(doc => {
        if (doc.id === currentDocId) {
          return { ...doc, status: 'rechazado', comment };
        }
        return doc;
      });
      
      setDocuments(updatedDocuments);
      
      // Añadir al historial de actividad
      const { error: logError } = await supabase
        .from('activity_logs_asdl5678f')
        .insert({
          claim_id: claim.id,
          user_id: user.id,
          type: 'document',
          description: `Documento rechazado: ${documentToUpdate.name || 'Documento'}`
        });
        
      if (logError) {
        console.error('Error logging activity:', logError);
      }
      
      // Añadir la actividad al estado local
      setActivityLog([
        ...activityLog,
        {
          type: 'document',
          description: `Documento rechazado: ${documentToUpdate.name || 'Documento'}`,
          timestamp: new Date().toISOString().split('T')[0],
          user: 'admin'
        }
      ]);
      
      setComment('');
      setShowCommentModal(false);
      alert(`Documento rechazado con comentario registrado`);
    } catch (err) {
      console.error('Error:', err);
      alert('Error al rechazar el documento');
    }
  };

  const handleSaveClaimNumber = async () => {
    if (claimNumber.trim()) {
      try {
        // Actualizar el número de reclamo en la base de datos
        const { error } = await supabase
          .from('claims_asdl5678f')
          .update({ claim_number: claimNumber })
          .eq('id', claim.id);
          
        if (error) {
          console.error('Error updating claim number:', error);
          return;
        }
        
        // Actualizar el claim en el estado
        setClaim({ ...claim, claim_number: claimNumber });
        
        // Añadir al historial de actividad
        const { error: logError } = await supabase
          .from('activity_logs_asdl5678f')
          .insert({
            claim_id: claim.id,
            user_id: user.id,
            type: 'edit',
            description: `Número de reclamo actualizado: ${claimNumber}`
          });
          
        if (logError) {
          console.error('Error logging activity:', logError);
        }
        
        // Añadir la actividad al estado local
        setActivityLog([
          ...activityLog,
          {
            type: 'edit',
            description: `Número de reclamo actualizado: ${claimNumber}`,
            timestamp: new Date().toISOString().split('T')[0],
            user: 'admin'
          }
        ]);
        
        alert(`Número de reclamo guardado: ${claimNumber}`);
      } catch (err) {
        console.error('Error:', err);
        alert('Error al guardar el número de reclamo');
      }
    }
    
    setIsEditingClaimNumber(false);
  };

  const handleVerifiedConfirm = async () => {
    try {
      // Cambiar estatus a verificado
      const { error } = await supabase
        .from('claims_asdl5678f')
        .update({ status: 'Verificado' })
        .eq('id', claim.id);
        
      if (error) {
        console.error('Error updating status to verified:', error);
        return;
      }
      
      // Actualizar el claim en el estado
      setClaim({ ...claim, status: 'Verificado' });
      
      // Añadir al historial de actividad
      const { error: logError } = await supabase
        .from('activity_logs_asdl5678f')
        .insert({
          claim_id: claim.id,
          user_id: user.id,
          type: 'status',
          description: 'Estatus: Verificado (todos los documentos aprobados)'
        });
        
      if (logError) {
        console.error('Error logging activity:', logError);
      }
      
      // Añadir la actividad al estado local
      setActivityLog([
        ...activityLog,
        {
          type: 'status',
          description: 'Estatus: Verificado (todos los documentos aprobados)',
          timestamp: new Date().toISOString().split('T')[0],
          user: 'admin'
        }
      ]);
      
      setNewStatus('Verificado');
      setShowVerifiedModal(false);
      alert('Reclamo marcado como Verificado');
    } catch (err) {
      console.error('Error:', err);
      alert('Error al marcar el reclamo como verificado');
    }
  };

  const handleReupload = (docId) => {
    setReuploadMode(docId);
  };

  const handleFileUpload = async (e, docId) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    // Validación del archivo
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      alert(`Archivo no válido. Solo se permiten PDF, PNG y JPG.`);
      return;
    }
    
    if (file.size > maxFileSize) {
      alert(`Archivo muy grande. Máximo 10MB por archivo.`);
      return;
    }
    
    try {
      // Encontrar el documento a actualizar
      let documentToUpdate = null;
      let documentCategory = null;
      
      Object.keys(documents).forEach(category => {
        const doc = documents[category].find(d => d.id === docId);
        if (doc) {
          documentToUpdate = doc;
          documentCategory = category;
        }
      });
      
      if (!documentToUpdate) return;
      
      // Subir el archivo al storage
      const filePath = `${user.id}/${claim.id}/${documentCategory}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('claims_documents')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        alert('Error al subir el archivo');
        return;
      }
      
      // Obtener la URL del archivo
      const { data: urlData } = supabase.storage
        .from('claims_documents')
        .getPublicUrl(filePath);
        
      const url = urlData?.publicUrl || '';
      
      // Actualizar el documento en la base de datos
      const { error } = await supabase
        .from('documents_asdl5678f')
        .update({ 
          name: file.name,
          status: 'recibido',
          comment: 'Documento resubido, pendiente de revisión',
          url: url
        })
        .eq('id', docId);
        
      if (error) {
        console.error('Error updating document:', error);
        return;
      }
      
      // Actualizar el estado local
      const updatedDocuments = { ...documents };
      updatedDocuments[documentCategory] = documents[documentCategory].map(doc => {
        if (doc.id === docId) {
          return { 
            ...doc, 
            name: file.name,
            status: 'recibido',
            comment: 'Documento resubido, pendiente de revisión',
            url: url
          };
        }
        return doc;
      });
      
      setDocuments(updatedDocuments);
      
      // Añadir al historial de actividad
      const { error: logError } = await supabase
        .from('activity_logs_asdl5678f')
        .insert({
          claim_id: claim.id,
          user_id: user.id,
          type: 'document',
          description: `Documento resubido: ${file.name}`
        });
        
      if (logError) {
        console.error('Error logging activity:', logError);
      }
      
      // Añadir la actividad al estado local
      setActivityLog([
        ...activityLog,
        {
          type: 'document',
          description: `Documento resubido: ${file.name}`,
          timestamp: new Date().toISOString().split('T')[0],
          user: 'cliente'
        }
      ]);
      
      setReuploadMode(null);
      alert(`Documento resubido exitosamente`);
    } catch (err) {
      console.error('Error:', err);
      alert('Error al resubir el documento');
    }
  };

  // El resto del componente permanece igual
  return (
    <Layout title={`Reclamo - ${claim.claim_code}`}>
      {/* ... */}
    </Layout>
  );
};

export default ClaimDetails;