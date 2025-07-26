import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockClaims } from '../data/mockData';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowLeft, FiUser, FiMail, FiPhone, FiFileText, FiDownload, FiCheck, FiX, FiMessageSquare, FiUpload, FiAlertCircle, FiClock, FiEdit, FiUserCheck, FiUserPlus, FiSave, FiUsers, FiCreditCard, FiEye, FiShield, FiCalendar, FiTag, FiMapPin, FiClipboard, FiInfo, FiBuilding } = FiIcons;

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
  const [activeTab, setActiveTab] = useState('affected');

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

  // Crear la estructura de documentos con estados, comentarios e historial
  useEffect(() => {
    if (claim) {
      // Inicializar documentos con categorías e historial de comentarios
      const docStructure = {
        'Documentos de Aseguradora': [
          {
            id: 'doc-1',
            name: 'Aviso de Accidente o Enfermedad.pdf',
            type: 'Forma de Aseguradora',
            status: 'recibido',
            comment: '',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            commentHistory: [
              {
                id: 1,
                comment: 'Documento recibido correctamente',
                status: 'recibido',
                timestamp: '2024-01-16T10:30:00',
                userName: 'Carlos Rodríguez',
                userAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
              }
            ]
          },
          {
            id: 'doc-2',
            name: 'Formato de Reembolso.pdf',
            type: 'Forma de Aseguradora',
            status: 'aprobado',
            comment: 'Documento correcto y completo',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            commentHistory: [
              {
                id: 1,
                comment: 'Documento recibido para revisión',
                status: 'recibido',
                timestamp: '2024-01-16T11:00:00',
                userName: 'Carlos Rodríguez',
                userAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
              },
              {
                id: 2,
                comment: 'Documento correcto y completo',
                status: 'aprobado',
                timestamp: '2024-01-16T14:30:00',
                userName: 'Carlos Rodríguez',
                userAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
              }
            ]
          }
        ],
        'Documentos Médicos': [
          {
            id: 'doc-3',
            name: 'Informe Médico.pdf',
            type: 'Informe Médico',
            status: 'rechazado',
            comment: 'Falta firma del médico tratante y sello',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            commentHistory: [
              {
                id: 1,
                comment: 'Documento recibido para revisión',
                status: 'recibido',
                timestamp: '2024-01-17T09:00:00',
                userName: 'Carlos Rodríguez',
                userAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
              },
              {
                id: 2,
                comment: 'El documento está ilegible, favor de enviar una versión más clara',
                status: 'rechazado',
                timestamp: '2024-01-17T11:15:00',
                userName: 'Carlos Rodríguez',
                userAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
              },
              {
                id: 3,
                comment: 'Documento resubido por el cliente',
                status: 'recibido',
                timestamp: '2024-01-18T08:30:00',
                userName: 'Sistema',
                userAvatar: null
              },
              {
                id: 4,
                comment: 'Falta firma del médico tratante y sello',
                status: 'rechazado',
                timestamp: '2024-01-18T10:45:00',
                userName: 'Carlos Rodríguez',
                userAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
              }
            ]
          },
          {
            id: 'doc-4',
            name: 'Receta Médica.jpg',
            type: 'Receta',
            status: 'aprobado',
            comment: '',
            url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
            commentHistory: [
              {
                id: 1,
                comment: 'Documento recibido y aprobado',
                status: 'aprobado',
                timestamp: '2024-01-16T15:20:00',
                userName: 'Carlos Rodríguez',
                userAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
              }
            ]
          }
        ],
        'Documentos de Identidad': [
          {
            id: 'doc-5',
            name: 'Identificación Oficial.jpg',
            type: 'Identificación',
            status: 'aprobado',
            comment: '',
            url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=600&fit=crop',
            commentHistory: [
              {
                id: 1,
                comment: 'Documento de identidad válido y legible',
                status: 'aprobado',
                timestamp: '2024-01-16T16:00:00',
                userName: 'Carlos Rodríguez',
                userAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
              }
            ]
          }
        ],
        'Facturas y Comprobantes': [
          {
            id: 'doc-6',
            name: 'Factura Hospital.pdf',
            type: 'Factura',
            status: 'pendiente',
            comment: 'Documento pendiente de recepción',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            commentHistory: []
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
            firstName: claim.customerFirstName || '',
            paternalLastName: claim.customerPaternalLastName || '',
            maternalLastName: claim.customerMaternalLastName || '',
            email: claim.customerEmail,
            whatsapp: claim.customerWhatsApp,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            roles: ["affected"]
          },

          // Asegurado titular (puede ser el mismo que el afectado)
          policyholder: {
            name: "Roberto Méndez García",
            firstName: "Roberto",
            paternalLastName: "Méndez",
            maternalLastName: "García",
            email: "roberto.mendez@email.com",
            whatsapp: "+52 55 9988 7766",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
            roles: ["policyholder"]
          },

          // Titular de la cuenta bancaria (solo para reembolsos)
          accountHolder: claim.claimType === "Reembolso" ? {
            name: claim.customerName,
            firstName: claim.customerFirstName || '',
            paternalLastName: claim.customerPaternalLastName || '',
            maternalLastName: claim.customerMaternalLastName || '',
            email: claim.customerEmail,
            whatsapp: claim.customerWhatsApp,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            roles: ["affected", "accountHolder"] // Tiene múltiples roles
          } : null,

          // Contacto o gestor
          manager: {
            name: "Ana Martínez Torres",
            firstName: "Ana",
            paternalLastName: "Martínez",
            maternalLastName: "Torres",
            email: "ana.martinez@email.com",
            whatsapp: "+52 55 7777 8888",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            roles: ["manager"]
          },

          // Agente(s) asignado(s)
          agents: [
            {
              name: "Carlos Rodríguez",
              firstName: "Carlos",
              paternalLastName: "Rodríguez",
              maternalLastName: "",
              email: "carlos.rodriguez@seguro.com",
              whatsapp: "+52 55 3333 1111",
              avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
              roles: ["agent"]
            }
          ]
        }
      });

      // Inicializar historial de actividades con avatares
      setActivityLog([
        {
          type: 'creation',
          description: 'Reclamo creado',
          timestamp: claim.date,
          user: 'cliente',
          userName: claim.customerName,
          userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        },
        {
          type: 'review',
          description: 'En revisión',
          timestamp: new Date(new Date(claim.date).getTime() + 1000 * 60 * 60).toISOString().split('T')[0],
          user: 'admin',
          userName: 'Carlos Rodríguez',
          userAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
        },
        {
          type: 'document',
          description: 'Documento subido: Informe Médico',
          timestamp: new Date(new Date(claim.date).getTime() + 1000 * 60 * 60 * 24).toISOString().split('T')[0],
          user: 'cliente',
          userName: claim.customerName,
          userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        },
        {
          type: 'status',
          description: 'Estatus: Pendiente',
          timestamp: new Date(new Date(claim.date).getTime() + 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0],
          user: 'admin',
          userName: 'Carlos Rodríguez',
          userAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
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
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Verificado': return 'bg-blue-100 text-blue-800';
      case 'Enviado a Aseguradora': return 'bg-purple-100 text-purple-800';
      case 'Archivado': return 'bg-gray-100 text-gray-800';
      case 'Aprobado': return 'bg-green-100 text-green-800';
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

  const handleStatusChange = () => {
    if (!newStatus) return;

    // Añadir al historial de actividad
    const newActivity = {
      type: 'status',
      description: `Estatus: ${newStatus}`,
      timestamp: new Date().toISOString().split('T')[0],
      user: 'admin',
      userName: user?.name || 'Administrador',
      userAvatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
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
      // Actualizar estado del documento a aprobado y agregar al historial
      Object.keys(documents).forEach(category => {
        const updatedDocs = documents[category].map(doc => {
          if (doc.id === docId) {
            const newHistoryEntry = {
              id: (doc.commentHistory?.length || 0) + 1,
              comment: 'Documento aprobado',
              status: 'aprobado',
              timestamp: new Date().toISOString(),
              userName: user?.name || 'Administrador',
              userAvatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            };
            return {
              ...doc,
              status: 'aprobado',
              comment: 'Documento aprobado',
              commentHistory: [...(doc.commentHistory || []), newHistoryEntry]
            };
          }
          return doc;
        });
        documents[category] = updatedDocs;
      });
      setDocuments({...documents});

      // Añadir al historial de actividad
      const docInfo = Object.values(documents)
        .flat()
        .find(doc => doc.id === docId);
      const newActivity = {
        type: 'document',
        description: `Documento aprobado: ${docInfo?.name || 'Documento'}`,
        timestamp: new Date().toISOString().split('T')[0],
        user: 'admin',
        userName: user?.name || 'Administrador',
        userAvatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      };
      setActivityLog([...activityLog, newActivity]);
      alert(`Documento aprobado exitosamente`);
    }
  };

  const handleCommentSubmit = () => {
    // Actualizar estado del documento a rechazado y agregar comentario al historial
    Object.keys(documents).forEach(category => {
      const updatedDocs = documents[category].map(doc => {
        if (doc.id === currentDocId) {
          const newHistoryEntry = {
            id: (doc.commentHistory?.length || 0) + 1,
            comment: comment,
            status: 'rechazado',
            timestamp: new Date().toISOString(),
            userName: user?.name || 'Administrador',
            userAvatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
          };
          return {
            ...doc,
            status: 'rechazado',
            comment: comment,
            commentHistory: [...(doc.commentHistory || []), newHistoryEntry]
          };
        }
        return doc;
      });
      documents[category] = updatedDocs;
    });
    setDocuments({...documents});

    // Añadir al historial de actividad
    const docInfo = Object.values(documents)
      .flat()
      .find(doc => doc.id === currentDocId);
    const newActivity = {
      type: 'document',
      description: `Documento rechazado: ${docInfo?.name || 'Documento'}`,
      timestamp: new Date().toISOString().split('T')[0],
      user: 'admin',
      userName: user?.name || 'Administrador',
      userAvatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
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

    // Actualizar estado del documento y agregar al historial
    Object.keys(documents).forEach(category => {
      const updatedDocs = documents[category].map(doc => {
        if (doc.id === docId) {
          const newHistoryEntry = {
            id: (doc.commentHistory?.length || 0) + 1,
            comment: 'Documento resubido, pendiente de revisión',
            status: 'recibido',
            timestamp: new Date().toISOString(),
            userName: 'Sistema',
            userAvatar: null
          };
          return {
            ...doc,
            name: file.name,
            status: 'recibido',
            comment: 'Documento resubido, pendiente de revisión',
            commentHistory: [...(doc.commentHistory || []), newHistoryEntry]
          };
        }
        return doc;
      });
      documents[category] = updatedDocs;
    });
    setDocuments({...documents});

    // Añadir al historial de actividad
    const newActivity = {
      type: 'document',
      description: `Documento resubido: ${file.name}`,
      timestamp: new Date().toISOString().split('T')[0],
      user: 'cliente',
      userName: claim.customerName,
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
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
      user: 'admin',
      userName: user?.name || 'Administrador',
      userAvatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
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
        user: 'admin',
        userName: user?.name || 'Administrador',
        userAvatar: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      };
      setActivityLog([...activityLog, newActivity]);
    }
    setIsEditingClaimNumber(false);
  };

  // Generar código de reclamo
  const claimCode = generateClaimCode();

  // Función para renderizar la previsualización de un documento
  const renderDocumentPreview = (doc) => {
    const isImage = doc.type.startsWith('image/') || doc.name.toLowerCase().includes('.jpg') || doc.name.toLowerCase().includes('.png');
    const isPdf = doc.type === 'application/pdf' || doc.name.toLowerCase().includes('.pdf');

    return (
      <div className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
        {isImage ? (
          <img
            src={doc.url}
            alt={doc.name}
            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.open(doc.url, '_blank')}
          />
        ) : isPdf ? (
          <div
            className="w-full h-full flex items-center justify-center bg-red-50 cursor-pointer hover:bg-red-100 transition-colors"
            onClick={() => window.open(doc.url, '_blank')}
          >
            <SafeIcon icon={FiFileText} className="w-8 h-8 text-red-500" />
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => window.open(doc.url, '_blank')}
          >
            <SafeIcon icon={FiFileText} className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
    );
  };

  // Función para obtener los contactos disponibles para los tabs
  const getContactTabs = () => {
    const tabs = [];
    if (claimData.contacts.affected) {
      tabs.push({
        key: 'affected',
        label: 'Asegurado Afectado',
        contact: claimData.contacts.affected,
        icon: FiUser,
        color: 'blue'
      });
    }
    if (claimData.contacts.policyholder) {
      tabs.push({
        key: 'policyholder',
        label: 'Asegurado Titular',
        contact: claimData.contacts.policyholder,
        icon: FiUsers,
        color: 'green'
      });
    }
    if (claimData.contacts.accountHolder && claimData.claimType === 'Reembolso') {
      tabs.push({
        key: 'accountHolder',
        label: 'Titular de Cuenta',
        contact: claimData.contacts.accountHolder,
        icon: FiCreditCard,
        color: 'purple'
      });
    }
    if (claimData.contacts.manager) {
      tabs.push({
        key: 'manager',
        label: 'Gestor',
        contact: claimData.contacts.manager,
        icon: FiUserPlus,
        color: 'orange'
      });
    }
    if (claimData.contacts.agents && claimData.contacts.agents.length > 0) {
      claimData.contacts.agents.forEach((agent, index) => {
        tabs.push({
          key: `agent-${index}`,
          label: `Agente${claimData.contacts.agents.length > 1 ? ` ${index + 1}` : ''}`,
          contact: agent,
          icon: FiUserCheck,
          color: 'indigo'
        });
      });
    }
    return tabs;
  };

  const contactTabs = getContactTabs();

  // Función para renderizar el contenido de un tab de contacto
  const renderContactTab = (contact, color = 'blue') => {
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      green: 'text-green-600 bg-green-50 border-green-200',
      purple: 'text-purple-600 bg-purple-50 border-purple-200',
      orange: 'text-orange-600 bg-orange-50 border-orange-200',
      indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    };

    return (
      <div className={`p-6 rounded-lg border ${colorClasses[color] || colorClasses.blue}`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {contact.avatar ? (
              <img src={contact.avatar} alt={contact.name} className="h-16 w-16 rounded-full object-cover" />
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
                  <span className="font-medium text-gray-700">Nombre:</span>
                  <span className="text-gray-900">{contact.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-900">{contact.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">WhatsApp:</span>
                  <span className="text-gray-900">{contact.whatsapp}</span>
                </div>
                {/* Mostrar roles si tiene más de uno */}
                {contact.roles && contact.roles.length > 1 && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiUsers} className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">Roles:</span>
                    <div className="flex flex-wrap gap-1">
                      {contact.roles.map((role) => {
                        const roleLabels = {
                          'affected': 'Asegurado Afectado',
                          'policyholder': 'Asegurado Titular',
                          'accountHolder': 'Titular de Cuenta',
                          'manager': 'Gestor',
                          'agent': 'Agente'
                        };
                        return (
                          <span key={role} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {roleLabels[role] || role}
                          </span>
                        );
                      })}
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

  // Función para renderizar el historial de comentarios de un documento
  const renderCommentHistory = (commentHistory) => {
    if (!commentHistory || commentHistory.length === 0) {
      return null;
    }

    return (
      <div className="px-3 py-2 border-t border-gray-200 bg-white rounded-b-md">
        <div className="mb-2">
          <h5 className="text-xs font-medium text-gray-600 mb-2">Historial de Comentarios:</h5>
        </div>
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {commentHistory.map((entry) => (
            <div key={entry.id} className="flex items-start space-x-2 text-xs">
              <div className="flex-shrink-0">
                {entry.userAvatar ? (
                  <img src={entry.userAvatar} alt={entry.userName} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">
                    <SafeIcon icon={FiUser} className="w-3 h-3 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-700">{entry.userName}</span>
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    entry.status === 'aprobado' 
                      ? 'bg-green-100 text-green-700' 
                      : entry.status === 'rechazado' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                  }`}>
                    {entry.status}
                  </span>
                  <span className="text-gray-500">
                    {new Date(entry.timestamp).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-gray-600 text-xs break-words">{entry.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Determinar si el usuario puede cambiar el estado
  const canChangeStatus = user?.role === 'admin' || user?.role === 'staff';

  return (
    <Layout title={`Reclamo - ${claimCode}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : '/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
              <span className="text-sm font-medium">Volver</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reclamo - {claimCode}</h1>
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
            {/* Información del Reclamo - Movido arriba con iconos */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <SafeIcon icon={FiClipboard} className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900">Detalles del Reclamo</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiTag} className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Tipo de reclamo:</span>
                      <p className="text-base text-gray-900">{claimData.claimType}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Tipo de servicio:</span>
                      <p className="text-base text-gray-900">{claimData.serviceType}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiBuilding} className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Aseguradora:</span>
                      <p className="text-base text-gray-900">{claimData.insurance}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiShield} className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Póliza:</span>
                      <p className="text-base text-gray-900">{claimData.policyNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-3 mb-3">
                  <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Fecha de creación:</span>
                    <p className="text-base text-gray-900">{claimData.date}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiInfo} className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Número de reclamo:</span>
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
                        <p className="text-base text-gray-900">{claimNumber || "No asignado"}</p>
                        {(user?.role === 'admin' || user?.role === 'staff') && (
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
              </div>
              {claimData.description && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <SafeIcon icon={FiMessageSquare} className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Descripción:</span>
                      <p className="text-base text-gray-900 mt-1">{claimData.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Información de Contactos con Tabs */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <SafeIcon icon={FiUsers} className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900">Personas Involucradas</h2>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  {contactTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.key 
                          ? 'border-primary text-primary' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.contact.avatar ? (
                        <img src={tab.contact.avatar} alt={tab.contact.name} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <SafeIcon icon={tab.icon} className="w-5 h-5" />
                      )}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Contenido del Tab Activo */}
              <div className="mt-6">
                {contactTabs.map((tab) => (
                  activeTab === tab.key && (
                    <div key={tab.key}>
                      {renderContactTab(tab.contact, tab.color)}
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Documentos */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <SafeIcon icon={FiFileText} className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900">Documentos</h2>
              </div>
              {Object.keys(documents).length > 0 ? (
                <div className="space-y-6">
                  {Object.keys(documents).map((category) => (
                    <div key={category} className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-800">{category}</h3>
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
                              <div className="flex items-center space-x-3 flex-1">
                                {/* Previsualización del documento */}
                                {renderDocumentPreview(doc)}
                                <div className="flex-1">
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
                                {(user?.role === 'admin' || user?.role === 'staff') && doc.status === 'recibido' && (
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
                                {user?.role !== 'admin' && user?.role !== 'staff' && doc.status === 'rechazado' && (
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

                            {/* Historial de comentarios */}
                            {renderCommentHistory(doc.commentHistory)}

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

          {/* Panel Lateral con posición sticky */}
          <div className="space-y-6">
            <div className="sticky top-20">
              {/* Cambiar Estatus (Solo Admin y Staff) */}
              {canChangeStatus && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Estatus</h3>
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

              {/* Resumen de Documentos */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Documentos</h3>
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

              {/* Historial de Actividad */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Actividad</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {activityLog.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {activity.userAvatar ? (
                          <img
                            src={activity.userAvatar}
                            alt={activity.userName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                            <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            activity.user === 'admin' || activity.user === 'staff'
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {activity.userName}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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