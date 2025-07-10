import { useState, useEffect } from 'react';
import { SystemSettings } from '../types';

const defaultSettings: SystemSettings = {
  id: '1',
  general: {
    saccoName: 'SACCO Manager',
    saccoCode: 'SACCO001',
    registrationNumber: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    timezone: 'Africa/Kampala',
    currency: 'UGX',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    fiscalYearStart: '01/01'
  },
  notifications: {
    email: {
      enabled: false,
      smtpHost: '',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: '',
      encryption: 'tls',
      templates: {} as any,
      triggers: {
        memberRegistration: true,
        memberApproval: true,
        loanApplication: true,
        loanApproval: true,
        loanRejection: true,
        loanDisbursement: true,
        paymentReminder: true,
        paymentReceived: true,
        savingsDeposit: true,
        withdrawalRequest: true,
        withdrawalApproval: true,
        accountSuspension: true,
        passwordReset: true,
        systemMaintenance: false,
        reportGeneration: false,
        meetingNotification: true,
        dividendDeclaration: true
      }
    },
    whatsapp: {
      enabled: false,
      apiKey: '',
      phoneNumberId: '',
      accessToken: '',
      webhookUrl: '',
      businessAccountId: '',
      templates: {} as any,
      triggers: {
        memberRegistration: true,
        memberApproval: true,
        loanApplication: true,
        loanApproval: true,
        loanRejection: true,
        loanDisbursement: true,
        paymentReminder: true,
        paymentReceived: true,
        savingsDeposit: true,
        withdrawalRequest: true,
        withdrawalApproval: true,
        accountSuspension: true,
        passwordReset: true,
        systemMaintenance: false,
        reportGeneration: false,
        meetingNotification: true,
        dividendDeclaration: true
      }
    },
    sms: {
      enabled: false,
      provider: 'twilio',
      apiKey: '',
      apiSecret: '',
      senderId: '',
      triggers: {
        memberRegistration: false,
        memberApproval: false,
        loanApplication: false,
        loanApproval: true,
        loanRejection: true,
        loanDisbursement: true,
        paymentReminder: true,
        paymentReceived: false,
        savingsDeposit: false,
        withdrawalRequest: false,
        withdrawalApproval: true,
        accountSuspension: true,
        passwordReset: true,
        systemMaintenance: false,
        reportGeneration: false,
        meetingNotification: false,
        dividendDeclaration: false
      }
    },
    inApp: {
      enabled: true,
      retentionDays: 30,
      triggers: {
        memberRegistration: true,
        memberApproval: true,
        loanApplication: true,
        loanApproval: true,
        loanRejection: true,
        loanDisbursement: true,
        paymentReminder: true,
        paymentReceived: true,
        savingsDeposit: true,
        withdrawalRequest: true,
        withdrawalApproval: true,
        accountSuspension: true,
        passwordReset: true,
        systemMaintenance: true,
        reportGeneration: true,
        meetingNotification: true,
        dividendDeclaration: true
      }
    }
  },
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      passwordExpiry: 90,
      preventReuse: 5
    },
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorAuth: false,
    ipWhitelist: [],
    auditLogging: true,
    dataRetentionDays: 2555
  },
  financial: {
    interestRates: {
      savingsRate: 5.0,
      loanRates: {
        personal: 12.0,
        business: 10.0,
        emergency: 15.0,
        education: 8.0,
        agriculture: 9.0
      },
      penaltyRate: 2.0
    },
    fees: {
      membershipFee: 50000,
      processingFee: 25000,
      withdrawalFee: 5000,
      statementFee: 2000,
      latePaymentFee: 10000
    },
    limits: {
      minSavingsBalance: 100000,
      maxLoanAmount: 50000000,
      maxLoanToSavingsRatio: 3,
      dailyWithdrawalLimit: 1000000,
      monthlyWithdrawalLimit: 5000000
    },
    calculations: {
      compoundingFrequency: 'monthly',
      gracePeriodDays: 7,
      latePaymentGraceDays: 3,
      credibilityScoreWeights: {
        paymentHistory: 30,
        savingsConsistency: 25,
        loanRepaymentRate: 20,
        externalIncomeStability: 15,
        membershipDuration: 10
      }
    }
  },
  approval: {
    autoApprovalLimits: {
      loans: 1000000,
      withdrawals: 500000
    },
    escalationRules: [],
    reminderSettings: {
      enabled: true,
      firstReminderHours: 24,
      secondReminderHours: 72,
      finalReminderHours: 168
    }
  },
  integrations: {
    mobileMoneyProviders: [],
    bankingIntegrations: [],
    accountingSoftware: {
      enabled: false,
      software: 'quickbooks',
      apiKey: '',
      syncFrequency: 'daily'
    },
    backupSettings: {
      enabled: true,
      frequency: 'daily',
      retentionDays: 30,
      cloudProvider: 'local',
      encryptionEnabled: true
    }
  },
  lastModified: new Date().toISOString(),
  modifiedBy: 'System'
};

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('sacco_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
        setSettings(defaultSettings);
      }
    }
    setLoading(false);
  }, []);

  const updateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    localStorage.setItem('sacco_settings', JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('sacco_settings');
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    loading
  };
}