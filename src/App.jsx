import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateClaim from './pages/CreateClaim';
import ClaimDetails from './pages/ClaimDetails';
import UserManagement from './pages/UserManagement';
import AgentManagement from './pages/AgentManagement';
import ClientGroupManagement from './pages/ClientGroupManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOrStaff>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute adminOnly>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/agentes"
              element={
                <ProtectedRoute adminOnly>
                  <AgentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/grupos"
              element={
                <ProtectedRoute adminOnly>
                  <ClientGroupManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crear-reclamo"
              element={
                <ProtectedRoute>
                  <CreateClaim />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reclamo/:id"
              element={
                <ProtectedRoute>
                  <ClaimDetails />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;