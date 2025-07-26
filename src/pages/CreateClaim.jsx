import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ContactSelector from '../components/ContactSelector';

const { FiUser, FiMail, FiPhone, FiFileText, FiUpload, FiX, FiAlertCircle, FiCheck, FiUsers, FiUserPlus, FiCreditCard } = FiIcons;

const CreateClaim = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const complementData = location.state?.complementData;
  const { user } = useAuth(); // Obtener el usuario actual
  
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
      manager: user ? { // El gestor siempre es el usuario actual
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp || '',
        avatar: user.avatar || '',
        userId: user.id
      } : null
    },
    
    // Flags
    isSameAsAffected: {
      policyholder: false,
      accountHolder: false
    },
    
    // Guardar contactos
    saveContacts: true
  });

  const [documents, setDocuments] = useState({
    section1: [],
    section2: [],
    section3: []
  });
  
  const [loading, setLoading] = useState(false);
  const [whatsappError, setWhatsappError] = useState('');
  const [showContactSelector, setShowContactSelector] = useState(false);
  const [currentContactRole, setCurrentContactRole] = useState(null);

  // Pre-cargar datos si viene de complemento
  useEffect(() => {
    if (complementData) {
      const affected = {
        name: complementData.customerName,
        email: complementData.customerEmail,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      return { ...prev, [name]: value };
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
    setFormData(prev => ({ ...prev, [name]: checked }));
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
        newContacts[role] = { name: '', email: '', whatsapp: '', avatar: '' };
      }
      
      return {
        ...prev,
        isSameAsAffected: newIsSameAsAffected,
        contacts: newContacts
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
        return { ...prev, serviceTypes: currentServices, isTraumaOrthopedicSurgery: false };
      }
      return { ...prev, serviceTypes: currentServices };
    });
  };

  const handleSignatureTypeChange = (type) => {
    setFormData(prev => ({ ...prev, signatureType: type }));
  };

  const getServiceOptions = () => {
    switch (formData.claimType) {
      case 'Reembolso':
        return [
          'Hospital',
          'Honorarios Médicos',
          'Estudios de Laboratorio e Imagenología',
          'Medicamentos',
          'Terapia/Rehabilitación'
        ];
      case 'Programación':
        return ['Medicamentos', 'Terapia/Rehabilitación', 'Cirugía'];
      default:
        return [];
    }
  };

  const handleFileUpload = (e, section) => {
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
    
    const newDocuments = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));

    setDocuments(prev => ({
      ...prev,
      [section]: [...prev[section], ...newDocuments]
    }));
  };

  const removeDocument = (id, section) => {
    setDocuments(prev => ({
      ...prev,
      [section]: prev[section].filter(doc => doc.id !== id)
    }));
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
      }
    }));
    setShowContactSelector(false);
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
    if (!formData.policyNumber || !formData.insurance || !formData.claimType) {
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

    return (
      <div className={`p-6 rounded-lg shadow-sm mb-6 ${bgColorClass}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={RoleIcon} className={`w-5 h-5 ${role === 'affected' ? 'text-blue-600' : role === 'policyholder' ? 'text-green-600' : 'text-purple-600'}`} />
            <h3 className="text-lg font-medium text-gray-900">
              {roleLabel}
              {isRequired && <span className="text-red-500">*</span>}
            </h3>
          </div>
          
          {/* Botón para seleccionar contacto guardado */}
          <div className="flex items-center space-x-2">
            {showSameAsAffectedOption && (
              <div className="flex items-center mr-4">
                <input
                  type="checkbox"
                  id={`sameAs-${role}`}
                  checked={formData.isSameAsAffected[role]}
                  onChange={() => handleSameAsAffectedChange(role)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mr-2"
                  disabled={disabled}
                />
                <label htmlFor={`sameAs-${role}`} className="text-sm text-gray-700">
                  Mismo que Asegurado Afectado
                </label>
              </div>
            )}
            
            <button 
              type="button"
              onClick={() => openContactSelector(role)}
              disabled={disabled || formData.isSameAsAffected[role]}
              className={`flex items-center space-x-2 px-3 py-2 text-sm ${
                disabled || formData.isSameAsAffected[role]
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-300'
              } rounded-md transition-colors`}
            >
              <SafeIcon icon={FiUsers} className="w-4 h-4" />
              <span>Seleccionar guardado</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo {isRequired && '*'}
            </label>
            <input
              type="text"
              name={`${role}-name`}
              required={isRequired}
              value={contact.name || ''}
              onChange={(e) => handleContactChange(role, 'name', e.target.value)}
              disabled={disabled || formData.isSameAsAffected[role]}
              className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                disabled || formData.isSameAsAffected[role] ? 'bg-gray-50' : ''
              }`}
              placeholder="Nombre completo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico {isRequired && '*'}
            </label>
            <input
              type="email"
              name={`${role}-email`}
              required={isRequired}
              value={contact.email || ''}
              onChange={(e) => handleContactChange(role, 'email', e.target.value)}
              disabled={disabled || formData.isSameAsAffected[role]}
              className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                disabled || formData.isSameAsAffected[role] ? 'bg-gray-50' : ''
              }`}
              placeholder="correo@ejemplo.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp {isRequired && '*'}
            </label>
            <input
              type="tel"
              name={`${role}-whatsapp`}
              required={isRequired}
              value={contact.whatsapp || ''}
              onChange={(e) => handleContactChange(role, 'whatsapp', e.target.value)}
              disabled={disabled || formData.isSameAsAffected[role]}
              className={`w-full border ${
                whatsappError && !formData.isSameAsAffected[role] ? 'border-red-300' : 'border-gray-300'
              } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                disabled || formData.isSameAsAffected[role] ? 'bg-gray-50' : ''
              }`}
              placeholder="+52 55 1234 5678"
            />
            {whatsappError && !formData.isSameAsAffected[role] && (
              <p className="text-red-500 text-xs mt-1">{whatsappError}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              name={`${role}-avatar`}
              value={contact.avatar || ''}
              onChange={(e) => handleContactChange(role, 'avatar', e.target.value)}
              disabled={disabled || formData.isSameAsAffected[role]}
              className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                disabled || formData.isSameAsAffected[role] ? 'bg-gray-50' : ''
              }`}
              placeholder="https://ejemplo.com/avatar.jpg"
            />
          </div>
        </div>
      </div>
    );
  };

  // Mostrar información del gestor actual
  const renderCurrentManager = () => {
    const manager = formData.contacts.manager || {};

    return (
      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiUserPlus} className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-medium text-gray-900">
              Contacto o Gestor (Usuario actual)
            </h3>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {manager.avatar ? (
              <img 
                src={manager.avatar} 
                alt={manager.name} 
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 flex items-center justify-center bg-amber-100 rounded-full">
                <SafeIcon icon={FiUserPlus} className="h-6 w-6 text-amber-500" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{manager.name}</p>
            <p className="text-sm text-gray-600">{manager.email}</p>
            {manager.whatsapp && (
              <p className="text-sm text-gray-600">{manager.whatsapp}</p>
            )}
          </div>
          <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
            Usuario actual
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Crear Nuevo Reclamo">
      <div className="max-w-4xl mx-auto">
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
          {/* Información del Asegurado Afectado - Siempre requerido */}
          {renderContactForm('affected', true, !!complementData)}

          {/* Información del Asegurado Titular */}
          {renderContactForm('policyholder', true, !!complementData)}

          {/* Información del Titular de la Cuenta Bancaria - Solo para Reembolso */}
          {formData.claimType === 'Reembolso' && renderContactForm('accountHolder', true, false)}

          {/* Información del Contacto o Gestor (Usuario actual) */}
          {renderCurrentManager()}

          {/* Información del Reclamo */}
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Número provisto por la Aseguradora"
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
                      <div key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`service-${service}`}
                          checked={formData.serviceTypes.includes(service)}
                          onChange={() => handleServiceTypeChange(service)}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor={`service-${service}`} className="ml-2 text-sm text-gray-700">
                          {service}
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
                  Descripción del Siniestro
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Describe brevemente cómo ocurrió el siniestro"
                />
              </div>
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
                    Busca en tu buzón de entrada los emails que te enviamos solicitando la firma digital de los documentos
                    solicitados por la aseguradora.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {section1Fields.map((field, index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-medium text-blue-800 mb-2">{field} *</label>
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-white hover:border-blue-400 transition-colors">
                        <div className="text-center">
                          <SafeIcon icon={FiUpload} className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                          <p className="text-sm text-blue-600 mb-2">Subir documentos (PDF, PNG, JPG)</p>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => handleFileUpload(e, 'section1')}
                            className="hidden"
                            id={`section1-${index}`}
                          />
                          <label
                            htmlFor={`section1-${index}`}
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-700 transition-colors"
                          >
                            Seleccionar archivos
                          </label>
                          <p className="text-xs text-blue-500 mt-1">Máximo 5 archivos, 10MB cada uno</p>
                        </div>
                      </div>
                      {documents.section1.length > 0 && (
                        <div className="mt-3">
                          <div className="space-y-2">
                            {documents.section1.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-2 bg-white rounded border border-blue-200"
                              >
                                <div className="flex items-center space-x-2">
                                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-gray-900">{doc.name}</span>
                                  <span className="text-xs text-gray-500">({formatFileSize(doc.size)})</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(doc.id, 'section1')}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <SafeIcon icon={FiX} className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-800 mb-2">Informe Médico *</label>
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-white hover:border-green-400 transition-colors">
                    <div className="text-center">
                      <SafeIcon icon={FiUpload} className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <p className="text-sm text-green-600 mb-2">Subir documentos (PDF, PNG, JPG)</p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload(e, 'section2')}
                        className="hidden"
                        id="informe-medico"
                      />
                      <label
                        htmlFor="informe-medico"
                        className="inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-green-700 transition-colors"
                      >
                        Seleccionar archivos
                      </label>
                      <p className="text-xs text-green-500 mt-1">Máximo 5 archivos, 10MB cada uno</p>
                    </div>
                  </div>
                </div>

                {/* Identificación Oficial del Asegurado Afectado */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    Identificación Oficial del Asegurado Afectado *
                  </label>
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-white hover:border-green-400 transition-colors">
                    <div className="text-center">
                      <SafeIcon icon={FiUpload} className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <p className="text-sm text-green-600 mb-2">Subir documentos (PDF, PNG, JPG)</p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload(e, 'section2')}
                        className="hidden"
                        id="id-asegurado"
                      />
                      <label
                        htmlFor="id-asegurado"
                        className="inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-green-700 transition-colors"
                      >
                        Seleccionar archivos
                      </label>
                      <p className="text-xs text-green-500 mt-1">Máximo 5 archivos, 10MB cada uno</p>
                    </div>
                  </div>
                </div>

                {/* Carátula del Estado de Cuenta Bancaria - Solo para Reembolso */}
                {formData.claimType === 'Reembolso' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-green-800 mb-2">
                      Carátula del Estado de Cuenta Bancaria *
                    </label>
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-white hover:border-green-400 transition-colors">
                      <div className="text-center">
                        <SafeIcon icon={FiUpload} className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-green-600 mb-2">Subir documentos (PDF, PNG, JPG)</p>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => handleFileUpload(e, 'section2')}
                          className="hidden"
                          id="estado-cuenta"
                        />
                        <label
                          htmlFor="estado-cuenta"
                          className="inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-green-700 transition-colors"
                        >
                          Seleccionar archivos
                        </label>
                        <p className="text-xs text-green-500 mt-1">Máximo 5 archivos, 10MB cada uno</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Identificación del Titular de Cuenta Bancaria (condicional) - Solo para Reembolso */}
                {formData.claimType === 'Reembolso' && !formData.isSameAsAffected.accountHolder && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-green-800 mb-2">
                      Identificación Oficial del Titular de la Cuenta Bancaria *
                    </label>
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-white hover:border-green-400 transition-colors">
                      <div className="text-center">
                        <SafeIcon icon={FiUpload} className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-green-600 mb-2">Subir documentos (PDF, PNG, JPG)</p>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => handleFileUpload(e, 'section2')}
                          className="hidden"
                          id="id-titular-bancario"
                        />
                        <label
                          htmlFor="id-titular-bancario"
                          className="inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-green-700 transition-colors"
                        >
                          Seleccionar archivos
                        </label>
                        <p className="text-xs text-green-500 mt-1">Máximo 5 archivos, 10MB cada uno</p>
                      </div>
                    </div>
                  </div>
                )}

                {documents.section2.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-green-800 mb-3">
                      Archivos de Sección 2 ({documents.section2.length})
                    </h4>
                    <div className="space-y-2">
                      {documents.section2.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2 bg-white rounded border border-green-200"
                        >
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-900">{doc.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(doc.size)})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(doc.id, 'section2')}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <SafeIcon icon={FiX} className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                {section3Fields.map((field, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-medium text-orange-800 mb-2">
                      {field} {field.includes('(opcional)') ? '' : '*'}
                    </label>
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 bg-white hover:border-orange-400 transition-colors">
                      <div className="text-center">
                        <SafeIcon icon={FiUpload} className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                        <p className="text-sm text-orange-600 mb-2">Subir documentos (PDF, PNG, JPG)</p>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => handleFileUpload(e, 'section3')}
                          className="hidden"
                          id={`section3-${index}`}
                          required={!field.includes('(opcional)')}
                        />
                        <label
                          htmlFor={`section3-${index}`}
                          className="inline-block bg-orange-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-orange-700 transition-colors"
                        >
                          Seleccionar archivos
                        </label>
                        <p className="text-xs text-orange-500 mt-1">Máximo 5 archivos, 10MB cada uno</p>
                      </div>
                    </div>
                  </div>
                ))}

                {documents.section3.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-orange-800 mb-3">
                      Archivos de Sección 3 ({documents.section3.length})
                    </h4>
                    <div className="space-y-2">
                      {documents.section3.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2 bg-white rounded border border-orange-200"
                        >
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-900">{doc.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(doc.size)})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(doc.id, 'section3')}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <SafeIcon icon={FiX} className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Opción de guardar contactos */}
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
    </Layout>
  );
};

export default CreateClaim;