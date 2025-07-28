import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiFilter, FiX, FiSearch, FiChevronDown, FiChevronUp } = FiIcons;

const Filters = ({ filters, setFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Si cambiamos a desktop, expandir automáticamente
      if (window.innerWidth >= 768) {
        setIsExpanded(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Expandir por defecto en desktop, colapsar en móvil
  useEffect(() => {
    if (!isMobile) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [isMobile]);

  const handleReset = () => {
    setFilters({
      keyword: '',
      status: { value: '', include: true },
      type: { value: '', include: true },
      dateFrom: '',
      dateTo: '',
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIncludeChange = (field) => {
    setFilters(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        include: !prev[field].include
      }
    }));
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = () => {
    return filters.keyword || 
           filters.status.value || 
           filters.type.value || 
           filters.dateFrom || 
           filters.dateTo;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.keyword) count++;
    if (filters.status.value) count++;
    if (filters.type.value) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header del filtro - siempre visible */}
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Filtros</h3>
            {/* Indicador de filtros activos - solo en móvil cuando está colapsado */}
            {isMobile && !isExpanded && hasActiveFilters() && (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
                  {getActiveFiltersCount()} activo{getActiveFiltersCount() > 1 ? 's' : ''}
                </span>
                <span className="text-xs text-primary font-medium animate-pulse">
                  Toca para ver
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Botón de reset - solo visible cuando hay filtros activos */}
            {hasActiveFilters() && (
              <button
                onClick={handleReset}
                className="text-xs sm:text-sm text-gray-600 hover:text-primary flex items-center space-x-1"
              >
                <SafeIcon icon={FiX} className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline">Resetear</span>
              </button>
            )}
            {/* Botón de expandir/colapsar - solo en móvil */}
            {isMobile && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-1 text-primary hover:text-primary-dark transition-colors"
              >
                <SafeIcon 
                  icon={isExpanded ? FiChevronUp : FiChevronDown} 
                  className="w-4 h-4" 
                />
                <span className="text-sm font-medium">
                  {isExpanded ? 'Ocultar' : 'Mostrar'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido de filtros - colapsable en móvil */}
      {(isExpanded || !isMobile) && (
        <div className="px-4 sm:px-6 pb-4 border-t border-gray-100">
          <div className="pt-4 space-y-4">
            <div className="flex flex-col space-y-4">
              {/* Búsqueda por palabra clave */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palabra clave
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiSearch} className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    placeholder="Buscar por nombre, póliza, servicio..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                  />
                  {filters.keyword && (
                    <button
                      onClick={() => handleFilterChange('keyword', '')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <SafeIcon icon={FiX} className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Grid de filtros adicionales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Estatus */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Estatus
                    </label>
                    <button
                      onClick={() => handleIncludeChange('status')}
                      className={`text-xs ${filters.status.include ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {filters.status.include ? 'Incluir' : 'Excluir'}
                    </button>
                  </div>
                  <select
                    value={filters.status.value}
                    onChange={(e) => handleFilterChange('status', { ...filters.status, value: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Verificado">Verificado</option>
                    <option value="Rechazado">Rechazado</option>
                    <option value="Enviado a Aseguradora">Enviado a Aseguradora</option>
                    <option value="Archivado">Archivado</option>
                    <option value="Aprobado">Aprobado</option>
                  </select>
                </div>

                {/* Tipo de Reclamo */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo
                    </label>
                    <button
                      onClick={() => handleIncludeChange('type')}
                      className={`text-xs ${filters.type.include ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {filters.type.include ? 'Incluir' : 'Excluir'}
                    </button>
                  </div>
                  <select
                    value={filters.type.value}
                    onChange={(e) => handleFilterChange('type', { ...filters.type, value: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="Reembolso">Reembolso</option>
                    <option value="Programación">Programación</option>
                    <option value="Maternidad">Maternidad</option>
                  </select>
                </div>

                {/* Fecha Desde */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                  />
                </div>

                {/* Fecha Hasta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;