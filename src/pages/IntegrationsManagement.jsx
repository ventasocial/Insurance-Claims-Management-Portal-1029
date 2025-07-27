import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiArrowLeft, FiMail, FiSettings, FiCheck, FiX, FiAlertTriangle,
  FiKey, FiLink, FiServer, FiCloud, FiShield, FiRefreshCw
} = FiIcons;

const IntegrationsManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('email');
  const [integrations, setIntegrations] = useState({
    email: {
      google: {
        enabled: true,
        clientId: 'global-google-client-id',
        clientSecret: '••••••••••••••••',
        status: 'connected',
        lastSync: '2024-06-15T10:30:00'
      },
      outlook: {
        enabled: false,
        clientId: '',
        clientSecret: '',
        status: 'disconnected',
        lastSync: null
      },
      smtp: {
        enabled: true,
        host: 'smtp.platform.com',
        port: 587,
        username: 'noreply@platform.com',
        password: '••••••••••••••••',
        status: 'connected',
        lastSync: '2024-06-15T09:15:00'
      }
    },
    storage: {
      aws: {
        enabled: true,
        accessKey: 'AKIA••••••••••••',
        secretKey: '••••••••••••••••••••••••••••••••',
        bucket: 'platform-documents',
        region: 'us-east-1',
        status: 'connected'
      },
      gcp: {
        enabled: false,
        projectId: '',
        serviceAccount: '',
        bucket: '',
        status: 'disconnected'
      }
    },
    payment: {
      stripe: {
        enabled: true,
        publishableKey: 'pk_live_••••••••••••••••••••••••',
        secretKey: 'sk_live_••••••••••••••••••••••••',
        webhookSecret: 'whsec_••••••••••••••••••••',
        status: 'connected',
        lastSync: '2024-06-15T11:45:00'
      }
    },
    analytics: {
      googleAnalytics: {
        enabled: false,
        trackingId: '',
        status: 'disconnected'
      },
      mixpanel: {
        enabled: false,
        projectToken: '',
        status: 'disconnected'
      }
    }
  });

  const [editingIntegration, setEditingIntegration] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditIntegration = (category, service) => {
    setEditingIntegration(`${category}-${service}`);
    setEditForm({ ...integrations[category][service] });
  };

  const handleSaveIntegration = () => {
    const [category, service] = editingIntegration.split('-');
    setIntegrations(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [service]: { ...editForm }
      }
    }));
    setEditingIntegration(null);
    setEditForm({});
  };

  const handleToggleIntegration = (category, service) => {
    setIntegrations(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [service]: {
          ...prev[category][service],
          enabled: !prev[category][service].enabled,
          status: !prev[category][service].enabled ? 'connected' : 'disconnected'
        }
      }
    }));
  };

  const handleTestConnection = (category, service) => {
    // Simular prueba de conexión
    alert(`Probando conexión para ${service}...`);
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [service]: {
            ...prev[category][service],
            status: 'connected',
            lastSync: new Date().toISOString()
          }
        }
      }));
      alert('Conexión exitosa!');
    }, 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'connected':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Conectado</span>;
      case 'disconnected':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Desconectado</span>;
      case 'error':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Error</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const renderEmailIntegrations = () => (
    <div className="space-y-6">
      {/* Google Workspace */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <SafeIcon icon={FiMail} className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Google Workspace</h3>
              <p className="text-sm text-gray-500">Integración global para autenticación OAuth</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(integrations.email.google.status)}
            <button
              onClick={() => handleToggleIntegration('email', 'google')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                integrations.email.google.enabled ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  integrations.email.google.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {integrations.email.google.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client ID Global
                </label>
                <input
                  type="text"
                  value={integrations.email.google.clientId}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Secret
                </label>
                <input
                  type="password"
                  value={integrations.email.google.clientSecret}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditIntegration('email', 'google')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleTestConnection('email', 'google')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                Probar Conexión
              </button>
            </div>
            {integrations.email.google.lastSync && (
              <p className="text-xs text-gray-500">
                Última sincronización: {new Date(integrations.email.google.lastSync).toLocaleString('es-MX')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Microsoft Outlook */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiMail} className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Microsoft Outlook</h3>
              <p className="text-sm text-gray-500">Integración con Microsoft 365</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(integrations.email.outlook.status)}
            <button
              onClick={() => handleToggleIntegration('email', 'outlook')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                integrations.email.outlook.enabled ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  integrations.email.outlook.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {integrations.email.outlook.enabled && (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                Configuración pendiente. Haz clic en "Configurar" para completar la integración.
              </p>
            </div>
            <button
              onClick={() => handleEditIntegration('email', 'outlook')}
              className="mt-2 px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
            >
              Configurar
            </button>
          </div>
        )}
      </div>

      {/* SMTP Global */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <SafeIcon icon={FiServer} className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">SMTP Global</h3>
              <p className="text-sm text-gray-500">Servidor SMTP para envío de emails</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(integrations.email.smtp.status)}
            <button
              onClick={() => handleToggleIntegration('email', 'smtp')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                integrations.email.smtp.enabled ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  integrations.email.smtp.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {integrations.email.smtp.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servidor SMTP
                </label>
                <input
                  type="text"
                  value={integrations.email.smtp.host}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Puerto
                </label>
                <input
                  type="text"
                  value={integrations.email.smtp.port}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditIntegration('email', 'smtp')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleTestConnection('email', 'smtp')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                Probar Conexión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStorageIntegrations = () => (
    <div className="space-y-6">
      {/* AWS S3 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <SafeIcon icon={FiCloud} className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Amazon S3</h3>
              <p className="text-sm text-gray-500">Almacenamiento de documentos y archivos</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(integrations.storage.aws.status)}
            <button
              onClick={() => handleToggleIntegration('storage', 'aws')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                integrations.storage.aws.enabled ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  integrations.storage.aws.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {integrations.storage.aws.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Key
                </label>
                <input
                  type="text"
                  value={integrations.storage.aws.accessKey}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bucket
                </label>
                <input
                  type="text"
                  value={integrations.storage.aws.bucket}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditIntegration('storage', 'aws')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleTestConnection('storage', 'aws')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                Probar Conexión
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Google Cloud Storage */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiCloud} className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Google Cloud Storage</h3>
              <p className="text-sm text-gray-500">Alternativa de almacenamiento en Google Cloud</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(integrations.storage.gcp.status)}
            <button
              onClick={() => handleToggleIntegration('storage', 'gcp')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                integrations.storage.gcp.enabled ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  integrations.storage.gcp.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {integrations.storage.gcp.enabled && (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                Configuración pendiente. Configura las credenciales de Google Cloud.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPaymentIntegrations = () => (
    <div className="space-y-6">
      {/* Stripe */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <SafeIcon icon={FiShield} className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Stripe</h3>
              <p className="text-sm text-gray-500">Procesamiento de pagos y suscripciones</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(integrations.payment.stripe.status)}
            <button
              onClick={() => handleToggleIntegration('payment', 'stripe')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                integrations.payment.stripe.enabled ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  integrations.payment.stripe.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {integrations.payment.stripe.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publishable Key
                </label>
                <input
                  type="text"
                  value={integrations.payment.stripe.publishableKey}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook Secret
                </label>
                <input
                  type="password"
                  value={integrations.payment.stripe.webhookSecret}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditIntegration('payment', 'stripe')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleTestConnection('payment', 'stripe')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                Probar Conexión
              </button>
            </div>
            {integrations.payment.stripe.lastSync && (
              <p className="text-xs text-gray-500">
                Última sincronización: {new Date(integrations.payment.stripe.lastSync).toLocaleString('es-MX')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout title="Gestión de Integraciones">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/superadmin')}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Integraciones</h2>
              <p className="text-gray-600">Configura las integraciones globales de la plataforma</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('email')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'email'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiMail} className="w-4 h-4" />
                <span>Email</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'storage'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCloud} className="w-4 h-4" />
                <span>Almacenamiento</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payment'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiShield} className="w-4 h-4" />
                <span>Pagos</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'email' && renderEmailIntegrations()}
          {activeTab === 'storage' && renderStorageIntegrations()}
          {activeTab === 'payment' && renderPaymentIntegrations()}
        </div>
      </div>

      {/* Modal de Edición */}
      {editingIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiKey} className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-medium text-gray-900">Editar Integración</h3>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Actualiza las credenciales de la integración seleccionada.
              </p>
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    Los cambios afectarán a todos los tenants que utilicen esta integración.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditingIntegration(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveIntegration}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default IntegrationsManagement;