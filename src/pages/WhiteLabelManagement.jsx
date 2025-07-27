import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AvatarUploader from '../components/AvatarUploader';

const { FiArrowLeft, FiGlobe, FiPalette, FiImage, FiSave, FiEye, FiSettings } = FiIcons;

const WhiteLabelManagement = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    platformName: 'Portal de Reclamos',
    logoUrl: 'https://storage.googleapis.com/msgsndr/HWRXLf7lstECUAG07eRw/media/685d77c05c72d29e532e823f.png',
    primaryColor: '#204499',
    secondaryColor: '#1a3a7f',
    accentColor: '#2d52b8',
    backgroundColor: '#f9fafb',
    footerText: 'Powered by agendia.ai',
    supportEmail: 'hola@agendia.ai',
    allowTenantCustomization: true,
    requireApproval: false
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoChange = (logoUrl) => {
    setSettings(prev => ({
      ...prev,
      logoUrl
    }));
  };

  const handleSave = () => {
    // Simular guardado
    alert('Configuración de White Label guardada exitosamente');
  };

  const colorPresets = [
    { name: 'Azul Corporativo', primary: '#204499', secondary: '#1a3a7f', accent: '#2d52b8' },
    { name: 'Verde Profesional', primary: '#059669', secondary: '#047857', accent: '#10b981' },
    { name: 'Púrpura Moderno', primary: '#7c3aed', secondary: '#6d28d9', accent: '#8b5cf6' },
    { name: 'Rojo Dinámico', primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444' },
    { name: 'Naranja Vibrante', primary: '#ea580c', secondary: '#c2410c', accent: '#f97316' },
    { name: 'Gris Elegante', primary: '#374151', secondary: '#1f2937', accent: '#4b5563' }
  ];

  const applyColorPreset = (preset) => {
    setSettings(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    }));
  };

  return (
    <Layout title="White Label Management">
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
              <h2 className="text-2xl font-bold text-gray-900">Gestión White Label</h2>
              <p className="text-gray-600">Personaliza la apariencia global de la plataforma</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <SafeIcon icon={FiEye} className="w-5 h-5" />
              <span>{previewMode ? 'Salir Vista Previa' : 'Vista Previa'}</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <SafeIcon icon={FiSave} className="w-5 h-5" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Configuración */}
          <div className="lg:col-span-2 space-y-6">
            {/* Configuración General */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <SafeIcon icon={FiSettings} className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-gray-900">Configuración General</h3>
              </div>
              
              <div className="space-y-6">
                {/* Nombre de la Plataforma */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Plataforma
                  </label>
                  <input
                    type="text"
                    name="platformName"
                    value={settings.platformName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Portal de Reclamos"
                  />
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo de la Plataforma
                  </label>
                  <div className="flex flex-col items-center">
                    <AvatarUploader 
                      currentAvatar={settings.logoUrl} 
                      onAvatarChange={handleLogoChange} 
                      size="lg"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 text-center">
                    Tamaño recomendado: 200x60px
                  </p>
                </div>

                {/* Email de Soporte */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Soporte
                  </label>
                  <input
                    type="email"
                    name="supportEmail"
                    value={settings.supportEmail}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="soporte@tudominio.com"
                  />
                </div>

                {/* Texto del Footer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto del Footer
                  </label>
                  <input
                    type="text"
                    name="footerText"
                    value={settings.footerText}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Powered by tu empresa"
                  />
                </div>
              </div>
            </div>

            {/* Configuración de Colores */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <SafeIcon icon={FiPalette} className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-gray-900">Esquema de Colores</h3>
              </div>

              {/* Presets de Color */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Esquemas Predefinidos
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {colorPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => applyColorPreset(preset)}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
                    >
                      <div className="flex space-x-1">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: preset.primary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: preset.secondary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: preset.accent }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Color Primario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Primario
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      name="primaryColor"
                      value={settings.primaryColor}
                      onChange={handleChange}
                      className="h-10 w-16 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      name="primaryColor"
                      value={settings.primaryColor}
                      onChange={handleChange}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="#204499"
                    />
                  </div>
                </div>

                {/* Color Secundario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Secundario
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      name="secondaryColor"
                      value={settings.secondaryColor}
                      onChange={handleChange}
                      className="h-10 w-16 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      name="secondaryColor"
                      value={settings.secondaryColor}
                      onChange={handleChange}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="#1a3a7f"
                    />
                  </div>
                </div>

                {/* Color de Acento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color de Acento
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      name="accentColor"
                      value={settings.accentColor}
                      onChange={handleChange}
                      className="h-10 w-16 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      name="accentColor"
                      value={settings.accentColor}
                      onChange={handleChange}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="#2d52b8"
                    />
                  </div>
                </div>

                {/* Color de Fondo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color de Fondo
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      name="backgroundColor"
                      value={settings.backgroundColor}
                      onChange={handleChange}
                      className="h-10 w-16 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      name="backgroundColor"
                      value={settings.backgroundColor}
                      onChange={handleChange}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="#f9fafb"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración de Tenants */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <SafeIcon icon={FiGlobe} className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-gray-900">Configuración para Tenants</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowTenantCustomization"
                    name="allowTenantCustomization"
                    checked={settings.allowTenantCustomization}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="allowTenantCustomization" className="ml-2 text-sm text-gray-700">
                    Permitir personalización por tenant
                  </label>
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Los tenants podrán personalizar su logo y colores desde su panel de administración
                </p>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireApproval"
                    name="requireApproval"
                    checked={settings.requireApproval}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="requireApproval" className="ml-2 text-sm text-gray-700">
                    Requerir aprobación para cambios de branding
                  </label>
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  Los cambios de branding de los tenants requerirán aprobación del SuperAdmin
                </p>
              </div>
            </div>
          </div>

          {/* Vista Previa */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiEye} className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-gray-900">Vista Previa</h3>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header Preview */}
                <div className="p-4 border-b border-gray-200" style={{ backgroundColor: settings.backgroundColor }}>
                  <div className="flex justify-between items-center">
                    {settings.logoUrl ? (
                      <img 
                        src={settings.logoUrl} 
                        alt="Logo" 
                        className="h-8 max-w-32 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150x50?text=Logo";
                        }}
                      />
                    ) : (
                      <div className="h-8 bg-gray-200 w-32 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">Logo</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <div className="h-6 bg-gray-200 w-16 rounded"></div>
                      <div 
                        className="h-8 w-8 rounded-full" 
                        style={{ backgroundColor: settings.primaryColor }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Content Preview */}
                <div className="p-4" style={{ backgroundColor: settings.backgroundColor }}>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                    <div className="h-3 bg-gray-200 w-full rounded"></div>
                    <div className="h-3 bg-gray-200 w-5/6 rounded"></div>
                    
                    <div className="flex space-x-2 mt-4">
                      <button 
                        className="px-3 py-1 rounded text-white text-xs"
                        style={{ backgroundColor: settings.primaryColor }}
                      >
                        Primario
                      </button>
                      <button 
                        className="px-3 py-1 rounded text-white text-xs"
                        style={{ backgroundColor: settings.secondaryColor }}
                      >
                        Secundario
                      </button>
                      <button 
                        className="px-3 py-1 rounded text-white text-xs"
                        style={{ backgroundColor: settings.accentColor }}
                      >
                        Acento
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Footer Preview */}
                <div 
                  className="p-3 text-center border-t border-gray-200" 
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  <p className="text-xs text-white">{settings.footerText}</p>
                  <p className="text-xs text-white opacity-75">
                    ¿Necesitas ayuda? {settings.supportEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WhiteLabelManagement;