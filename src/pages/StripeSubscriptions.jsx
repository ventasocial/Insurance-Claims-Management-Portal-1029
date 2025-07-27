import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiArrowLeft, FiCreditCard, FiDollarSign, FiUsers, FiCheckCircle, 
  FiAlertTriangle, FiPlusCircle, FiArchive, FiX, FiCheck, FiDownload
} = FiIcons;

const StripeSubscriptions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  
  // Datos de ejemplo
  const subscriptions = [
    {
      id: 'sub_1234567890',
      tenantId: 1,
      tenantName: 'Seguros MX',
      plan: 'Profesional',
      status: 'active',
      amount: 4900,
      currency: 'mxn',
      interval: 'month',
      startDate: '2024-05-01',
      endDate: '2025-05-01',
      cancelAt: null,
      paymentMethod: {
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025
      },
      invoices: [
        {
          id: 'in_1234567890',
          amount: 4900,
          currency: 'mxn',
          status: 'paid',
          date: '2024-05-01',
          pdf: '#'
        }
      ]
    },
    {
      id: 'sub_0987654321',
      tenantId: 2,
      tenantName: 'Aseguradora Global',
      plan: 'Empresarial',
      status: 'active',
      amount: 9900,
      currency: 'mxn',
      interval: 'month',
      startDate: '2024-04-15',
      endDate: '2025-04-15',
      cancelAt: null,
      paymentMethod: {
        brand: 'mastercard',
        last4: '5678',
        expMonth: 10,
        expYear: 2026
      },
      invoices: [
        {
          id: 'in_0987654321',
          amount: 9900,
          currency: 'mxn',
          status: 'paid',
          date: '2024-04-15',
          pdf: '#'
        }
      ]
    },
    {
      id: 'sub_1357924680',
      tenantId: 4,
      tenantName: 'Protección Total',
      plan: 'Profesional',
      status: 'past_due',
      amount: 4900,
      currency: 'mxn',
      interval: 'month',
      startDate: '2024-04-15',
      endDate: '2024-05-15',
      cancelAt: null,
      paymentMethod: {
        brand: 'amex',
        last4: '9012',
        expMonth: 8,
        expYear: 2024
      },
      invoices: [
        {
          id: 'in_1357924680',
          amount: 4900,
          currency: 'mxn',
          status: 'unpaid',
          date: '2024-05-15',
          pdf: '#'
        }
      ]
    },
    {
      id: 'sub_2468013579',
      tenantId: 3,
      tenantName: 'Seguros del Valle',
      plan: 'Básico',
      status: 'canceled',
      amount: 2900,
      currency: 'mxn',
      interval: 'month',
      startDate: '2024-03-01',
      endDate: '2024-04-01',
      cancelAt: '2024-04-01',
      paymentMethod: {
        brand: 'visa',
        last4: '1234',
        expMonth: 5,
        expYear: 2025
      },
      invoices: [
        {
          id: 'in_2468013579',
          amount: 2900,
          currency: 'mxn',
          status: 'paid',
          date: '2024-03-01',
          pdf: '#'
        }
      ]
    }
  ];
  
  const plans = [
    {
      id: 'plan_basic',
      name: 'Básico',
      price: 2900,
      currency: 'mxn',
      interval: 'month',
      features: [
        'Hasta 10 usuarios',
        '1 GB almacenamiento',
        'Soporte por email'
      ],
      active: true
    },
    {
      id: 'plan_professional',
      name: 'Profesional',
      price: 4900,
      currency: 'mxn',
      interval: 'month',
      features: [
        'Hasta 50 usuarios',
        '10 GB almacenamiento',
        'Soporte prioritario',
        'Personalización de marca'
      ],
      active: true
    },
    {
      id: 'plan_enterprise',
      name: 'Empresarial',
      price: 9900,
      currency: 'mxn',
      interval: 'month',
      features: [
        'Usuarios ilimitados',
        '100 GB almacenamiento',
        'Soporte 24/7',
        'API integración avanzada',
        'Personalización completa'
      ],
      active: true
    }
  ];

  const handleCancelSubscription = (subscription) => {
    setCurrentSubscription(subscription);
    setShowCancelModal(true);
  };

  const confirmCancelSubscription = () => {
    // Aquí iría la lógica para cancelar la suscripción en Stripe
    alert(`Suscripción ${currentSubscription.id} cancelada exitosamente`);
    setShowCancelModal(false);
    setCurrentSubscription(null);
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0
    }).format(amount / 100);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Activa</span>;
      case 'past_due':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pago Pendiente</span>;
      case 'canceled':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Cancelada</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getCardIcon = (brand) => {
    switch (brand) {
      case 'visa':
        return '💳 Visa';
      case 'mastercard':
        return '💳 Mastercard';
      case 'amex':
        return '💳 American Express';
      default:
        return '💳 Tarjeta';
    }
  };

  return (
    <Layout title="Gestión de Suscripciones">
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
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Suscripciones</h2>
              <p className="text-gray-600">Administra los planes y pagos de Stripe</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/superadmin/tenants/new')}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <SafeIcon icon={FiPlusCircle} className="w-5 h-5" />
            <span>Nueva Suscripción</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscriptions'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCreditCard} className="w-4 h-4" />
                <span>Suscripciones</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'plans'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiDollarSign} className="w-4 h-4" />
                <span>Planes</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Suscripciones ({subscriptions.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método de Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periodo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-600">
                              {subscription.tenantName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {subscription.tenantName}
                            </div>
                            <div className="text-xs text-gray-500">ID: {subscription.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{subscription.plan}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(subscription.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(subscription.amount, subscription.currency)}
                          <span className="text-xs text-gray-500">/{subscription.interval}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getCardIcon(subscription.paymentMethod.brand)}
                          <span className="text-xs text-gray-500 ml-1">
                            **** {subscription.paymentMethod.last4}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Exp: {subscription.paymentMethod.expMonth}/{subscription.paymentMethod.expYear}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subscription.startDate} - {subscription.endDate}
                        </div>
                        {subscription.cancelAt && (
                          <div className="text-xs text-red-500">
                            Cancelado: {subscription.cancelAt}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Ver detalles"
                          >
                            <SafeIcon icon={FiCreditCard} className="w-5 h-5" />
                          </button>
                          {subscription.status === 'active' && (
                            <button
                              onClick={() => handleCancelSubscription(subscription)}
                              className="text-red-600 hover:text-red-900"
                              title="Cancelar suscripción"
                            >
                              <SafeIcon icon={FiArchive} className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Planes Disponibles ({plans.length})
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-lg overflow-hidden ${
                        plan.active
                          ? 'border-gray-200'
                          : 'border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                          {plan.active ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Activo
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              Inactivo
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="px-6 py-4">
                        <div className="mb-4">
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(plan.price, plan.currency)}
                            <span className="text-sm font-normal text-gray-500">
                              /{plan.interval}
                            </span>
                          </p>
                        </div>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <SafeIcon
                                icon={FiCheckCircle}
                                className="w-4 h-4 text-green-500 mr-2"
                              />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
                          Editar Plan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && currentSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-medium text-gray-900">Cancelar Suscripción</h3>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                ¿Estás seguro de que deseas cancelar la suscripción de{' '}
                <span className="font-medium">{currentSubscription.tenantName}</span>?
              </p>
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    Esta acción cancelará la renovación automática. El tenant tendrá acceso hasta el
                    final del periodo actual ({currentSubscription.endDate}).
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Suscripción:</span> {currentSubscription.id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Plan:</span> {currentSubscription.plan}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Monto:</span>{' '}
                  {formatCurrency(currentSubscription.amount, currentSubscription.currency)}/
                  {currentSubscription.interval}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                No, Mantener
              </button>
              <button
                onClick={confirmCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sí, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default StripeSubscriptions;