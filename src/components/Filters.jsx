import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiFilter, FiX, FiSearch } = FiIcons;

const Filters = ({ filters, setFilters }) => {
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
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleIncludeChange = (field) => {
    setFilters(prev => ({ ...prev, [field]: { ...prev[field], include: !prev[field].include } }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        </div>
        <button
          onClick={handleReset}
          className="text-sm text-gray-600 hover:text-primary flex items-center space-x-1"
        >
          <SafeIcon icon={FiX} className="w-4 h-4" />
          <span>Resetear filtros</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Búsqueda por palabra clave */}
        <div className="flex-1 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Palabra clave
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              placeholder="Buscar por nombre, póliza, servicio, grupo o agente..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
            />
            {filters.keyword && (
              <button
                onClick={() => handleFilterChange('keyword', '')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <SafeIcon icon={FiX} className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Estatus */}
        <div className="w-full md:w-48">
          <div className="flex justify-between items-center mb-1">
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
            <option value="">Todos los estatus</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Verificado">Verificado</option>
            <option value="Rechazado">Rechazado</option>
            <option value="Enviado a Aseguradora">Enviado a Aseguradora</option>
            <option value="Archivado">Archivado</option>
            <option value="Aprobado">Aprobado</option>
          </select>
        </div>

        {/* Tipo de Reclamo */}
        <div className="w-full md:w-48">
          <div className="flex justify-between items-center mb-1">
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
            <option value="">Todos los tipos</option>
            <option value="Reembolso">Reembolso</option>
            <option value="Programación">Programación</option>
            <option value="Maternidad">Maternidad</option>
          </select>
        </div>

        {/* Fecha Desde */}
        <div className="w-full md:w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
        <div className="w-full md:w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
  );
};

export default Filters;