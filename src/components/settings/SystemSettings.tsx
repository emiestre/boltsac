import React, { useState } from 'react';
import { SystemSettings } from '../../types';
import { 
  Settings, 
  Bell, 
  Shield, 
  DollarSign, 
  Users, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Globe,
  Database,
  Save,
  X,
  Eye,
  EyeOff,
  TestTube,
  Check,
  AlertTriangle
} from 'lucide-react';

interface SystemSettingsProps {
  settings: SystemSettings;
  onSave: (settings: SystemSettings) => void;
  onClose: () => void;
}

export function SystemSettingsComponent({ settings, onSave, onClose }: SystemSettingsProps) {
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [activeTab, setActiveTab] = useState('general');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'approval', label: 'Approval', icon: Users },
    { id: 'integrations', label: 'Integrations', icon: Globe },
  ];

  const handleInputChange = (section: keyof SystemSettings, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section: keyof SystemSettings, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const testEmailConnection = async () => {
    try {
      // Mock email test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResults(prev => ({
        ...prev,
        email: { success: true, message: 'Email connection successful!' }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        email: { success: false, message: 'Failed to connect to email server' }
      }));
    }
  };

  const testWhatsAppConnection = async () => {
    try {
      // Mock WhatsApp test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResults(prev => ({
        ...prev,
        whatsapp: { success: true, message: 'WhatsApp API connection successful!' }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        whatsapp: { success: false, message: 'Failed to connect to WhatsApp API' }
      }));
    }
  };

  const handleSave = () => {
    const updatedSettings = {
      ...formData,
      lastModified: new Date().toISOString(),
      modifiedBy: 'Current User'
    };
    onSave(updatedSettings);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SACCO Name *
          </label>
          <input
            type="text"
            value={formData.general.saccoName}
            onChange={(e) => handleInputChange('general', 'saccoName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter SACCO name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SACCO Code *
          </label>
          <input
            type="text"
            value={formData.general.saccoCode}
            onChange={(e) => handleInputChange('general', 'saccoCode', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter SACCO code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Number
          </label>
          <input
            type="text"
            value={formData.general.registrationNumber}
            onChange={(e) => handleInputChange('general', 'registrationNumber', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter registration number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.general.phone}
            onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+256-700-123456"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.general.email}
            onChange={(e) => handleInputChange('general', 'email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="info@sacco.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.general.website || ''}
            onChange={(e) => handleInputChange('general', 'website', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.sacco.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={formData.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Africa/Kampala">Africa/Kampala (EAT)</option>
            <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
            <option value="Africa/Dar_es_Salaam">Africa/Dar_es_Salaam (EAT)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={formData.general.currency}
            onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="UGX">Ugandan Shilling (UGX)</option>
            <option value="KES">Kenyan Shilling (KES)</option>
            <option value="TZS">Tanzanian Shilling (TZS)</option>
            <option value="USD">US Dollar (USD)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <textarea
          value={formData.general.address}
          onChange={(e) => handleInputChange('general', 'address', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter complete address"
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
      
      {/* Email Settings */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.notifications.email.enabled}
              onChange={(e) => handleNestedInputChange('notifications', 'email', 'enabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enable Email</span>
          </div>
        </div>

        {formData.notifications.email.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Host *
                </label>
                <input
                  type="text"
                  value={formData.notifications.email.smtpHost}
                  onChange={(e) => handleNestedInputChange('notifications', 'email', 'smtpHost', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Port *
                </label>
                <input
                  type="number"
                  value={formData.notifications.email.smtpPort}
                  onChange={(e) => handleNestedInputChange('notifications', 'email', 'smtpPort', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="587"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.notifications.email.smtpUsername}
                  onChange={(e) => handleNestedInputChange('notifications', 'email', 'smtpUsername', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your-email@gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.emailPassword ? 'text' : 'password'}
                    value={formData.notifications.email.smtpPassword}
                    onChange={(e) => handleNestedInputChange('notifications', 'email', 'smtpPassword', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="App password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('emailPassword')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.emailPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Email *
                </label>
                <input
                  type="email"
                  value={formData.notifications.email.fromEmail}
                  onChange={(e) => handleNestedInputChange('notifications', 'email', 'fromEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="noreply@sacco.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Name *
                </label>
                <input
                  type="text"
                  value={formData.notifications.email.fromName}
                  onChange={(e) => handleNestedInputChange('notifications', 'email', 'fromName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="SACCO Manager"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={testEmailConnection}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <TestTube className="w-4 h-4" />
                <span>Test Connection</span>
              </button>
              
              {testResults.email && (
                <div className={`flex items-center space-x-2 ${testResults.email.success ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.email.success ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span className="text-sm">{testResults.email.message}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Settings */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-gray-900">WhatsApp Notifications</h4>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.notifications.whatsapp.enabled}
              onChange={(e) => handleNestedInputChange('notifications', 'whatsapp', 'enabled', e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Enable WhatsApp</span>
          </div>
        </div>

        {formData.notifications.whatsapp.enabled && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Note:</strong> WhatsApp Business API requires approval from Meta. 
                Make sure you have a verified business account and approved message templates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.whatsappApiKey ? 'text' : 'password'}
                    value={formData.notifications.whatsapp.apiKey}
                    onChange={(e) => handleNestedInputChange('notifications', 'whatsapp', 'apiKey', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your WhatsApp API key"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('whatsappApiKey')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.whatsappApiKey ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number ID *
                </label>
                <input
                  type="text"
                  value={formData.notifications.whatsapp.phoneNumberId}
                  onChange={(e) => handleNestedInputChange('notifications', 'whatsapp', 'phoneNumberId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Phone number ID from Meta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Token *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.whatsappToken ? 'text' : 'password'}
                    value={formData.notifications.whatsapp.accessToken}
                    onChange={(e) => handleNestedInputChange('notifications', 'whatsapp', 'accessToken', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Access token from Meta"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('whatsappToken')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.whatsappToken ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Account ID *
                </label>
                <input
                  type="text"
                  value={formData.notifications.whatsapp.businessAccountId}
                  onChange={(e) => handleNestedInputChange('notifications', 'whatsapp', 'businessAccountId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Business account ID"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={testWhatsAppConnection}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <TestTube className="w-4 h-4" />
                <span>Test Connection</span>
              </button>
              
              {testResults.whatsapp && (
                <div className={`flex items-center space-x-2 ${testResults.whatsapp.success ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.whatsapp.success ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span className="text-sm">{testResults.whatsapp.message}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Triggers */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Notification Triggers</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(formData.notifications.email.triggers).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => {
                  handleNestedInputChange('notifications', 'email', 'triggers', {
                    ...formData.notifications.email.triggers,
                    [key]: e.target.checked
                  });
                  handleNestedInputChange('notifications', 'whatsapp', 'triggers', {
                    ...formData.notifications.whatsapp.triggers,
                    [key]: e.target.checked
                  });
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
      
      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Password Policy</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Length
            </label>
            <input
              type="number"
              value={formData.security.passwordPolicy.minLength}
              onChange={(e) => handleNestedInputChange('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="6"
              max="20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Expiry (days)
            </label>
            <input
              type="number"
              value={formData.security.passwordPolicy.passwordExpiry}
              onChange={(e) => handleNestedInputChange('security', 'passwordPolicy', 'passwordExpiry', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="30"
              max="365"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {[
            { key: 'requireUppercase', label: 'Require Uppercase Letters' },
            { key: 'requireLowercase', label: 'Require Lowercase Letters' },
            { key: 'requireNumbers', label: 'Require Numbers' },
            { key: 'requireSpecialChars', label: 'Require Special Characters' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.security.passwordPolicy[key as keyof typeof formData.security.passwordPolicy] as boolean}
                onChange={(e) => handleNestedInputChange('security', 'passwordPolicy', key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Session & Access Control</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={formData.security.sessionTimeout}
              onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="15"
              max="480"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Login Attempts
            </label>
            <input
              type="number"
              value={formData.security.maxLoginAttempts}
              onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="3"
              max="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lockout Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.security.lockoutDuration}
              onChange={(e) => handleInputChange('security', 'lockoutDuration', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="5"
              max="60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Retention (days)
            </label>
            <input
              type="number"
              value={formData.security.dataRetentionDays}
              onChange={(e) => handleInputChange('security', 'dataRetentionDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="365"
              max="2555"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {[
            { key: 'twoFactorAuth', label: 'Enable Two-Factor Authentication' },
            { key: 'auditLogging', label: 'Enable Audit Logging' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.security[key as keyof typeof formData.security] as boolean}
                onChange={(e) => handleInputChange('security', key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFinancialSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Financial Settings</h3>
      
      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Interest Rates (%)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Savings Rate
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.financial.interestRates.savingsRate}
              onChange={(e) => handleNestedInputChange('financial', 'interestRates', 'savingsRate', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {Object.entries(formData.financial.interestRates.loanRates).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key} Loan Rate
              </label>
              <input
                type="number"
                step="0.1"
                value={value}
                onChange={(e) => handleNestedInputChange('financial', 'interestRates', 'loanRates', {
                  ...formData.financial.interestRates.loanRates,
                  [key]: parseFloat(e.target.value)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Penalty Rate
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.financial.interestRates.penaltyRate}
              onChange={(e) => handleNestedInputChange('financial', 'interestRates', 'penaltyRate', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Fees (UGX)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(formData.financial.fees).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleNestedInputChange('financial', 'fees', key, parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Limits (UGX)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData.financial.limits).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleNestedInputChange('financial', 'limits', key, parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                <p className="text-gray-600">Configure system-wide settings and preferences</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'financial' && renderFinancialSettings()}
          {activeTab === 'approval' && (
            <div className="text-center py-12">
              <p className="text-gray-500">Approval settings coming soon...</p>
            </div>
          )}
          {activeTab === 'integrations' && (
            <div className="text-center py-12">
              <p className="text-gray-500">Integration settings coming soon...</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}