import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ContactSelector from '../components/ContactSelector';
import DocumentPreview from '../components/DocumentPreview';
import PersonForm from '../components/PersonForm';
import AvatarUploader from '../components/AvatarUploader';

const { FiUser, FiMail, FiPhone, FiFileText, FiUpload, FiX, FiAlertCircle, FiCheck, FiUsers, FiCreditCard, FiEye, FiEdit, FiUserPlus } = FiIcons;

const CreateClaim = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const complementData = location.state?.complementData;
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    // Datos generales del reclamo
    policyNumber: '',
    insurance: '',
    claimType: '',
    serviceTypes: [],
    isTraumaOrthopedicSurgery: false,
    claimInitialType: '',
    previousClaimNumber: '',
    description: '',
    signatureType: 'electronic',

    // Contactos con sus roles
    contacts: {
      policyholder: null, // Asegurado Titular
      affected: null, // Asegurado Afectado
      accountHolder: null, // Titular de la cuenta bancaria
      manager: user ? {
        // El gestor siempre es el usuario actual
        firstName: user.firstName,
        paternalLastName: user.paternalLastName,
        maternalLastName: user.maternalLastName,
        name: user.name,
        emails: user.emails || [{ email: user.email, isPrimary: true, id: Date.now() }],
        email: user.email,
        whatsapp: user.whatsapp || '',
        avatar: user.avatar || '',
        userId: user.id
      } : null
    },

    // Flags para "Mismo que..."
    isSameAsAffected: {
      policyholder: false,
      accountHolder: false,
    },

    // Flags para "Yo soy..."
    isCurrentUser: {
      affected: false,
      policyholder: false,
      accountHolder: false
    },

    // Guardar contactos
    saveContacts: true
  });

  // Documentos por sección
  const [documents, setDocuments] = useState({
    section1: [],
    section2: [],
    section3: [],
    // Nuevos campos para documentos de identidad por persona
    identificationDocs: {
      affected: [],
      policyholder: [],
      accountHolder: []
    }
  });

  const [loading, setLoading] = useState(false);
  const [whatsappError, setWhatsappError] = useState('');
  const [showContactSelector, setShowContactSelector] = useState(false);
  const [currentContactRole, setCurrentContactRole] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // Pre-cargar datos si viene de complemento
  useEffect(() => {
    if (complementData) {
      const affected = {
        firstName: complementData.customerFirstName || '',
        paternalLastName: complementData.customerPaternalLastName || '',
        maternalLastName: complementData.customerMaternalLastName || '',
        name: complementData.customerName,
        email: complementData.customerEmail,
        emails: [{ email: complementData.customerEmail, isPrimary: true, id: Date.now() }],
        whatsapp: complementData.customerWhatsApp,
      };
      setFormData(prev => ({
        ...prev,
        policyNumber: complementData.policyNumber || '',
        insurance: complementData.insurance || '',
        claimType: complementData.claimType || '',
        claimInitialType: complementData.claimInitialType || '',
        previousClaimNumber: complementData.previousClaimNumber || '',
        contacts: {
          ...prev.contacts,
          affected: affected,
          policyholder: affected, // Asumimos que son la misma persona inicialmente
          accountHolder: affected, // Asumimos que son la misma persona inicialmente
        },
        isSameAsAffected: {
          policyholder: true,
          accountHolder: true
        }
      }));
    }
  }, [complementData]);

  // Generar iniciales para el avatar
  const getInitials = (person) => {
    if (!person) return '';
    const firstName = person.firstName || '';
    const paternalLastName = person.paternalLastName || '';
    
    if (firstName && paternalLastName) {
      return (firstName[0] + paternalLastName[0]).toUpperCase();
    } else if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    } else if (person.name) {
      const nameParts = person.name.trim().split(/\s+/);
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      } else {
        return nameParts[0].substring(0, 2).toUpperCase();
      }
    }
    return '';
  };

  // Generar color de fondo para avatar basado en el nombre
  const getAvatarColor = (person) => {
    const name = person?.name || person?.firstName || 'Usuario';
    const colors = [
      '#F87171', // Rojo
      '#FB923C', // Naranja
      '#FBBF24', // Amarillo
      '#34D399', // Verde
      '#60A5FA', // Azul
      '#A78BFA', // Púrpura
      '#F472B6', // Rosa
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // No permitir cambios en insurance y previousClaimNumber si es un complemento
    if (complementData && (name === 'insurance' || name === 'previousClaimNumber')) {
      return;
    }

    if (name === 'customerWhatsApp') {
      if (value && !value.startsWith('+')) {
        setWhatsappError('El número debe incluir el código de país (ej. +52)');
      } else {
        setWhatsappError('');
      }
    }

    setFormData(prev => {
      if (name === 'claimType') {
        return {
          ...prev,
          [name]: value,
          serviceTypes: [],
          isTraumaOrthopedicSurgery: false,
          claimInitialType: '',
          previousClaimNumber: ''
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleContactChange = (role, field, value) => {
    setFormData(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [role]: {
          ...prev.contacts[role],
          [field]: value
        }
      }
    }));

    // Validar WhatsApp
    if (field === 'whatsapp') {
      if (value && !value.startsWith('+')) {
        setWhatsappError('El número debe incluir el código de país (ej. +52)');
      } else {
        setWhatsappError('');
      }
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSameAsAffectedChange = (role) => {
    setFormData(prev => {
      const newIsSameAsAffected = {
        ...prev.isSameAsAffected,
        [role]: !prev.isSameAsAffected[role]
      };

      const newContacts = { ...prev.contacts };
      if (newIsSameAsAffected[role]) {
        // Si se marca como mismo que afectado, copiar datos
        newContacts[role] = { ...prev.contacts.affected };
      } else {
        // Si se desmarca, limpiar los datos
        newContacts[role] = null;
      }

      // Resetear también el flag de "Yo soy"
      const newIsCurrentUser = {
        ...prev.isCurrentUser,
        [role]: false
      };

      return {
        ...prev,
        isSameAsAffected: newIsSameAsAffected,
        contacts: newContacts,
        isCurrentUser: newIsCurrentUser
      };
    });
  };

  const handleCurrentUserChange = (role) => {
    setFormData(prev => {
      const newIsCurrentUser = {
        ...prev.isCurrentUser,
        [role]: !prev.isCurrentUser[role]
      };

      const newContacts = { ...prev.contacts };
      const newIsSameAsAffected = {
        ...prev.isSameAsAffected,
        [role]: false
      };

      if (newIsCurrentUser[role]) {
        // Si se marca como el usuario actual, copiar datos del usuario
        newContacts[role] = {
          firstName: user.firstName,
          paternalLastName: user.paternalLastName,
          maternalLastName: user.maternalLastName,
          name: user.name,
          email: user.email,
          emails: user.emails || [{ email: user.email, isPrimary: true, id: Date.now() }],
          whatsapp: user.whatsapp || '',
          avatar: user.avatar || ''
        };
      } else {
        // Si se desmarca, limpiar los datos
        newContacts[role] = null;
      }

      return {
        ...prev,
        isCurrentUser: newIsCurrentUser,
        contacts: newContacts,
        isSameAsAffected: newIsSameAsAffected
      };
    });
  };

  const handleServiceTypeChange = (service) => {
    setFormData(prev => {
      const currentServices = [...prev.serviceTypes];
      const serviceIndex = currentServices.indexOf(service);
      
      if (serviceIndex === -1) {
        currentServices.push(service);
      } else {
        currentServices.splice(serviceIndex, 1);
      }

      if (service === 'Cirugía' && serviceIndex !== -1) {
        return {
          ...prev,
          serviceTypes: currentServices,
          isTraumaOrthopedicSurgery: false
        };
      }

      return {
        ...prev,
        serviceTypes: currentServices
      };
    });
  };

  const handleSignatureTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      signatureType: type
    }));
  };

  const getServiceOptions = () => {
    switch (formData.claimType) {
      case 'Reembolso':
        return [
          { emoji: '🏥', name: 'Hospital' },
          { emoji: '👨‍⚕️', name: 'Honorarios Médicos' },
          { emoji: '🔬', name: 'Estudios de Laboratorio e Imagenología' },
          { emoji: '💊', name: 'Medicamentos' },
          { emoji: '🧠', name: 'Terapia/Rehabilitación' }
        ];
      case 'Programación':
        return [
          { emoji: '💊', name: 'Medicamentos' },
          { emoji: '🧠', name: 'Terapia/Rehabilitación' },
          { emoji: '🔪', name: 'Cirugía' }
        ];
      default:
        return [];
    }
  };

  const handleFileUpload = (e, section, fieldName) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5; // Máximo 5 archivos por campo

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`Archivo ${file.name} no es válido. Solo se permiten PDF, PNG y JPG.`);
        return false;
      }
      if (file.size > maxFileSize) {
        alert(`Archivo ${file.name} es muy grande. Máximo 10MB por archivo.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > maxFiles) {
      alert(`Solo se permiten máximo ${maxFiles} archivos por campo.`);
      validFiles.splice(maxFiles);
    }

    const newDocuments = validFiles.map(file => {
      const url = URL.createObjectURL(file);
      return {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        url: url,
        fieldName: fieldName // Guardamos a qué campo pertenece este documento
      };
    });

    setDocuments(prev => ({
      ...prev,
      [section]: [...prev[section], ...newDocuments]
    }));
  };

  // Nueva función para manejar la carga de documentos de identificación por persona
  const handleIdentificationUpload = (e, role) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 2; // Máximo 2 archivos para identificación

    const currentFiles = documents.identificationDocs[role] || [];
    
    // Verificar si ya hay 2 archivos
    if (currentFiles.length >= maxFiles) {
      alert(`Ya has subido el máximo de ${maxFiles} archivos para la identificación. Elimina uno para subir otro.`);
      return;
    }

    // Calcular cuántos archivos más se pueden agregar
    const remainingSlots = maxFiles - currentFiles.length;
    
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`Archivo ${file.name} no es válido. Solo se permiten PDF, PNG y JPG.`);
        return false;
      }
      if (file.size > maxFileSize) {
        alert(`Archivo ${file.name} es muy grande. Máximo 10MB por archivo.`);
        return false;
      }
      return true;
    }).slice(0, remainingSlots);

    if (validFiles.length === 0) return;

    const newDocuments = validFiles.map(file => {
      const url = URL.createObjectURL(file);
      return {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        url: url,
        fieldName: `Identificación Oficial`
      };
    });

    setDocuments(prev => ({
      ...prev,
      identificationDocs: {
        ...prev.identificationDocs,
        [role]: [...currentFiles, ...newDocuments]
      }
    }));
  };

  // Función para eliminar documento
  const removeDocument = (id, section) => {
    setDocuments(prev => {
      const updatedSection = prev[section].filter(doc => doc.id !== id);
      // Revocar URL para evitar fugas de memoria
      const removedDoc = prev[section].find(doc => doc.id === id);
      if (removedDoc && removedDoc.url) {
        URL.revokeObjectURL(removedDoc.url);
      }
      return {
        ...prev,
        [section]: updatedSection
      };
    });
  };

  // Función para eliminar documento de identificación
  const removeIdentificationDocument = (id, role) => {
    setDocuments(prev => {
      const updatedDocs = prev.identificationDocs[role].filter(doc => doc.id !== id);
      // Revocar URL para evitar fugas de memoria
      const removedDoc = prev.identificationDocs[role].find(doc => doc.id === id);
      if (removedDoc && removedDoc.url) {
        URL.revokeObjectURL(removedDoc.url);
      }
      return {
        ...prev,
        identificationDocs: {
          ...prev.identificationDocs,
          [role]: updatedDocs
        }
      };
    });
  };

  const openDocumentPreview = (doc) => {
    setPreviewDocument(doc);
    setShowPreview(true);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Función para obtener los campos de la Sección 1
  const getSection1Fields = () => {
    if (formData.insurance === 'GNP' && formData.claimType === 'Reembolso') {
      return [
        'Aviso de Accidente o Enfermedad',
        'Formato de Reembolso',
        'Formato Único de Información Bancaria'
      ];
    }
    if (formData.insurance === 'GNP' && formData.claimType === 'Programación') {
      return ['Aviso de Accidente o Enfermedad'];
    }
    if (formData.insurance === 'AXA' && formData.claimType === 'Reembolso') {
      return ['Solicitud de Reembolso'];
    }
    if (formData.insurance === 'AXA' && formData.claimType === 'Programación') {
      return ['Solicitud de Programación'];
    }
    return [];
  };

  // Función para obtener los campos de la Sección 3
  const getSection3Fields = () => {
    const fields = [];

    // Cirugía de Traumatología, Ortopedia y Neurología (GNP)
    if (
      formData.insurance === 'GNP' &&
      formData.claimType === 'Programación' &&
      formData.serviceTypes.includes('Cirugía') &&
      formData.isTraumaOrthopedicSurgery
    ) {
      fields.push('Forma de Cirugía de Traumatología, Ortopedia y Neurología');
      fields.push('Interpretación de Estudios que corroboren el diagnóstico');
    }
    // Cirugía general (GNP o AXA)
    else if (
      (formData.insurance === 'GNP' || formData.insurance === 'AXA') &&
      formData.claimType === 'Programación' &&
      formData.serviceTypes.includes('Cirugía')
    ) {
      fields.push('Interpretación de Estudios que corroboren el diagnóstico');
    }

    // Medicamentos - Programación
    if (
      (formData.insurance === 'GNP' || formData.insurance === 'AXA') &&
      formData.claimType === 'Programación' &&
      formData.serviceTypes.includes('Medicamentos')
    ) {
      fields.push('Recetas de Medicamentos incluyendo dosis y periodo de administración');
      if (!fields.includes('Interpretación de Estudios que corroboren el diagnóstico (opcional)')) {
        fields.push('Interpretación de Estudios que corroboren el diagnóstico (opcional)');
      }
    }

    // Rehabilitaciones - Programación
    if (
      (formData.insurance === 'GNP' || formData.insurance === 'AXA') &&
      formData.claimType === 'Programación' &&
      formData.serviceTypes.includes('Terapia/Rehabilitación')
    ) {
      fields.push('Bitácora del Médico Indicando: Terapias, Sesiones y Tiempos');
      if (!fields.includes('Interpretación de Estudios que corroboren el diagnóstico')) {
        fields.push('Interpretación de Estudios que corroboren el diagnóstico');
      }
    }

    // Reembolso - Hospital
    if (
      (formData.insurance === 'GNP' || formData.insurance === 'AXA') &&
      formData.claimType === 'Reembolso' &&
      formData.serviceTypes.includes('Hospital')
    ) {
      fields.push('Facturas de Hospitales');
    }

    // Reembolso - Honorarios Médicos
    if (
      (formData.insurance === 'GNP' || formData.insurance === 'AXA') &&
      formData.claimType === 'Reembolso' &&
      formData.serviceTypes.includes('Honorarios Médicos')
    ) {
      fields.push('Facturas de Honorarios Médicos');
    }

    // Reembolso - Medicamentos
    if (
      (formData.insurance === 'GNP' || formData.insurance === 'AXA') &&
      formData.claimType === 'Reembolso' &&
      formData.serviceTypes.includes('Medicamentos')
    ) {
      fields.push('Facturas de Medicamentos');
      fields.push('Recetas de Medicamentos incluyendo dosis y periodo de administración');
    }

    // Reembolso - Estudios
    if (
      (formData.insurance === 'GNP' || formData.insurance === 'AXA') &&
      formData.claimType === 'Reembolso' &&
      formData.serviceTypes.includes('Estudios de Laboratorio e Imagenología')
    ) {
      fields.push('Facturas de Estudios de Laboratorio e Imagenología');
      fields.push('Estudios de Laboratorio e Imagenología');
    }

    // Nueva regla: Terapia/Rehabilitación para Reembolso
    if (
      (formData.insurance === 'GNP' || formData.insurance === 'AXA') &&
      formData.claimType === 'Reembolso' &&
      formData.serviceTypes.includes('Terapia/Rehabilitación')
    ) {
      fields.push('Facturas de Terapias');
      fields.push('Recetas de Terapias');
      fields.push('Carnet de Asistencia a Terapias');
    }

    return [...new Set(fields)]; // Eliminar duplicados
  };

  const openContactSelector = (role) => {
    setCurrentContactRole(role);
    setShowContactSelector(true);
  };

  const handleSelectContact = (contact) => {
    setFormData(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [currentContactRole]: contact
      },
      isSameAsAffected: {
        ...prev.isSameAsAffected,
        [currentContactRole]: false // Desactivar el checkbox de "mismo que afectado"
      },
      isCurrentUser: {
        ...prev.isCurrentUser,
        [currentContactRole]: false // Desactivar el checkbox de "yo soy"
      }
    }));
    setShowContactSelector(false);
  };

  const handleCreateNewContact = (role) => {
    setCurrentContactRole(role);
    setEditingContact(null);
    setShowPersonForm(true);
  };

  const handleEditContact = (role) => {
    setCurrentContactRole(role);
    setEditingContact(formData.contacts[role]);
    setShowPersonForm(true);
  };

  const handleSavePerson = (personData) => {
    // Aquí verificaríamos si ya existe un usuario con ese email
    // Por ahora, simulamos la creación/vinculación
    
    setFormData(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [currentContactRole]: personData
      },
      isSameAsAffected: {
        ...prev.isSameAsAffected,
        [currentContactRole]: false
      },
      isCurrentUser: {
        ...prev.isCurrentUser,
        [currentContactRole]: false
      }
    }));
    
    setShowPersonForm(false);
    setEditingContact(null);
  };

  const validateForm = () => {
    // Validar que al menos exista el contacto afectado
    if (!formData.contacts.affected || !formData.contacts.affected.name || !formData.contacts.affected.email) {
      alert('Debe ingresar los datos del Asegurado Afectado');
      return false;
    }

    // Validar WhatsApp
    if (
      (formData.contacts.affected?.whatsapp && !formData.contacts.affected.whatsapp.startsWith('+')) ||
      (formData.contacts.policyholder?.whatsapp && !formData.contacts.policyholder.whatsapp.startsWith('+')) ||
      (formData.contacts.accountHolder?.whatsapp && !formData.contacts.accountHolder.whatsapp.startsWith('+'))
    ) {
      setWhatsappError('El número debe incluir el código de país (ej. +52)');
      return false;
    }

    // Validar campos requeridos del formulario
    if (!formData.policyNumber || !formData.insurance || !formData.claimType || !formData.description) {
      alert('Debe completar todos los campos obligatorios');
      return false;
    }

    // Validar que si es tipo Reembolso tenga un titular de cuenta bancaria
    if (formData.claimType === 'Reembolso' && !formData.contacts.accountHolder) {
      alert('Para reclamos de tipo Reembolso, debe especificar el Titular de la Cuenta Bancaria');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Aquí iría la lógica para guardar los contactos vinculados al usuario actual
      if (formData.saveContacts) {
        // Simulación de guardado exitoso de contactos y vinculación
        console.log('Guardando contactos:', formData.contacts);
        // Ejemplo de cómo se guardarían y vincularían los contactos:
        // 1. Crear/actualizar contactos
        // 2. Vincular contactos con el usuario actual
        console.log('Vinculando contactos con el usuario:', user.id);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Reclamo creado exitosamente');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el reclamo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener documentos agrupados por campo
  const getDocumentsByField = (section, fieldName) => {
    return documents[section].filter(doc => doc.fieldName === fieldName);
  };

  const section1Fields = getSection1Fields();
  const section3Fields = getSection3Fields();

  const showSection2ForReembolso = (formData.insurance === 'GNP' || formData.insurance === 'AXA') && formData.claimType === 'Reembolso';
  const showSection2ForProgramacion = (formData.insurance === 'GNP' || formData.insurance === 'AXA') && formData.claimType === 'Programación';
  const showSection2 = showSection2ForReembolso || showSection2ForProgramacion;

  const contactRoleLabels = {
    affected: 'Asegurado Afectado',
    policyholder: 'Asegurado Titular',
    accountHolder: 'Titular de la Cuenta Bancaria'
  };

  const contactRoleIcons = {
    affected: FiUser,
    policyholder: FiUsers,
    accountHolder: FiCreditCard
  };

  // Colores de fondo para cada tipo de contacto
  const contactRoleColors = {
    affected: 'bg-blue-50 border-l-4 border-blue-500',
    policyholder: 'bg-green-50 border-l-4 border-green-500',
    accountHolder: 'bg-purple-50 border-l-4 border-purple-500'
  };

  const renderContactForm = (role, isRequired = true, disabled = false) => {
    const contact = formData.contacts[role] || {};
    const roleLabel = contactRoleLabels[role];
    const RoleIcon = contactRoleIcons[role];
    const bgColorClass = contactRoleColors[role] || 'bg-white border-l-4 border-gray-300';
    
    // No mostrar el titular de cuenta si no es reembolso
    if (role === 'accountHolder' && formData.claimType !== 'Reembolso') {
      return null;
    }

    // Para los roles que no son el afectado, mostrar opción de "mismo que afectado"
    const showSameAsAffectedOption = role !== 'affected' && formData.contacts.affected;
    const initials = getInitials(contact);
    const avatarColor = getAvatarColor(contact);
    
    // Obtener documentos de identificación de este rol
    const identificationDocs = documents.identificationDocs[role] || [];

    return (
      <div className={`p-6 rounded-lg shadow-sm mb-6 ${bgColorClass}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SafeIcon 
              icon={RoleIcon} 
              className={`w-5 h-5 ${role === 'affected' ? 'text-blue-600' : role === 'policyholder' ? 'text-green-600' : 'text-purple-600'}`}
            />
            <h3 className="text-lg font-medium text-gray-900">
              {roleLabel} {isRequired && <span className="text-red-500">*</span>}
            </h3>
          </div>
          
          {/* Botones para selección rápida */}
          <div className="flex items-center space-x-2">
            {/* Checkbox "Yo soy el ..." */}
            <div className="flex items-center mr-4">
              <input
                type="checkbox"
                id={`currentUser-${role}`}
                checked={formData.isCurrentUser[role]}
                onChange={() => handleCurrentUserChange(role)}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mr-2"
                disabled={disabled || formData.isSameAsAffected[role]}
              />
              <label htmlFor={`currentUser-${role}`} className="text-sm text-gray-700">
                Yo soy el {roleLabel}
              </label>
            </div>
            
            {/* Opción "Mismo que afectado" para roles que no sean el afectado */}
            {showSameAsAffectedOption && (
              <div className="flex items-center mr-4">
                <input
                  type="checkbox"
                  id={`sameAs-${role}`}
                  checked={formData.isSameAsAffected[role]}
                  onChange={() => handleSameAsAffectedChange(role)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mr-2"
                  disabled={disabled || formData.isCurrentUser[role]}
                />
                <label htmlFor={`sameAs-${role}`} className="text-sm text-gray-700">
                  Mismo que Asegurado Afectado
                </label>
              </div>
            )}

            {/* Botón para seleccionar contacto guardado */}
            <button
              type="button"
              onClick={() => openContactSelector(role)}
              disabled={disabled || formData.isSameAsAffected[role] || formData.isCurrentUser[role]}
              className={`flex items-center space-x-2 px-3 py-2 text-sm ${
                disabled || formData.isSameAsAffected[role] || formData.isCurrentUser[role]
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-300'
              } rounded-md transition-colors`}
            >
              <SafeIcon icon={FiUsers} className="w-4 h-4" />
              <span>Seleccionar guardado</span>
            </button>
          </div>
        </div>
        
        {/* Mostrar formulario si hay contacto o si se están llenando los datos */}
        {(contact.name || contact.firstName || !formData.isSameAsAffected[role]) && !formData.isCurrentUser[role] ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Primera columna - Avatar y información básica */}
            <div className="flex flex-col items-center space-y-4">
              {/* Avatar */}
              <div className="mb-2">
                {contact.avatar ? (
                  <img
                    src={contact.avatar}
                    alt={contact.name || roleLabel}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-lg font-bold"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {initials}
                  </div>
                )}
              </div>

              {/* Información básica del contacto */}
              <div className="text-center space-y-1">
                <p className="font-medium text-gray-900">
                  {contact.name || `${contact.firstName || ''} ${contact.paternalLastName || ''}`.trim() || 'Sin nombre'}
                </p>
                <p className="text-sm text-gray-600">{contact.email || 'Sin email'}</p>
                <p className="text-sm text-gray-600">{contact.whatsapp || 'Sin WhatsApp'}</p>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col space-y-2 w-full">
                <button
                  type="button"
                  onClick={() => handleEditContact(role)}
                  className="flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleCreateNewContact(role)}
                  className="flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <SafeIcon icon={FiUserPlus} className="w-4 h-4" />
                  <span>Nuevo</span>
                </button>
              </div>
            </div>

            {/* Tercera y cuarta columna - Identificación oficial */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Identificación oficial {isRequired && '*'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 bg-white hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <SafeIcon icon={FiUpload} className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-2">
                    INE por ambos lados o Pasaporte (Vigentes)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleIdentificationUpload(e, role)}
                    disabled={disabled || formData.isSameAsAffected[role]}
                    className="hidden"
                    id={`id-upload-${role}`}
                  />
                  <label
                    htmlFor={`id-upload-${role}`}
                    className={`inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-xs cursor-pointer hover:bg-gray-300 transition-colors ${
                      disabled || formData.isSameAsAffected[role] ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Seleccionar archivos
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Máximo 2 archivos, 10MB cada uno
                  </p>
                </div>
              </div>
              
              {/* Mostrar documentos de identificación cargados */}
              {identificationDocs.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Archivos cargados ({identificationDocs.length}/2)</h4>
                  <div className="space-y-2">
                    {identificationDocs.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded hover:bg-gray-50">
                        <div className="flex items-center space-x-2 truncate flex-1">
                          <SafeIcon icon={FiFileText} className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-900 truncate" title={doc.name}>
                            {doc.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500 mr-2">{formatFileSize(doc.size)}</span>
                          <button
                            type="button"
                            onClick={() => openDocumentPreview(doc)}
                            className="p-1 text-primary hover:text-primary-dark"
                            title="Vista previa"
                          >
                            <SafeIcon icon={FiEye} className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeIdentificationDocument(doc.id, role)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Eliminar"
                          >
                            <SafeIcon icon={FiX} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Mostrar mensaje cuando no hay contacto seleccionado */
          <div className="text-center py-8">
            <SafeIcon icon={FiUser} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {formData.isSameAsAffected[role] 
                ? `Usando los mismos datos del Asegurado Afectado`
                : formData.isCurrentUser[role]
                ? `Usando tus datos como ${roleLabel}`
                : `Selecciona o crea una persona para el rol de ${roleLabel}`
              }
            </p>
            {!formData.isSameAsAffected[role] && !formData.isCurrentUser[role] && (
              <button
                type="button"
                onClick={() => handleCreateNewContact(role)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors mx-auto"
              >
                <SafeIcon icon={FiUserPlus} className="w-4 h-4" />
                <span>Crear Nueva Persona</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Renderizar un campo de documento con su sección de archivos cargados
  const renderDocumentField = (fieldName, section, isOptional = false) => {
    // No renderizar los campos de identificación que ahora están en los formularios de contacto
    if (fieldName.includes('Identificación Oficial')) {
      return null;
    }
    
    const fieldDocuments = getDocumentsByField(section, fieldName) || [];
    
    return (
      <div key={fieldName} className="space-y-2 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Columna izquierda: Campo de carga */}
          <div className="md:w-1/2">
            <label className="block text-sm font-medium text-blue-800 mb-2">
              {fieldName} {!isOptional && '*'}
            </label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-white hover:border-blue-400 transition-colors">
              <div className="text-center">
                <SafeIcon icon={FiUpload} className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-blue-600 mb-2">Subir documentos (PDF, PNG, JPG)</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => handleFileUpload(e, section, fieldName)}
                  className="hidden"
                  id={`${section}-${fieldName.replace(/\s+/g, '-').toLowerCase()}`}
                />
                <label
                  htmlFor={`${section}-${fieldName.replace(/\s+/g, '-').toLowerCase()}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  Seleccionar archivos
                </label>
                <p className="text-xs text-blue-500 mt-1">Máximo 5 archivos, 10MB cada uno</p>
              </div>
            </div>
          </div>
          
          {/* Columna derecha: Archivos cargados */}
          <div className="md:w-1/2">
            <div className="h-full">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Archivos cargados</h4>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {fieldDocuments.length} / 5
                </span>
              </div>
              
              {fieldDocuments.length === 0 ? (
                <div className="h-[120px] border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                  <p className="text-sm text-gray-500">No hay archivos cargados</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {fieldDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-2 truncate flex-1">
                        <SafeIcon icon={FiFileText} className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate" title={doc.name}>
                          {doc.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500 mr-2">{formatFileSize(doc.size)}</span>
                        <button
                          type="button"
                          onClick={() => openDocumentPreview(doc)}
                          className="p-1 text-primary hover:text-primary-dark"
                          title="Vista previa"
                        >
                          <SafeIcon icon={FiEye} className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeDocument(doc.id, section)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Eliminar"
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Crear Nuevo Reclamo">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {complementData ? 'Crear Reclamo Complemento' : 'Crear Nuevo Reclamo'}
          </h2>
          <p className="text-gray-600">
            {complementData
              ? 'Completa la información para crear tu reclamo complemento'
              : 'Completa la información para crear tu reclamo de seguro'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información del Reclamo - Movido al inicio y siempre visible */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-6">
              <SafeIcon icon={FiFileText} className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium text-gray-900">Información del Reclamo</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de póliza *
                  </label>
                  <input
                    type="text"
                    name="policyNumber"
                    required
                    value={formData.policyNumber}
                    onChange={handleInputChange}
                    readOnly={!!complementData}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                      complementData ? 'bg-gray-50' : ''
                    }`}
                    placeholder="Número de póliza"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aseguradora *
                  </label>
                  <select
                    name="insurance"
                    required
                    value={formData.insurance}
                    onChange={handleInputChange}
                    disabled={!!complementData}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                      complementData ? 'bg-gray-50' : ''
                    }`}
                  >
                    <option value="">Selecciona la aseguradora</option>
                    <option value="GNP">GNP</option>
                    <option value="AXA">AXA</option>
                    <option value="Qualitas">Qualitas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de reclamo *
                  </label>
                  <select
                    name="claimType"
                    required
                    value={formData.claimType}
                    onChange={handleInputChange}
                    disabled={!!complementData}
                    className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                      complementData ? 'bg-gray-50' : ''
                    }`}
                  >
                    <option value="">Selecciona el tipo de reclamo</option>
                    <option value="Reembolso">Reembolso</option>
                    <option value="Programación">Programación</option>
                    <option value="Maternidad">Maternidad</option>
                  </select>
                </div>
                
                {formData.claimType === 'Reembolso' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Siniestro *
                    </label>
                    <select
                      name="claimInitialType"
                      required
                      value={formData.claimInitialType}
                      onChange={handleInputChange}
                      disabled={!!complementData}
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                        complementData ? 'bg-gray-50' : ''
                      }`}
                    >
                      <option value="">Selecciona el tipo</option>
                      <option value="Inicial">Inicial</option>
                      <option value="Complemento">Complemento</option>
                    </select>
                  </div>
                )}
              </div>
              
              {formData.claimType === 'Reembolso' && formData.claimInitialType === 'Complemento' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Reclamo *
                  </label>
                  <input
                    type="text"
                    name="previousClaimNumber"
                    required
                    value={formData.previousClaimNumber}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-gray-50"
                    placeholder="Número provisto por la Aseguradora"
                    readOnly={!!complementData}
                  />
                </div>
              )}
              
              {formData.claimType && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de Servicio *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getServiceOptions().map((service) => (
                      <div key={service.name} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`service-${service.name}`}
                          checked={formData.serviceTypes.includes(service.name)}
                          onChange={() => handleServiceTypeChange(service.name)}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor={`service-${service.name}`} className="ml-2 text-sm text-gray-700">
                          <span className="mr-2 text-lg">{service.emoji}</span>
                          {service.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {formData.serviceTypes.includes('Cirugía') && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isTraumaOrthopedicSurgery"
                      checked={formData.isTraumaOrthopedicSurgery}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          isTraumaOrthopedicSurgery: e.target.checked
                        }))
                      }
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="isTraumaOrthopedicSurgery" className="ml-2 text-sm font-medium text-yellow-800">
                      Marca esta casilla si quieres programar una Cirugía de Traumatología, Ortopedia o Neurología
                    </label>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Siniestro *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Describe brevemente cómo ocurrió el siniestro"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Información del Asegurado Afectado - Siempre requerido */}
          {renderContactForm('affected', true, !!complementData)}
          
          {/* Información del Asegurado Titular */}
          {renderContactForm('policyholder', true, !!complementData)}
          
          {/* Información del Titular de la Cuenta Bancaria - Solo para Reembolso */}
          {formData.claimType === 'Reembolso' && renderContactForm('accountHolder', true, false)}
          
          {/* Opción de guardar contactos - Movido justo después de los contactos */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="saveContacts"
                name="saveContacts"
                checked={formData.saveContacts}
                onChange={(e) => setFormData(prev => ({ ...prev, saveContacts: e.target.checked }))}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="saveContacts" className="ml-2 text-sm text-gray-700">
                Guardar los detalles de los contactos para futuros reclamos
              </label>
            </div>
          </div>
          
          {/* Sección 1: Firmas de Formas de Aseguradora */}
          {section1Fields.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2 mb-6">
                <SafeIcon icon={FiFileText} className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-blue-900">Sección 1: Firmas de Formas de Aseguradora</h3>
              </div>
              
              {/* Toggle de tipo de firma */}
              <div className="mb-6 flex items-center justify-center bg-white p-3 rounded-lg border border-blue-100">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleSignatureTypeChange('electronic')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      formData.signatureType === 'electronic'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600 border border-blue-200'
                    }`}
                  >
                    Firmar en Electrónico
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSignatureTypeChange('physical')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      formData.signatureType === 'physical'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600 border border-blue-200'
                    }`}
                  >
                    Firmar en Físico
                  </button>
                </div>
              </div>
              
              {formData.signatureType === 'electronic' ? (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <SafeIcon icon={FiMail} className="w-5 h-5 text-blue-600" />
                    <p className="font-medium text-blue-800">Firma Electrónica</p>
                  </div>
                  <p className="text-blue-700">
                    Busca en tu buzón de entrada los emails que te enviamos solicitando la firma digital de los documentos solicitados por la aseguradora.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {section1Fields.map((field) => renderDocumentField(field, 'section1'))}
                </div>
              )}
            </div>
          )}
          
          {/* Sección 2: Documentos del Siniestro */}
          {showSection2 && (
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2 mb-6">
                <SafeIcon icon={FiFileText} className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-medium text-green-900">Sección 2: Documentos del Siniestro</h3>
              </div>
              <div className="space-y-6">
                {/* Informe Médico */}
                {renderDocumentField('Informe Médico', 'section2')}
                
                {/* Carátula del Estado de Cuenta Bancaria - Solo para Reembolso */}
                {formData.claimType === 'Reembolso' && renderDocumentField('Carátula del Estado de Cuenta Bancaria', 'section2')}
              </div>
            </div>
          )}
          
          {/* Sección 3: Facturas, Recetas, Estudios y Otros Documentos */}
          {section3Fields.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2 mb-6">
                <SafeIcon icon={FiFileText} className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-medium text-orange-900">
                  Sección 3: Facturas, Recetas, Estudios y Otros Documentos
                </h3>
              </div>
              <div className="space-y-6">
                {section3Fields.map((field) => renderDocumentField(field, 'section3', field.includes('(opcional)')))
                }
              </div>
            </div>
          )}
          
          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando reclamo...' : 'Crear Reclamo'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Modal de selección de contacto */}
      {showContactSelector && (
        <ContactSelector
          onSelect={handleSelectContact}
          onClose={() => setShowContactSelector(false)}
          role={contactRoleLabels[currentContactRole]}
          userId={user?.id} // Pasamos el ID del usuario actual para filtrar solo sus contactos
        />
      )}

      {/* Modal de formulario de persona */}
      {showPersonForm && (
        <PersonForm
          person={editingContact}
          onSave={handleSavePerson}
          onCancel={() => {
            setShowPersonForm(false);
            setEditingContact(null);
          }}
          title={editingContact ? "Editar Persona" : `Nueva Persona - ${contactRoleLabels[currentContactRole]}`}
          isEditing={!!editingContact}
        />
      )}
      
      {/* Modal de previsualización de documentos */}
      {showPreview && previewDocument && (
        <DocumentPreview
          document={previewDocument}
          onClose={() => setShowPreview(false)}
        />
      )}
    </Layout>
  );
};

export default CreateClaim;