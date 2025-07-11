import React from 'react';
import { User } from '../types';
import { useSettings } from '../hooks/useSettings';
import { Bell, LogOut, Settings, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
}

export function Layout({ user, children, onLogout }: LayoutProps) {
  const { settings } = useSettings();

  const getUserTitle = (user: User) => {
    const roleTitles: Record<string, string> = {
      admin: 'System Administrator',
      member: 'SACCO Member',
      auditor: 'Internal Auditor',
      approval_officer: 'Approval Officer',
      chairperson: 'Chairperson',
      vice_chairperson: 'Vice Chairperson',
      treasurer: 'Treasurer'
    };
    return roleTitles[user.role] || 'User';
  };

  const getSystemLogo = () => {
    if (settings.general.logo) {
      return (
        <img
          src={settings.general.logo}
          alt={settings.general.saccoName}
          className="w-8 h-8 rounded-lg object-cover"
        />
      );
    }
    
    // Default logo with SACCO initials
    const initials = settings.general.saccoName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'SM';
    
    return (
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">{initials}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {getSystemLogo()}
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    {settings.general.saccoName || 'SACCO Manager'}
                  </span>
                  {settings.general.saccoCode && (
                    <div className="text-xs text-gray-500">
                      {settings.general.saccoCode}
                    </div>
                  )}
                </div>
              </div>
              <div className="hidden md:block">
                <span className="text-sm text-gray-500">
                  {getUserTitle(user)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{getUserTitle(user)}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              © 2024 {settings.general.saccoName || 'SACCO Manager'}. All rights reserved.
            </div>
            <div className="text-sm text-gray-500">
              {settings.general.registrationNumber && (
                <span>Reg: {settings.general.registrationNumber}</span>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}