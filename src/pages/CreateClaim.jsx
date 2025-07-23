import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiMail, FiPhone, FiFileText, FiUpload, FiX, FiAlertCircle } = FiIcons;

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
    saveCustomerDetails: true
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [whatsappError, setWhatsappError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'customerWhatsApp') {
      // Validar que el WhatsApp incluya código de país
      if (value && !value.startsWith('+')) {
        setWhatsappError('El número debe incluir el código de país (ej. +52)');
      } else {
        setWhatsappError('');
      }
    }
    
    setFormData(prev => {
      // Si cambiamos el tipo de reclamo, resetear los servicios seleccionados
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

      // Si quitamos Cirugía, resetear el checkbox de traumatología
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setDocuments(prev => [...prev, ...newDocuments]);
  };

  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar WhatsApp
    if (!formData.customerWhatsApp.startsWith('+')) {
      setWhatsappError('El número debe incluir el código de país (ej. +52)');
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Reclamo creado exitosamente');
    navigate('/dashboard');
  };

  return (
    <Layout title="Crear Nuevo Reclamo">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Reclamo</h2>
          <p className="text-gray-600">Completa la información para crear tu reclamo de seguro</p>
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
              {/* Campos principales */}
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

              {/* Número de Reclamo condicional */}
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

              {/* Campos condicionales */}
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
                    <label
                      htmlFor="isTraumaOrthopedicSurgery"
                      className="ml-2 text-sm font-medium text-yellow-800"
                    >
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

          {/* Documentos */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-6">
              <SafeIcon icon={FiUpload} className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium text-gray-900">Documentos</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subir documentos (facturas, recetas, carnets, etc.)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <SafeIcon icon={FiUpload} className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block bg-primary text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-primary-dark transition-colors"
                  >
                    Seleccionar archivos
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, JPG, PNG, DOC, DOCX - Máximo 10MB por archivo
                  </p>
                </div>
              </div>

              {documents.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Archivos seleccionados ({documents.length})
                  </h4>
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiFileText} className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(doc.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <SafeIcon icon={FiX} className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
    </Layout>
  );
};

export default CreateClaim;