import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AvatarUploader from '../components/AvatarUploader';
import EmailManager from '../components/EmailManager';

const { 
  FiArrowLeft, FiSave, FiX, FiCheck, FiUser, FiUsers, 
  FiCreditCard, FiGlobe, FiMail, FiPhone, FiLock, FiAlertTriangle
} = FiIcons;

const CreateEditTenant = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [tenantData, setTenantData] = useState({
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    domain: '',
    subdomain: '',
    plan: 'Profesional',
    billingCycle: 'monthly',
    adminEmail: '',
    adminPassword: '',
    adminConfirmPassword: '',
    logoUrl: '',
    primaryColor: '#204499',
    emailProvider: 'none',
    googleClientId: '',
    googleClientSecret: '',
    outlookClientId: '',
    outlookClientSecret: '',
    enableAutoCreate: false,
    enableWhiteLabel: true
  });
  
  const [errors, setErrors] = useState({});

  // Load tenant data if editing
  useEffect(() => {
    if (isEditing) {
      // Simulated API call to get tenant data
      setTimeout(() => {
        setTenantData({
          name: 'Seguros MX',
          contactName: 'Roberto Méndez',
          contactEmail: 'roberto@segurosmx.com',
          contactPhone: '+52 55 1234 5678',
          domain: 'reclamos.segurosmx.com',
          subdomain: 'reclamos',
          plan: 'Profesional',
          billingCycle: 'annual',
          adminEmail: 'admin@segurosmx.com',
          adminPassword: '',
          adminConfirmPassword: '',
          logoUrl: 'https://via.placeholder.com/150x50?text=SegurosMX',
          primaryColor: '#204499',
          emailProvider: 'google',
          googleClientId: '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com',
          googleClientSecret: 'GOCSPX-abcdefghijklmnopqrstuvwxyz',
          outlookClientId: '',
          outlookClientSecret: '',
          enableAutoCreate: true,
          enableWhiteLabel: true
        });
        setLoading(false);
      }, 1000);
    }
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTenantData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLogoChange = (logoUrl) => {
    setTenantData(prev => ({
      ...prev,
      logoUrl
    }));
  };

  const handleSubdomainChange = (e) => {
    // Only allow lowercase letters, numbers, and hyphens
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setTenantData(prev => ({
      ...prev,
      subdomain: value,
      domain: value ? `${value}.reclamos-seguros.com` : ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!tenantData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!tenantData.contactName.trim()) newErrors.contactName = "El nombre de contacto es requerido";
    if (!tenantData.contactEmail.trim()) newErrors.contactEmail = "El email de contacto es requerido";
    else if (!/\S+@\S+\.\S+/.test(tenantData.contactEmail)) newErrors.contactEmail = "Email inválido";
    if (!tenantData.contactPhone.trim()) newErrors.contactPhone = "El teléfono de contacto es requerido";
    if (!tenantData.subdomain.trim()) newErrors.subdomain = "El subdominio es requerido";
    
    // Admin info
    if (!isEditing) {
      if (!tenantData.adminEmail.trim()) newErrors.adminEmail = "El email de administrador es requerido";
      else if (!/\S+@\S+\.\S+/.test(tenantData.adminEmail)) newErrors.adminEmail = "Email inválido";
      
      if (!tenantData.adminPassword) newErrors.adminPassword = "La contraseña es requerida";
      else if (tenantData.adminPassword.length < 8) newErrors.adminPassword = "La contraseña debe tener al menos 8 caracteres";
      
      if (tenantData.adminPassword !== tenantData.adminConfirmPassword) newErrors.adminConfirmPassword = "Las contraseñas no coinciden";
    }
    
    // Email integration validation
    if (tenantData.emailProvider === 'google') {
      if (!tenantData.googleClientId) newErrors.googleClientId = "Client ID de Google es requerido";
      if (!tenantData.googleClientSecret) newErrors.googleClientSecret = "Client Secret de Google es requerido";
    }
    
    if (tenantData.emailProvider === 'outlook') {
      if (!tenantData.outlookClientId) newErrors.outlookClientId = "Client ID de Outlook es requerido";
      if (!tenantData.outlookClientSecret) newErrors.outlookClientSecret = "Client Secret de Outlook es requerido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Find which tab has errors and switch to it
      if (Object.keys(errors).some(key => ['name', 'contactName', 'contactEmail', 'contactPhone', 'domain', 'subdomain', 'plan', 'billingCycle'].includes(key))) {
        setActiveTab('general');
      } else if (Object.keys(errors).some(key => ['adminEmail', 'adminPassword', 'adminConfirmPassword'].includes(key))) {
        setActiveTab('admin');
      } else if (Object.keys(errors).some(key => ['logoUrl', 'primaryColor', 'enableWhiteLabel'].includes(key))) {
        setActiveTab('whitelabel');
      } else if (Object.keys(errors).some(key => ['emailProvider', 'googleClientId', 'googleClientSecret', 'outlookClientId', 'outlookClientSecret'].includes(key))) {
        setActiveTab('integrations');
      }
      return;
    }
    
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowConfirmationModal(true);
    } catch (error) {
      alert('Error al guardar el tenant');
      console.error('Error saving tenant:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmation = () => {
    setShowConfirmationModal(false);
    navigate('/superadmin/tenants');
  };

  if (loading) {
    return (
      <Layout title={isEditing ? "Editando Tenant" : "Nuevo Tenant"}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isEditing ? "Editando Tenant" : "Nuevo Tenant"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/superadmin/tenants')}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? `Editando: ${tenantData.name}` : 'Crear Nuevo Tenant'}
              </h2>
              <p className="text-gray-600">
                {isEditing 
                  ? 'Modifica la configuración del tenant existente' 
                  : 'Configura una nueva cuenta de cliente en la plataforma'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SafeIcon icon={saving ? FiX : FiSave} className="w-5 h-5" />
            <span>{saving ? 'Guardando...' : 'Guardar Tenant'}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('general')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Información General
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'admin'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cuenta Admin
            </button>
            <button
              onClick={() => setActiveTab('whitelabel')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'whitelabel'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              White Label
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'integrations'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Integraciones
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <form>
            {/* General Information Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Información General del Tenant</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la Empresa *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={tenantData.name}
                      onChange={handleChange}
                      className={`w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      placeholder="Nombre de la empresa"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Contact Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de Contacto *
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={tenantData.contactName}
                      onChange={handleChange}
                      className={`w-full border ${errors.contactName ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      placeholder="Nombre completo del contacto"
                    />
                    {errors.contactName && (
                      <p className="mt-1 text-xs text-red-500">{errors.contactName}</p>
                    )}
                  </div>

                  {/* Contact Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email de Contacto *
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={tenantData.contactEmail}
                      onChange={handleChange}
                      className={`w-full border ${errors.contactEmail ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      placeholder="email@empresa.com"
                    />
                    {errors.contactEmail && (
                      <p className="mt-1 text-xs text-red-500">{errors.contactEmail}</p>
                    )}
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono de Contacto *
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={tenantData.contactPhone}
                      onChange={handleChange}
                      className={`w-full border ${errors.contactPhone ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      placeholder="+52 55 1234 5678"
                    />
                    {errors.contactPhone && (
                      <p className="mt-1 text-xs text-red-500">{errors.contactPhone}</p>
                    )}
                  </div>

                  {/* Subdomain */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subdominio *
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        name="subdomain"
                        value={tenantData.subdomain}
                        onChange={handleSubdomainChange}
                        className={`w-full border ${errors.subdomain ? 'border-red-300' : 'border-gray-300'} rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                        placeholder="miempresa"
                      />
                      <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md">
                        .reclamos-seguros.com
                      </span>
                    </div>
                    {errors.subdomain && (
                      <p className="mt-1 text-xs text-red-500">{errors.subdomain}</p>
                    )}
                  </div>

                  {/* Custom Domain */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dominio Personalizado
                    </label>
                    <input
                      type="text"
                      name="domain"
                      value={tenantData.domain}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="reclamos.miempresa.com"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Deja en blanco para usar solo el subdominio
                    </p>
                  </div>

                  {/* Plan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan *
                    </label>
                    <select
                      name="plan"
                      value={tenantData.plan}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      <option value="Básico">Básico</option>
                      <option value="Profesional">Profesional</option>
                      <option value="Empresarial">Empresarial</option>
                    </select>
                  </div>

                  {/* Billing Cycle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciclo de Facturación *
                    </label>
                    <select
                      name="billingCycle"
                      value={tenantData.billingCycle}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      <option value="monthly">Mensual</option>
                      <option value="annual">Anual</option>
                    </select>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Características del Plan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Básico</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center">
                          <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                          <span>Hasta 10 usuarios</span>
                        </li>
                        <li className="flex items-center">
                          <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                          <span>1 GB almacenamiento</span>
                        </li>
                        <li className="flex items-center">
                          <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                          <span>Soporte por email</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Profesional</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center">
                          <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                          <span>Hasta 50 usuarios</span>
                        </li>
                        <li className="flex items-center">
                          <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                          <span>10 GB almacenamiento</span>
                        </li>
                        <li className="flex items-center">
                          <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                          <span>Soporte prioritario</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Empresarial</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center">
                          <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                          <span>Usuarios ilimitados</span>
                        </li>
                        <li className="flex items-center">
                          <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                          <span>100 GB almacenamiento</span>
                        </li>
                        <li className="flex items-center">
                          <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                          <span>Soporte 24/7</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-2 p-4 bg-blue-50 rounded-md border border-blue-200">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableAutoCreate"
                      name="enableAutoCreate"
                      checked={tenantData.enableAutoCreate}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="enableAutoCreate" className="ml-2 text-sm text-blue-800">
                      Crear automáticamente después de guardar
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-blue-600 ml-6">
                    Si está habilitado, el tenant se creará y configurará automáticamente. De lo contrario, se enviará un email de invitación al contacto.
                  </p>
                </div>
              </div>
            )}

            {/* Admin Account Tab */}
            {activeTab === 'admin' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Cuenta de Administrador</h3>
                
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      {isEditing 
                        ? 'Deja los campos de contraseña en blanco para mantener la contraseña actual.' 
                        : 'Se creará una cuenta de administrador con estos datos para el nuevo tenant.'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Admin Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email de Administrador *
                    </label>
                    <input
                      type="email"
                      name="adminEmail"
                      value={tenantData.adminEmail}
                      onChange={handleChange}
                      className={`w-full border ${errors.adminEmail ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      placeholder="admin@empresa.com"
                      disabled={isEditing}
                    />
                    {errors.adminEmail && (
                      <p className="mt-1 text-xs text-red-500">{errors.adminEmail}</p>
                    )}
                  </div>

                  {/* Empty space for alignment */}
                  <div className="hidden md:block"></div>

                  {/* Admin Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña {!isEditing && '*'}
                    </label>
                    <input
                      type="password"
                      name="adminPassword"
                      value={tenantData.adminPassword}
                      onChange={handleChange}
                      className={`w-full border ${errors.adminPassword ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      placeholder={isEditing ? "Dejar en blanco para no cambiar" : "Contraseña"}
                    />
                    {errors.adminPassword && (
                      <p className="mt-1 text-xs text-red-500">{errors.adminPassword}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Mínimo 8 caracteres, debe incluir letras y números
                    </p>
                  </div>

                  {/* Admin Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Contraseña {!isEditing && '*'}
                    </label>
                    <input
                      type="password"
                      name="adminConfirmPassword"
                      value={tenantData.adminConfirmPassword}
                      onChange={handleChange}
                      className={`w-full border ${errors.adminConfirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      placeholder={isEditing ? "Dejar en blanco para no cambiar" : "Confirmar contraseña"}
                    />
                    {errors.adminConfirmPassword && (
                      <p className="mt-1 text-xs text-red-500">{errors.adminConfirmPassword}</p>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiMail} className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-800">
                        Se enviará un email de bienvenida al administrador con las credenciales de acceso.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* White Label Tab */}
            {activeTab === 'whitelabel' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Personalización de Marca (White Label)</h3>
                
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableWhiteLabel"
                      name="enableWhiteLabel"
                      checked={tenantData.enableWhiteLabel}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="enableWhiteLabel" className="ml-2 text-sm text-blue-800">
                      Habilitar personalización de marca
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-blue-600 ml-6">
                    Permite al cliente personalizar el aspecto de su portal de reclamos con su propia marca.
                  </p>
                </div>
                
                {tenantData.enableWhiteLabel && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Logo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo de la Empresa
                        </label>
                        <div className="flex flex-col items-center">
                          <AvatarUploader 
                            currentAvatar={tenantData.logoUrl} 
                            onAvatarChange={handleLogoChange} 
                            size="lg"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500 text-center">
                          Tamaño recomendado: 200x60px
                        </p>
                      </div>

                      {/* Primary Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color Primario
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            name="primaryColor"
                            value={tenantData.primaryColor}
                            onChange={handleChange}
                            className="h-10 w-10 border border-gray-300 rounded-md"
                          />
                          <input
                            type="text"
                            name="primaryColor"
                            value={tenantData.primaryColor}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            placeholder="#204499"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Este color se usará en botones y elementos destacados
                        </p>
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-4">Vista Previa</h4>
                      <div className="border border-gray-200 rounded-md overflow-hidden">
                        {/* Header */}
                        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
                          <div className="flex justify-between items-center">
                            {tenantData.logoUrl ? (
                              <img 
                                src={tenantData.logoUrl} 
                                alt="Logo" 
                                className="h-8"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://via.placeholder.com/150x50?text=Logo";
                                }}
                              />
                            ) : (
                              <div className="h-8 bg-gray-200 w-32 rounded"></div>
                            )}
                            <div className="flex items-center space-x-4">
                              <div className="h-4 bg-gray-200 w-16 rounded"></div>
                              <div 
                                className="h-8 w-8 rounded-full" 
                                style={{ backgroundColor: tenantData.primaryColor }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 bg-gray-50">
                          <div className="space-y-4">
                            <div className="h-6 bg-gray-200 w-1/2 rounded"></div>
                            <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                            <div className="flex space-x-2">
                              <button 
                                className="px-4 py-2 rounded-md text-white"
                                style={{ backgroundColor: tenantData.primaryColor }}
                              >
                                Botón Principal
                              </button>
                              <button className="px-4 py-2 rounded-md bg-white border border-gray-300">
                                Botón Secundario
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Integraciones</h3>
                
                {/* Email Integration */}
                <div className="space-y-6">
                  <h4 className="text-md font-medium text-gray-800">Integración de Email</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proveedor de Email
                    </label>
                    <select
                      name="emailProvider"
                      value={tenantData.emailProvider}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      <option value="none">Ninguno</option>
                      <option value="google">Google Workspace</option>
                      <option value="outlook">Microsoft Outlook</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Selecciona el proveedor de email para integrarlo con el sistema
                    </p>
                  </div>

                  {tenantData.emailProvider === 'google' && (
                    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                      <h5 className="font-medium text-gray-700 flex items-center">
                        <SafeIcon icon={FiMail} className="w-5 h-5 text-red-500 mr-2" />
                        Configuración de Google Workspace
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client ID de Google *
                          </label>
                          <input
                            type="text"
                            name="googleClientId"
                            value={tenantData.googleClientId}
                            onChange={handleChange}
                            className={`w-full border ${errors.googleClientId ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                            placeholder="123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com"
                          />
                          {errors.googleClientId && (
                            <p className="mt-1 text-xs text-red-500">{errors.googleClientId}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Secret de Google *
                          </label>
                          <input
                            type="password"
                            name="googleClientSecret"
                            value={tenantData.googleClientSecret}
                            onChange={handleChange}
                            className={`w-full border ${errors.googleClientSecret ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                            placeholder="GOCSPX-abcdefghijklmnopqrstuvwxyz"
                          />
                          {errors.googleClientSecret && (
                            <p className="mt-1 text-xs text-red-500">{errors.googleClientSecret}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                        <p className="font-medium mb-1">Instrucciones:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>Ve a la <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a></li>
                          <li>Crea un nuevo proyecto o selecciona uno existente</li>
                          <li>Ve a "Credenciales" y crea una nueva credencial OAuth 2.0</li>
                          <li>Configura los URI de redirección: <code className="bg-gray-100 px-1 rounded">https://{tenantData.domain || `${tenantData.subdomain}.reclamos-seguros.com`}/auth/google/callback</code></li>
                          <li>Copia el Client ID y Client Secret generados</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {tenantData.emailProvider === 'outlook' && (
                    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                      <h5 className="font-medium text-gray-700 flex items-center">
                        <SafeIcon icon={FiMail} className="w-5 h-5 text-blue-500 mr-2" />
                        Configuración de Microsoft Outlook
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client ID de Outlook *
                          </label>
                          <input
                            type="text"
                            name="outlookClientId"
                            value={tenantData.outlookClientId}
                            onChange={handleChange}
                            className={`w-full border ${errors.outlookClientId ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                            placeholder="12345678-abcd-1234-abcd-1234567890ab"
                          />
                          {errors.outlookClientId && (
                            <p className="mt-1 text-xs text-red-500">{errors.outlookClientId}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Secret de Outlook *
                          </label>
                          <input
                            type="password"
                            name="outlookClientSecret"
                            value={tenantData.outlookClientSecret}
                            onChange={handleChange}
                            className={`w-full border ${errors.outlookClientSecret ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                            placeholder="abc123DEF456~_-ghi789JKL0mnoPQR1stu"
                          />
                          {errors.outlookClientSecret && (
                            <p className="mt-1 text-xs text-red-500">{errors.outlookClientSecret}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                        <p className="font-medium mb-1">Instrucciones:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>Ve al <a href="https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Portal de Azure</a></li>
                          <li>Registra una nueva aplicación</li>
                          <li>Configura los URI de redirección: <code className="bg-gray-100 px-1 rounded">https://{tenantData.domain || `${tenantData.subdomain}.reclamos-seguros.com`}/auth/outlook/callback</code></li>
                          <li>Genera un nuevo secreto de cliente</li>
                          <li>Copia el ID de aplicación (client ID) y el valor del secreto</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stripe Integration */}
                <div className="mt-8 space-y-4">
                  <h4 className="text-md font-medium text-gray-800">Integración de Pagos</h4>
                  
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <SafeIcon icon={FiCreditCard} className="w-5 h-5 text-purple-600" />
                      <h5 className="font-medium text-gray-700">Stripe</h5>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      La integración de pagos con Stripe se configura a nivel global para todos los tenants. 
                      Los tenants pueden activar sus propios métodos de pago desde su panel de administración.
                    </p>
                    
                    <div className="flex items-center p-3 bg-gray-50 rounded-md">
                      <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">Integración de Stripe configurada a nivel global</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => navigate('/superadmin/tenants')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SafeIcon icon={saving ? FiX : FiSave} className="w-5 h-5" />
            <span>{saving ? 'Guardando...' : 'Guardar Tenant'}</span>
          </button>
        </div>
      </div>

      {/* Success Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="rounded-full bg-green-100 p-2">
                <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">{isEditing ? 'Tenant Actualizado' : 'Tenant Creado'}</h3>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                {isEditing 
                  ? `El tenant "${tenantData.name}" ha sido actualizado exitosamente.` 
                  : `El nuevo tenant "${tenantData.name}" ha sido creado exitosamente.`}
              </p>
              
              {!isEditing && (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
                  <p className="text-sm text-blue-800">
                    {tenantData.enableAutoCreate 
                      ? 'Se ha enviado un email de bienvenida al administrador con las credenciales de acceso.' 
                      : 'Se ha enviado un email de invitación al contacto para completar la configuración del tenant.'}
                  </p>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Tenant:</span> {tenantData.name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Dominio:</span> {tenantData.domain || `${tenantData.subdomain}.reclamos-seguros.com`}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Plan:</span> {tenantData.plan} ({tenantData.billingCycle === 'monthly' ? 'Mensual' : 'Anual'})
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleConfirmation}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CreateEditTenant;