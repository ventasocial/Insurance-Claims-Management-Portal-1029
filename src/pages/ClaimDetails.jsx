import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockClaims } from '../data/mockData';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowLeft, FiUser, FiMail, FiPhone, FiFileText, FiDownload, FiCheck, FiX, FiMessageSquare } = FiIcons;

const ClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [actionType, setActionType] = useState('');

  const claim = mockClaims.find(c => c.id === parseInt(id));

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
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Verificado':
        return 'bg-blue-100 text-blue-800';
      case 'Enviado a Aseguradora':
        return 'bg-purple-100 text-purple-800';
      case 'Archivado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = () => {
    if (!newStatus) return;
    
    // Simulación de cambio de estatus
    alert(`Estatus cambiado a: ${newStatus}`);
    setNewStatus('');
  };

  const handleDocumentAction = (action, docName) => {
    setActionType(action);
    if (action === 'reject') {
      setShowCommentModal(true);
    } else {
      alert(`Documento "${docName}" ${action === 'approve' ? 'aprobado' : 'rechazado'}`);
    }
  };

  const handleCommentSubmit = () => {
    alert(`Documento rechazado con comentario: ${comment}`);
    setComment('');
    setShowCommentModal(false);
  };

  return (
    <Layout title={`Reclamo #${claim.id}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reclamo #{claim.id}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(claim.status)}`}>
                  {claim.status}
                </span>
                <span className="text-sm text-gray-600">Creado el {claim.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del Asegurado */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiUser} className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-gray-900">Información del Asegurado</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Nombre:</span>
                    <span>{claim.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{claim.customerEmail}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">WhatsApp:</span>
                    <span>{claim.customerWhatsApp}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiFileText} className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Póliza:</span>
                    <span>{claim.policyNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del Reclamo */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiFileText} className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-gray-900">Detalles del Reclamo</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="font-medium text-gray-700">Tipo de reclamo:</span>
                  <p className="text-gray-900">{claim.claimType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Tipo de servicio:</span>
                  <p className="text-gray-900">{claim.serviceType}</p>
                </div>
              </div>
              
              {claim.description && (
                <div>
                  <span className="font-medium text-gray-700">Descripción:</span>
                  <p className="text-gray-900 mt-1">{claim.description}</p>
                </div>
              )}
            </div>

            {/* Documentos */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiFileText} className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-gray-900">Documentos</h3>
              </div>
              
              <div className="space-y-3">
                {claim.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiFileText} className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="text-primary hover:text-primary-dark text-sm">
                        <SafeIcon icon={FiDownload} className="w-4 h-4" />
                      </button>
                      
                      {user?.role === 'admin' && (
                        <>
                          <button
                            onClick={() => handleDocumentAction('approve', doc.name)}
                            className="text-green-600 hover:text-green-700 text-sm"
                          >
                            <SafeIcon icon={FiCheck} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDocumentAction('reject', doc.name)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            <SafeIcon icon={FiX} className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Cambiar Estatus (Solo Admin) */}
            {user?.role === 'admin' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Cambiar Estatus</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nuevo estatus
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Seleccionar estatus</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Verificado">Verificado</option>
                      <option value="Enviado a Aseguradora">Enviado a Aseguradora</option>
                      <option value="Archivado">Archivado</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={handleStatusChange}
                    disabled={!newStatus}
                    className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Actualizar Estatus
                  </button>
                </div>
              </div>
            )}

            {/* Historial de Actividad */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Actividad</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reclamo creado</p>
                    <p className="text-xs text-gray-500">{claim.date}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">En revisión</p>
                    <p className="text-xs text-gray-500">{claim.date}</p>
                  </div>
                </div>
                
                {claim.status !== 'Pendiente' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Estatus: {claim.status}</p>
                      <p className="text-xs text-gray-500">{claim.date}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Comentario */}
        {showCommentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiMessageSquare} className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-gray-900">Rechazar Documento</h3>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentario (opcional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Escribe el motivo del rechazo..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCommentSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClaimDetails;