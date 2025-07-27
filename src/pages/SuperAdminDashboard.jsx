import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiUsers, FiCreditCard, FiSettings, FiMail, 
  FiBarChart2, FiGlobe, FiGrid, FiLayers,
  FiActivity, FiDollarSign, FiAward
} = FiIcons;

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTenants: 24,
    activeTenants: 21,
    pendingTenants: 3,
    monthlyRevenue: 12450,
    mrr: 8700,
    activeUsers: 845
  });

  const plans = [
    { name: 'Básico', count: 8, revenue: 2400, color: 'bg-blue-100 text-blue-800' },
    { name: 'Profesional', count: 11, revenue: 5500, color: 'bg-purple-100 text-purple-800' },
    { name: 'Empresarial', count: 5, revenue: 4550, color: 'bg-green-100 text-green-800' }
  ];

  const recentTenants = [
    { 
      id: 1, 
      name: 'Seguros MX', 
      email: 'admin@segurosmx.com', 
      plan: 'Profesional', 
      status: 'active',
      createdAt: '2024-06-01',
      domain: 'reclamos.segurosmx.com'
    },
    { 
      id: 2, 
      name: 'Aseguradora Global', 
      email: 'admin@aseglobal.com', 
      plan: 'Empresarial', 
      status: 'active',
      createdAt: '2024-05-28',
      domain: 'claims.aseglobal.com'
    },
    { 
      id: 3, 
      name: 'Seguros del Valle', 
      email: 'admin@segurosdelvalle.com', 
      plan: 'Básico', 
      status: 'pending',
      createdAt: '2024-05-25',
      domain: 'pendiente'
    }
  ];

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'Básico': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Básico</span>;
      case 'Profesional': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Profesional</span>;
      case 'Empresarial': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Empresarial</span>;
      default: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{plan}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Activo</span>;
      case 'pending': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>;
      case 'suspended': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Suspendido</span>;
      default: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Layout title="Panel SuperAdmin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Panel SuperAdmin</h2>
            <p className="text-gray-600">Gestión centralizada de la plataforma SAAS</p>
          </div>
          <button
            onClick={() => navigate('/superadmin/tenants/new')}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <SafeIcon icon={FiUsers} className="w-5 h-5" />
            <span>Nuevo Tenant</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-full bg-blue-100">
                <SafeIcon icon={FiUsers} className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Tenants</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTenants}</p>
                <p className="text-sm text-gray-500">
                  <span className="text-green-600 font-medium">{stats.activeTenants} activos</span>, 
                  <span className="text-yellow-600 font-medium"> {stats.pendingTenants} pendientes</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-full bg-green-100">
                <SafeIcon icon={FiDollarSign} className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ingresos Mensuales</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
                <p className="text-sm text-gray-500">
                  <span className="text-green-600 font-medium">MRR: {formatCurrency(stats.mrr)}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-full bg-purple-100">
                <SafeIcon icon={FiActivity} className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Usuarios Activos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</p>
                <p className="text-sm text-gray-500">
                  <span className="text-green-600 font-medium">↑ 12% desde el mes pasado</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plans Distribution */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución de Planes</h3>
            <div className="space-y-4">
              {plans.map((plan, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${plan.color.replace('text-', 'bg-').replace('-100', '-600')}`}></span>
                    <span className="text-sm text-gray-700">{plan.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{plan.count} tenants</span>
                    <span className="text-sm font-medium text-gray-800">{formatCurrency(plan.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="h-8 w-full rounded-full overflow-hidden bg-gray-200">
                {plans.map((plan, index) => (
                  <div 
                    key={index}
                    className={`h-full float-left ${plan.color.replace('text-', 'bg-').replace('-100', '-600')}`}
                    style={{ width: `${(plan.count / stats.totalTenants) * 100}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Tenants */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Tenants Recientes</h3>
              <button 
                onClick={() => navigate('/superadmin/tenants')} 
                className="text-primary hover:text-primary-dark text-sm"
              >
                Ver todos
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {recentTenants.map(tenant => (
                <div key={tenant.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">{tenant.name}</h4>
                      <p className="text-sm text-gray-500">{tenant.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getPlanBadge(tenant.plan)}
                        {getStatusBadge(tenant.status)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Creado:</span> {tenant.createdAt}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Dominio:</span> {tenant.domain}
                      </p>
                      <button 
                        onClick={() => navigate(`/superadmin/tenants/${tenant.id}`)} 
                        className="text-primary hover:text-primary-dark text-sm"
                      >
                        Administrar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Access Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/superadmin/tenants')}
          >
            <div className="flex items-center space-x-3 mb-2">
              <SafeIcon icon={FiUsers} className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Tenants</h3>
            </div>
            <p className="text-gray-500 text-sm">Gestión de cuentas de clientes</p>
          </div>
          
          <div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/superadmin/subscriptions')}
          >
            <div className="flex items-center space-x-3 mb-2">
              <SafeIcon icon={FiCreditCard} className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">Suscripciones</h3>
            </div>
            <p className="text-gray-500 text-sm">Planes y pagos de Stripe</p>
          </div>
          
          <div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/superadmin/whitelabel')}
          >
            <div className="flex items-center space-x-3 mb-2">
              <SafeIcon icon={FiGlobe} className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900">White Label</h3>
            </div>
            <p className="text-gray-500 text-sm">Personalización de marca</p>
          </div>
          
          <div 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/superadmin/integrations')}
          >
            <div className="flex items-center space-x-3 mb-2">
              <SafeIcon icon={FiMail} className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">Integraciones</h3>
            </div>
            <p className="text-gray-500 text-sm">Email y servicios externos</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuperAdminDashboard;