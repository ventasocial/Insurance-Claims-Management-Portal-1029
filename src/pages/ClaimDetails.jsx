import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockClaims } from '../data/mockData';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiDownload,
  FiCheck,
  FiX,
  FiMessageSquare,
  FiUpload,
  FiAlertCircle,
  FiClock,
  FiEdit,
  FiUserCheck,
  FiUserPlus,
  FiSave,
  FiUsers,
  FiCreditCard
} = FiIcons;

const ClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [claimData, setClaimData] = useState(null);

  // Generamos un código de reclamo único de 4 caracteres alfanuméricos
  const generateClaimCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Encontrar el reclamo por ID
  const claim = mockClaims.find(c => c.id === parseInt(id));

  // Crear la estructura de documentos con estados y comentarios
  useEffect(() => {
    if (claim) {
      // Inicializar documentos con categorías
      const docStructure = {
        'Documentos de Aseguradora': [
          {
            id: 'doc-1',
            name: 'Aviso de Accidente o Enfermedad.pdf',
            type: 'Forma de Aseguradora',
            status: 'recibido',
            comment: '',
            url: '#'
          },
          {
            id: 'doc-2',
            name: 'Formato de Reembolso.pdf',
            type: 'Forma de Aseguradora',
            status: 'aprobado',
            comment: 'Documento correcto y completo',
            url: '#'
          }
        ],
        'Documentos Médicos': [
          {
            id: 'doc-3',
            name: 'Informe Médico.pdf',
            type: 'Informe Médico',
            status: 'rechazado',
            comment: 'Falta firma del médico tratante y sello',
            url: '#'
          },
          {
            id: 'doc-4',
            name: 'Receta Médica.jpg',
            type: 'Receta',
            status: 'aprobado',
            comment: '',
            url: '#'
          }
        ],
        'Documentos de Identidad': [
          {
            id: 'doc-5',
            name: 'Identificación Oficial.jpg',
            type: 'Identificación',
            status: 'aprobado',
            comment: '',
            url: '#'
          }
        ],
        'Facturas y Comprobantes': [
          {
            id: 'doc-6',
            name: 'Factura Hospital.pdf',
            type: 'Factura',
            status: 'pendiente',
            comment: 'Documento pendiente de recepción',
            url: '#'
          }
        ]
      };

      setDocuments(docStructure);

      // Inicializar datos del reclamo con información de los diferentes roles
      setClaimData({
        // Información general del reclamo
        policyNumber: claim.policyNumber,
        insurance: claim.insurance || "GNP",
        claimType: claim.claimType,
        serviceType: claim.serviceType,
        date: claim.date,
        description: claim.description,
        status: claim.status,

        // Información de los contactos involucrados
        contacts: {
          // Asegurado afectado (siempre presente)
          affected: {
            name: claim.customerName,
            email: claim.customerEmail,
            whatsapp: claim.customerWhatsApp,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            roles: ["affected"]
          },
          
          // Asegurado titular (puede ser el mismo que el afectado)
          policyholder: {
            name: "Roberto Méndez García",
            email: "roberto.mendez@email.com",
            whatsapp: "+52 55 9988 7766",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
            roles: ["policyholder"]
          },
          
          // Titular de la cuenta bancaria (solo para reembolsos)
          accountHolder: claim.claimType === "Reembolso" ? {
            name: claim.customerName, // Mismo que afectado en este ejemplo
            email: claim.customerEmail,
            whatsapp: claim.customerWhatsApp,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            roles: ["affected", "accountHolder"] // Tiene múltiples roles
          } : null,
          
          // Contacto o gestor
          manager: {
            name: "Ana Martínez Torres",
            email: "ana.martinez@email.com",
            whatsapp: "+52 55 7777 8888",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            roles: ["manager"]
          },
          
          // Agente(s) asignado(s)
          agents: [
            {
              name: "Carlos Rodríguez",
              email: "carlos.rodriguez@seguro.com",
              whatsapp: "+52 55 3333 1111",
              avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
              roles: ["agent"]
            }
          ]
        }
      });

      // Inicializar historial de actividades
      setActivityLog([
        {
          type: 'creation',
          description: 'Reclamo creado',
          timestamp: claim.date,
          user: 'cliente'
        },
        {
          type: 'review',
          description: 'En revisión',
          timestamp: new Date(new Date(claim.date).getTime() + 1000 * 60 * 60).toISOString().split('T')[0],
          user: 'admin'
        },
        {
          type: 'document',
          description: 'Documento subido: Informe Médico',
          timestamp: new Date(new Date(claim.date).getTime() + 1000 * 60 * 60 * 24).toISOString().split('T')[0],
          user: 'cliente'
        },
        {
          type: 'status',
          description: 'Estatus: Pendiente',
          timestamp: new Date(new Date(claim.date).getTime() + 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0],
          user: 'admin'
        }
      ]);
    }
  }, [claim]);

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

  if (!claim || !claimData) {
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
      case 'Aprobado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentStatusBadge = (status) => {
    switch (status) {
      case 'recibido':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            Recibido
          </span>
        );
      case 'pendiente':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
            Pendiente
          </span>
        );
      case 'rechazado':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            Rechazado
          </span>
        );
      case 'aprobado':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Aprobado
          </span>
        );
      default:
        return null;
    }
  };

  const handleStatusChange = () => {
    if (!newStatus) return;

    // Añadir al historial de actividad
    const newActivity = {
      type: 'status',
      description: `Estatus: ${newStatus}`,
      timestamp: new Date().toISOString().split('T')[0],
      user: 'admin'
    };
    setActivityLog([...activityLog, newActivity]);

    // Simulación de cambio de estatus
    alert(`Estatus cambiado a: ${newStatus}`);
    setNewStatus('');
  };

  const handleDocumentAction = (action, docId) => {
    setCurrentDocId(docId);
    setActionType(action);

    if (action === 'reject') {
      setShowCommentModal(true);
    } else if (action === 'approve') {
      // Actualizar estado del documento a aprobado
      Object.keys(documents).forEach(category => {
        const updatedDocs = documents[category].map(doc => {
          if (doc.id === docId) {
            return { ...doc, status: 'aprobado' };
          }
          return doc;
        });
        documents[category] = updatedDocs;
      });

      setDocuments({ ...documents });

      // Añadir al historial de actividad
      const docInfo = Object.values(documents)
        .flat()
        .find(doc => doc.id === docId);
      const newActivity = {
        type: 'document',
        description: `Documento aprobado: ${docInfo?.name || 'Documento'}`,
        timestamp: new Date().toISOString().split('T')[0],
        user: 'admin'
      };
      setActivityLog([...activityLog, newActivity]);

      alert(`Documento aprobado exitosamente`);
    }
  };

  const handleCommentSubmit = () => {
    // Actualizar estado del documento a rechazado y agregar comentario
    Object.keys(documents).forEach(category => {
      const updatedDocs = documents[category].map(doc => {
        if (doc.id === currentDocId) {
          return { ...doc, status: 'rechazado', comment };
        }
        return doc;
      });
      documents[category] = updatedDocs;
    });

    setDocuments({ ...documents });

    // Añadir al historial de actividad
    const docInfo = Object.values(documents)
      .flat()
      .find(doc => doc.id === currentDocId);
    const newActivity = {
      type: 'document',
      description: `Documento rechazado: ${docInfo?.name || 'Documento'}`,
      timestamp: new Date().toISOString().split('T')[0],
      user: 'admin'
    };
    setActivityLog([...activityLog, newActivity]);

    setComment('');
    setShowCommentModal(false);
    alert(`Documento rechazado con comentario registrado`);
  };

  const handleReupload = (docId) => {
    setReuploadMode(docId);
  };

  const handleFileUpload = (e, docId) => {
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

    // Actualizar estado del documento
    Object.keys(documents).forEach(category => {
      const updatedDocs = documents[category].map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            name: file.name,
            status: 'recibido',
            comment: 'Documento resubido, pendiente de revisión'
          };
        }
        return doc;
      });
      documents[category] = updatedDocs;
    });

    setDocuments({ ...documents });

    // Añadir al historial de actividad
    const newActivity = {
      type: 'document',
      description: `Documento resubido: ${file.name}`,
      timestamp: new Date().toISOString().split('T')[0],
      user: 'cliente'
    };
    setActivityLog([...activityLog, newActivity]);

    setReuploadMode(null);
    alert(`Documento resubido exitosamente`);
  };

  const handleVerifiedConfirm = () => {
    // Cambiar estatus a verificado
    setNewStatus('Verificado');

    // Añadir al historial de actividad
    const newActivity = {
      type: 'status',
      description: 'Estatus: Verificado (todos los documentos aprobados)',
      timestamp: new Date().toISOString().split('T')[0],
      user: 'admin'
    };
    setActivityLog([...activityLog, newActivity]);

    // Cerrar el modal y mostrar confirmación
    setShowVerifiedModal(false);
    alert('Reclamo marcado como Verificado');
  };

  const handleSaveClaimNumber = () => {
    if (claimNumber.trim()) {
      alert(`Número de reclamo guardado: ${claimNumber}`);

      // Añadir al historial de actividad
      const newActivity = {
        type: 'edit',
        description: `Número de reclamo actualizado: ${claimNumber}`,
        timestamp: new Date().toISOString().split('T')[0],
        user: 'admin'
      };
      setActivityLog([...activityLog, newActivity]);
    }
    setIsEditingClaimNumber(false);
  };

  // Generar código de reclamo
  const claimCode = generateClaimCode();

  // Función para renderizar un contacto con sus roles
  const renderContact = (contact, title, icon) => {
    if (!contact) return null;
    
    const Icon = icon || FiUser;
    const roles = contact.roles || [];
    
    // Mapeo de roles a etiquetas en español
    const roleLabels = {
      'affected': 'Asegurado Afectado',
      'policyholder': 'Asegurado Titular',
      'accountHolder': 'Titular de Cuenta',
      'manager': 'Gestor',
      'agent': 'Agente'
    };
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <SafeIcon icon={Icon} className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900">
            {title}
            {roles.length > 1 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                (Múltiples roles)
              </span>
            )}
          </h3>
        </div>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {contact.avatar ? (
              <img 
                src={contact.avatar} 
                alt={contact.name} 
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-full">
                <SafeIcon icon={FiUser} className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Nombre:</span>
                  <span>{contact.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span>{contact.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">WhatsApp:</span>
                  <span>{contact.whatsapp}</span>
                </div>
                
                {/* Mostrar roles si tiene más de uno */}
                {roles.length > 1 && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiUsers} className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Roles:</span>
                    <div className="flex flex-wrap gap-1">
                      {roles.map((role) => (
                        <span 
                          key={role}
                          className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {roleLabels[role] || role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout title={`Reclamo - ${claimCode}`}>
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
              <h2 className="text-2xl font-bold text-gray-900">Reclamo - {claimCode}</h2>
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
            {/* Información de Contactos */}
            {renderContact(
              claimData.contacts.affected, 
              "Asegurado Afectado", 
              FiUser
            )}
            
            {renderContact(
              claimData.contacts.policyholder, 
              "Asegurado Titular", 
              FiUsers
            )}
            
            {claimData.contacts.accountHolder && renderContact(
              claimData.contacts.accountHolder, 
              "Titular de la Cuenta Bancaria", 
              FiCreditCard
            )}
            
            {renderContact(
              claimData.contacts.manager, 
              "Contacto o Gestor", 
              FiUserPlus
            )}
            
            {/* Agentes asignados */}
            {claimData.contacts.agents && claimData.contacts.agents.map((agent, index) => (
              renderContact(
                agent,
                `Agente Asignado ${claimData.contacts.agents.length > 1 ? (index + 1) : ''}`,
                FiUserCheck
              )
            ))}

            {/* Información del Reclamo - ACTUALIZADA CON ASEGURADORA Y NÚMERO DE RECLAMO */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiFileText} className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-gray-900">Detalles del Reclamo</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="font-medium text-gray-700">Tipo de reclamo:</span>
                  <p className="text-gray-900">{claimData.claimType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Tipo de servicio:</span>
                  <p className="text-gray-900">{claimData.serviceType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Aseguradora:</span>
                  <p className="text-gray-900">{claimData.insurance}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Número de reclamo:</span>
                  {isEditingClaimNumber ? (
                    <div className="flex items-center mt-1">
                      <input
                        type="text"
                        value={claimNumber}
                        onChange={(e) => setClaimNumber(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full"
                        placeholder="Ingrese número de reclamo"
                      />
                      <button
                        onClick={handleSaveClaimNumber}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <SafeIcon icon={FiSave} className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <p className="text-gray-900">{claimNumber || "No asignado"}</p>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => setIsEditingClaimNumber(true)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <SafeIcon icon={FiEdit} className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {claimData.description && (
                <div>
                  <span className="font-medium text-gray-700">Descripción:</span>
                  <p className="text-gray-900 mt-1">{claimData.description}</p>
                </div>
              )}
            </div>

            {/* Documentos */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiFileText} className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-gray-900">Documentos</h3>
              </div>
              
              {Object.keys(documents).length > 0 ? (
                <div className="space-y-6">
                  {Object.keys(documents).map((category) => (
                    <div key={category} className="space-y-3">
                      <h4 className="text-md font-medium text-gray-800">{category}</h4>
                      <div className="space-y-4">
                        {documents[category].map((doc) => (
                          <div
                            key={doc.id}
                            className={`border rounded-md ${
                              doc.status === 'rechazado'
                                ? 'border-red-200 bg-red-50'
                                : doc.status === 'aprobado'
                                ? 'border-green-200 bg-green-50'
                                : doc.status === 'pendiente'
                                ? 'border-orange-200 bg-orange-50'
                                : 'border-blue-200 bg-blue-50'
                            }`}
                          >
                            <div className="flex items-center justify-between p-3">
                              <div className="flex items-center space-x-3">
                                <SafeIcon icon={FiFileText} className="w-5 h-5 text-gray-500" />
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                    {getDocumentStatusBadge(doc.status)}
                                  </div>
                                  <p className="text-xs text-gray-500">{doc.type}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {doc.status !== 'pendiente' && (
                                  <a
                                    href={doc.url}
                                    className="text-primary hover:text-primary-dark text-sm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <SafeIcon icon={FiDownload} className="w-4 h-4" />
                                  </a>
                                )}
                                
                                {user?.role === 'admin' && doc.status === 'recibido' && (
                                  <>
                                    <button
                                      onClick={() => handleDocumentAction('approve', doc.id)}
                                      className="text-green-600 hover:text-green-700 text-sm"
                                    >
                                      <SafeIcon icon={FiCheck} className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDocumentAction('reject', doc.id)}
                                      className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                      <SafeIcon icon={FiX} className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                
                                {user?.role !== 'admin' && doc.status === 'rechazado' && (
                                  <button
                                    onClick={() => handleReupload(doc.id)}
                                    className="text-primary hover:text-primary-dark text-sm flex items-center space-x-1"
                                  >
                                    <SafeIcon icon={FiUpload} className="w-4 h-4" />
                                    <span className="text-xs">Subir nuevamente</span>
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {doc.comment && (
                              <div className="px-3 py-2 border-t border-gray-200 bg-white rounded-b-md">
                                <div className="flex items-start space-x-2">
                                  <SafeIcon icon={FiMessageSquare} className="w-4 h-4 text-gray-500 mt-0.5" />
                                  <div className="text-sm text-gray-700">
                                    <p className="font-medium text-xs text-gray-500 mb-1">Comentario:</p>
                                    {doc.comment}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {reuploadMode === doc.id && (
                              <div className="p-3 border-t border-gray-200 bg-white rounded-b-md">
                                <div className="flex flex-col space-y-2">
                                  <p className="text-sm text-gray-700">Selecciona un nuevo archivo para subir:</p>
                                  <div className="flex flex-col space-y-2">
                                    <input
                                      type="file"
                                      accept=".pdf,.png,.jpg,.jpeg"
                                      onChange={(e) => handleFileUpload(e, doc.id)}
                                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark"
                                    />
                                    <button
                                      onClick={() => setReuploadMode(null)}
                                      className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <SafeIcon icon={FiAlertCircle} className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay documentos</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No se han encontrado documentos para este reclamo.
                  </p>
                </div>
              )}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nuevo estatus</label>
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

            {/* Historial de Actividad - ACTUALIZADO CON TIMESTAMPS Y USUARIOS */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Actividad</h3>
              <div className="space-y-4">
                {activityLog.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'creation'
                          ? 'bg-primary'
                          : activity.type === 'review'
                          ? 'bg-yellow-400'
                          : activity.type === 'status'
                          ? 'bg-blue-400'
                          : activity.type === 'document'
                          ? 'bg-green-400'
                          : 'bg-gray-400'
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            activity.user === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {activity.user === 'admin' ? 'Admin' : 'Cliente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de Documentos */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Documentos</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Aprobados</span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {Object.values(documents).flat().filter(doc => doc.status === 'aprobado').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiX} className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-700">Rechazados</span>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {Object.values(documents).flat().filter(doc => doc.status === 'rechazado').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiClock} className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700">Por revisar</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {Object.values(documents).flat().filter(doc => doc.status === 'recibido').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiAlertCircle} className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-700">Pendientes</span>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {Object.values(documents).flat().filter(doc => doc.status === 'pendiente').length}
                  </span>
                </div>
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
                  Comentario (requerido)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Explica el motivo del rechazo y qué debe corregirse..."
                  required
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
                  disabled={!comment.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Verificación */}
        {showVerifiedModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-medium text-gray-900">Confirmar Verificación</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Todos los documentos han sido aprobados. ¿Deseas cambiar el estatus del reclamo a "Verificado"?
                </p>
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <p className="text-sm text-green-800">
                    El reclamo está listo para ser enviado a la aseguradora.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowVerifiedModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleVerifiedConfirm}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Confirmar Verificación
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