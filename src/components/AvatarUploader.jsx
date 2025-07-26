import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUpload, FiLink, FiUser, FiX } = FiIcons;

const AvatarUploader = ({ 
  currentAvatar, 
  onAvatarChange, 
  disabled = false, 
  size = 'md' 
}) => {
  const [uploadMethod, setUploadMethod] = useState('url');
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar || '');
  const [uploading, setUploading] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const buttonSizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-xs px-3 py-2',
    lg: 'text-sm px-4 py-2'
  };

  const handleUrlSubmit = () => {
    if (!avatarUrl.trim()) {
      onAvatarChange('');
      return;
    }

    // Validar URL
    try {
      new URL(avatarUrl);
      onAvatarChange(avatarUrl);
    } catch {
      alert('Por favor ingresa una URL válida');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten imágenes PNG y JPG.');
      return;
    }

    if (file.size > maxFileSize) {
      alert('La imagen es muy grande. Máximo 2MB.');
      return;
    }

    setUploading(true);
    try {
      // En un entorno real, aquí subirías el archivo a un servicio como Cloudinary, AWS S3, etc.
      // Por ahora, usaremos un URL temporal del objeto
      const url = URL.createObjectURL(file);
      onAvatarChange(url);
    } catch (error) {
      alert('Error al subir la imagen');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = () => {
    setAvatarUrl('');
    onAvatarChange('');
  };

  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return '';
  };

  const getAvatarColor = (name) => {
    if (!name) return '#CCCCCC';
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

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Preview */}
      <div className={`${sizeClasses[size]} relative`}>
        {currentAvatar ? (
          <img
            src={currentAvatar}
            alt="Avatar"
            className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-300`}
          />
        ) : (
          <div
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-gray-300`}
            style={{ backgroundColor: getAvatarColor('Usuario') }}
          >
            <SafeIcon icon={FiUser} className="w-6 h-6" />
          </div>
        )}
        
        {/* Remove button */}
        {currentAvatar && !disabled && (
          <button
            type="button"
            onClick={removeAvatar}
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            title="Eliminar avatar"
          >
            <SafeIcon icon={FiX} className="w-3 h-3" />
          </button>
        )}
      </div>

      {!disabled && (
        <div className="w-full max-w-xs">
          {/* Method selector */}
          <div className="flex space-x-2 mb-3">
            <button
              type="button"
              onClick={() => setUploadMethod('url')}
              className={`flex-1 ${buttonSizeClasses[size]} rounded-md font-medium transition-colors ${
                uploadMethod === 'url'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <SafeIcon icon={FiLink} className="w-3 h-3 inline mr-1" />
              URL
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('upload')}
              className={`flex-1 ${buttonSizeClasses[size]} rounded-md font-medium transition-colors ${
                uploadMethod === 'upload'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <SafeIcon icon={FiUpload} className="w-3 h-3 inline mr-1" />
              Subir
            </button>
          </div>

          {/* URL Input */}
          {uploadMethod === 'url' && (
            <div className="space-y-2">
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://ejemplo.com/avatar.jpg"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className={`w-full bg-primary text-white ${buttonSizeClasses[size]} rounded-md hover:bg-primary-dark transition-colors`}
              >
                Aplicar URL
              </button>
            </div>
          )}

          {/* File Upload */}
          {uploadMethod === 'upload' && (
            <div>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="avatar-file-upload"
              />
              <label
                htmlFor="avatar-file-upload"
                className={`block w-full bg-primary text-white ${buttonSizeClasses[size]} rounded-md hover:bg-primary-dark transition-colors text-center cursor-pointer ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? (
                  <span>Subiendo...</span>
                ) : (
                  <>
                    <SafeIcon icon={FiUpload} className="w-3 h-3 inline mr-1" />
                    Seleccionar imagen
                  </>
                )}
              </label>
              <p className="text-xs text-gray-500 mt-1 text-center">
                PNG, JPG - Máximo 2MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AvatarUploader;