import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiDownload, FiZoomIn, FiZoomOut, FiRotateCw } = FiIcons;

const DocumentPreview = ({ document, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const isImage = document.type.startsWith('image/');
  const isPdf = document.type === 'application/pdf';

  useEffect(() => {
    // Para imágenes, precargar para detectar errores
    if (isImage) {
      const img = new Image();
      img.onload = () => setLoading(false);
      img.onerror = () => {
        setError('Error al cargar la imagen');
        setLoading(false);
      };
      img.src = document.url;
    } else {
      setLoading(false);
    }

    // Limpiar al desmontar
    return () => {
      // No es necesario limpiar URLs aquí, ya que se hace en el componente padre
    };
  }, [document, isImage]);

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-full text-red-500">
          <SafeIcon icon={FiX} className="w-12 h-12 mb-4" />
          <p>{error}</p>
        </div>
      );
    }

    if (isImage) {
      return (
        <div className="flex justify-center items-center h-full overflow-auto">
          <img
            src={document.url}
            alt={document.name}
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.3s ease'
            }}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="h-full w-full">
          <iframe
            src={`${document.url}#zoom=${zoom * 100}`}
            title={document.name}
            className="w-full h-full"
            style={{ border: 'none' }}
          ></iframe>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center items-center h-full">
        <SafeIcon icon={FiX} className="w-12 h-12 mb-4 text-gray-400" />
        <p className="text-gray-500">Vista previa no disponible para este tipo de archivo</p>
        <button 
          onClick={handleDownload}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center"
        >
          <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
          Descargar archivo
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 flex flex-col" style={{ height: '85vh' }}>
        {/* Encabezado */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 truncate">
            <p className="font-medium text-gray-900 truncate" title={document.name}>{document.name}</p>
            <span className="text-sm text-gray-500">({document.type.split('/')[1]})</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100 transition-colors"
              title="Descargar"
            >
              <SafeIcon icon={FiDownload} className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
              title="Cerrar"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Controles */}
        {(isImage || isPdf) && (
          <div className="flex items-center justify-center space-x-4 py-2 bg-gray-100">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-700 hover:text-primary rounded-full hover:bg-gray-200 transition-colors"
              title="Reducir"
            >
              <SafeIcon icon={FiZoomOut} className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-700">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-700 hover:text-primary rounded-full hover:bg-gray-200 transition-colors"
              title="Ampliar"
            >
              <SafeIcon icon={FiZoomIn} className="w-5 h-5" />
            </button>
            {isImage && (
              <button
                onClick={handleRotate}
                className="p-2 text-gray-700 hover:text-primary rounded-full hover:bg-gray-200 transition-colors"
                title="Rotar"
              >
                <SafeIcon icon={FiRotateCw} className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Contenido */}
        <div className="flex-1 overflow-auto bg-gray-200 p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;