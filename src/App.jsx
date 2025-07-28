import React from 'react';
import {HashRouter as Router,Routes,Route} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateClaim from './pages/CreateClaim';
import ClaimDetails from './pages/ClaimDetails';
import UserManagement from './pages/UserManagement';
import AgentUserManagement from './pages/AgentUserManagement';
import AgentManagement from './pages/AgentManagement';
import ClientGroupManagement from './pages/ClientGroupManagement';
// SuperAdmin Pages
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import TenantManagement from './pages/TenantManagement';
import CreateEditTenant from './pages/CreateEditTenant';
import StripeSubscriptions from './pages/StripeSubscriptions';
import WhiteLabelManagement from './pages/WhiteLabelManagement';
import IntegrationsManagement from './pages/IntegrationsManagement';
// Quest Help System
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import questConfig from './config/questConfig';
import AppHelp from './components/HelpHub';

function App() {
  return (
    <AuthProvider>
      <QuestProvider
        apiKey={questConfig.APIKEY}
        entityId={questConfig.ENTITYID}
        apiType="PRODUCTION"
      >
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              {/* Client Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute adminOrStaff><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/usuarios" element={<ProtectedRoute adminOnly><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/usuarios-agente" element={<ProtectedRoute adminOrStaff><AgentUserManagement /></ProtectedRoute>} />
              <Route path="/admin/agentes" element={<ProtectedRoute adminOnly><AgentManagement /></ProtectedRoute>} />
              <Route path="/admin/grupos" element={<ProtectedRoute adminOnly><ClientGroupManagement /></ProtectedRoute>} />
              {/* SuperAdmin Routes */}
              <Route path="/superadmin" element={<ProtectedRoute superAdminOnly><SuperAdminDashboard /></ProtectedRoute>} />
              <Route path="/superadmin/tenants" element={<ProtectedRoute superAdminOnly><TenantManagement /></ProtectedRoute>} />
              <Route path="/superadmin/tenants/new" element={<ProtectedRoute superAdminOnly><CreateEditTenant /></ProtectedRoute>} />
              <Route path="/superadmin/tenants/:id" element={<ProtectedRoute superAdminOnly><CreateEditTenant /></ProtectedRoute>} />
              <Route path="/superadmin/subscriptions" element={<ProtectedRoute superAdminOnly><StripeSubscriptions /></ProtectedRoute>} />
              <Route path="/superadmin/whitelabel" element={<ProtectedRoute superAdminOnly><WhiteLabelManagement /></ProtectedRoute>} />
              <Route path="/superadmin/integrations" element={<ProtectedRoute superAdminOnly><IntegrationsManagement /></ProtectedRoute>} />
              {/* Shared Routes */}
              <Route path="/crear-reclamo" element={<ProtectedRoute><CreateClaim /></ProtectedRoute>} />
              <Route path="/reclamo/:id" element={<ProtectedRoute><ClaimDetails /></ProtectedRoute>} />
              <Route path="/" element={<Login />} />
            </Routes>
            <AppHelp />
          </div>
        </Router>
      </QuestProvider>
    </AuthProvider>
  );
}

export default App;