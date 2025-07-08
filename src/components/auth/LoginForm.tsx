import React, { useState } from 'react';
import { User } from '../../types';
import { LogIn, Shield, Users, Eye } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string, role: User['role']) => Promise<User>;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [selectedRole, setSelectedRole] = useState<User['role'] | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setLoading(true);
    try {
      await onLogin(email, password, selectedRole);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      key: 'admin' as const,
      title: 'Administrator',
      description: 'Full system access and management',
      icon: Shield,
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      key: 'member' as const,
      title: 'Member',
      description: 'Access to personal accounts and services',
      icon: Users,
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      key: 'auditor' as const,
      title: 'Auditor',
      description: 'Read-only access to financial records',
      icon: Eye,
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      key: 'approval_officer' as const,
      title: 'Approval Officer',
      description: 'Review and approve applications',
      icon: LogIn,
      color: 'bg-orange-50 border-orange-200 text-orange-700'
    }
  ];

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">SACCO Manager</h1>
            <p className="text-xl text-gray-600">Choose your role to access the system</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.key}
                  onClick={() => setSelectedRole(role.key)}
                  className={`${role.color} p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 text-left`}
                >
                  <div className="flex items-center mb-4">
                    <Icon className="w-8 h-8 mr-3" />
                    <h3 className="text-xl font-semibold">{role.title}</h3>
                  </div>
                  <p className="text-sm opacity-80">{role.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const selectedRoleData = roles.find(r => r.key === selectedRole)!;
  const Icon = selectedRoleData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <button
              onClick={() => setSelectedRole(null)}
              className="text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              ← Back to role selection
            </button>
            <div className={`w-16 h-16 ${selectedRoleData.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <Icon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedRoleData.title} Login</h2>
            <p className="text-gray-600">{selectedRoleData.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Demo credentials: any email/password combination
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}