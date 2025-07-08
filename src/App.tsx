import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/auth/LoginForm';
import { Layout } from './components/Layout';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { MemberDashboard } from './components/dashboard/MemberDashboard';
import { AuditorDashboard } from './components/dashboard/AuditorDashboard';

function App() {
  const { user, login, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <p className="text-gray-600">Loading SACCO Manager...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'member':
        return <MemberDashboard />;
      case 'auditor':
        return <AuditorDashboard />;
      case 'approval_officer':
        return <AdminDashboard />; // For now, approval officers use admin dashboard
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Layout user={user} onLogout={logout}>
      {renderDashboard()}
    </Layout>
  );
}

export default App;