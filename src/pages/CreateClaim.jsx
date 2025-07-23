import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import InsuredPersonsList from '../components/InsuredPersonsList';

const { FiUser, FiMail, FiPhone, FiFileText, FiUpload, FiX, FiAlertCircle, FiCheck } = FiIcons;

const CreateClaim = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerWhatsApp: '',
    policyNumber: '',
    insurance: '',
    claimType: '',
    serviceTypes: [],
    isTraumaOrthopedicSurgery: false,
    claimInitialType: '',
    previousClaimNumber: '',
    description: '',
    saveCustomerDetails: true,
    isTitularCuentaBancaria: false,
    signatureType: 'electronic' // Nuevo campo para el tipo de firma (electronic o physical)
  });

  const [documents, setDocuments] = useState({
    section1: [],
    section2: [],
    section3: []
  });

  const [loading, setLoading] = useState(false);
  const [whatsappError, setWhatsappError] = useState('');
  const [showInsuredList, setShowInsuredList] = useState(false);

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
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
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
    if (formData.insurance === 'GNP' && formData.claimType === 'Programación' && 
        formData.serviceTypes.includes('Cirugía') && formData.isTraumaOrthopedicSurgery) {
      fields.push('Forma de Cirugía de Traumatología, Ortopedia y Neurología');
      fields.push('Interpretación de Estudios que corroboren el diagnóstico');
    }
    // Cirugía general (GNP o AXA)
    else if ((formData.insurance === 'GNP' || formData.insurance === 'AXA') && 
             formData.claimType === 'Programación' && formData.serviceTypes.includes('Cirugía')) {
      fields.push('Interpretación de Estudios que corroboren el diagnóstico');
    }

    // Medicamentos - Programación
    if ((formData.insurance === 'GNP' || formData.insurance === 'AXA') && 
        formData.claimType === 'Programación' && formData.serviceTypes.includes('Medicamentos')) {
      fields.push('Recetas de Medicamentos incluyendo dosis y periodo de administración');
      if (!fields.includes('Interpretación de Estudios que corroboren el diagnóstico (opcional)')) {
        fields.push('Interpretación de Estudios que corroboren el diagnóstico (opcional)');
      }
    }

    // Rehabilitaciones - Programación
    if ((formData.insurance === 'GNP' || formData.insurance === 'AXA') && 
        formData.claimType === 'Programación' && formData.serviceTypes.includes('Terapia/Rehabilitación')) {
      fields.push('Bitácora del Médico Indicando: Terapias, Sesiones y Tiempos');
      if (!fields.includes('Interpretación de Estudios que corroboren el diagnóstico')) {
        fields.push('Interpretación de Estudios que corroboren el diagnóstico');
      }
    }

    // Reembolso - Hospital
    if ((formData.insurance === 'GNP' || formData.insurance === 'AXA') && 
        formData.claimType === 'Reembolso' && formData.serviceTypes.includes('Hospital')) {
      fields.push('Facturas de Hospitales');
    }

    // Reembolso - Honorarios Médicos
    if ((formData.insurance === 'GNP' || formData.insurance === 'AXA') && 
        formData.claimType === 'Reembolso' && formData.serviceTypes.includes('Honorarios Médicos')) {
      fields.push('Facturas de Honorarios Médicos');
    }

    // Reembolso - Medicamentos
    if ((formData.insurance === 'GNP' || formData.insurance === 'AXA') && 
        formData.claimType === 'Reembolso' && formData.serviceTypes.includes('Medicamentos')) {
      fields.push('Facturas de Medicamentos');
      fields.push('Recetas de Medicamentos incluyendo dosis y periodo de administración');
    }

    // Reembolso - Estudios
    if ((formData.insurance === 'GNP' || formData.insurance === 'AXA') && 
        formData.claimType === 'Reembolso' && formData.serviceTypes.includes('Estudios de Laboratorio e Imagenología')) {
      fields.push('Facturas de Estudios de Laboratorio e Imagenología');
      fields.push('Estudios de Laboratorio e Imagenología');
    }

    // Nueva regla: Terapia/Rehabilitación para Reembolso
    if ((formData.insurance === 'GNP' || formData.insurance === 'AXA') && 
        formData.claimType === 'Reembolso' && formData.serviceTypes.includes('Terapia/Rehabilitación')) {
      fields.push('Facturas de Terapias');
      fields.push('Recetas de Terapias');
      fields.push('Carnet de Asistencia a Terapias');
    }

    return [...new Set(fields)]; // Eliminar duplicados
  };

  const handleSelectInsured = (person) => {
    setFormData(prev => ({
      ...prev,
      customerName: person.full_name,
      customerEmail: person.email,
      customerWhatsApp: person.whatsapp,
      policyNumber: person.policy_number,
      insurance: person.insurance
    }));
    setShowInsuredList(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerWhatsApp.startsWith('+')) {
      setWhatsappError('El número debe incluir el código de país (ej. +52)');
      return;
    }

    setLoading(true);
    try {
      if (formData.saveCustomerDetails) {
        // Simulación de guardado exitoso
        console.log('Guardando asegurado:', {
          full_name: formData.customerName,
          email: formData.customerEmail,
          whatsapp: formData.customerWhatsApp,
          policy_number: formData.policyNumber,
          insurance: formData.insurance
        });
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

  return (
    <Layout title="Crear Nuevo Reclamo">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Reclamo</h2>
          <p className="text-gray-600">Completa la información para crear tu reclamo de seguro</p>
        </div>

        <div className="mb-6">
          <button 
            onClick={() => setShowInsuredList(!showInsuredList)} 
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            {showInsuredList ? 'Ocultar Asegurados' : 'Seleccionar Asegurado Guardado'}
          </button>
          
          {showInsuredList && (
            <div className="mt-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <InsuredPersonsList onSelectPerson={handleSelectInsured} />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información del Asegurado */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-6">
              <SafeIcon icon={FiUser} className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium text-gray-900">Información del Asegurado</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Nombre completo del asegurado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  required
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  name="customerWhatsApp"
                  required
                  value={formData.customerWhatsApp}
                  onChange={handleInputChange}
                  className={`w-full border ${whatsappError ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                  placeholder="+52 55 1234 5678"
                />
                {whatsappError && (
                  <p className="text-red-500 text-xs mt-1">{whatsappError}</p>
                )}
              </div>

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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Selecciona la aseguradora</option>
                  <option value="GNP">GNP</option>
                  <option value="AXA">AXA</option>
                  <option value="Qualitas">Qualitas</option>
                </select>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="saveCustomerDetails"
                  name="saveCustomerDetails"
                  checked={formData.saveCustomerDetails}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="saveCustomerDetails" className="ml-2 text-sm text-gray-700">
                  Guardar los detalles del Asegurado Afectado
                </label>
              </div>
            </div>
          </div>

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
                    Tipo de reclamo *
                  </label>
                  <select
                    name="claimType"
                    required
                    value={formData.claimType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        isTraumaOrthopedicSurgery: e.target.checked
                      }))}
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
                    Busca en tu buzón de entrada los emails que te enviamos solicitando la firma digital de los documentos solicitados por la aseguradora.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {section1Fields.map((field, index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        {field} *
                      </label>
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
                              <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded border border-blue-200">
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
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    Informe Médico *
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

                {/* Carátula del Estado de Cuenta Bancaria */}
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

                {/* Checkbox para titular de cuenta bancaria */}
                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isTitularCuentaBancaria"
                      name="isTitularCuentaBancaria"
                      checked={formData.isTitularCuentaBancaria}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="isTitularCuentaBancaria" className="ml-2 text-sm font-medium text-green-800">
                      El Asegurado Afectado es el Titular de la Cuenta Bancaria
                    </label>
                  </div>
                </div>

                {/* Identificación del Titular de Cuenta Bancaria (condicional) */}
                {!formData.isTitularCuentaBancaria && (
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
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
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
                <h3 className="text-lg font-medium text-orange-900">Sección 3: Facturas, Recetas, Estudios y Otros Documentos</h3>
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
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded border border-orange-200">
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
    </Layout>
  );
};

export default CreateClaim;