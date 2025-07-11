export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'auditor' | 'approval_officer' | 'chairperson' | 'vice_chairperson' | 'treasurer';
  avatar?: string;
  createdAt: string;
}

export interface Member {
  id: string;
  memberNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  savingsBalance: number;
  totalLoans: number;
  avatar?: string;
  organizationRole?: string;
  credibilityScore: number;
  externalIncomes: ExternalIncome[];
  // Additional profile fields
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  nationalId?: string;
  occupation?: string;
  employer?: string;
  monthlyIncome?: number;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  monthlySavingsFlow: MonthlySavingsFlow[];
}

export interface MonthlySavingsFlow {
  month: string;
  deposits: number;
  withdrawals: number;
  netSavings: number;
  balance: number;
}

export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  interestRate: number;
  term: number;
  purpose: string;
  status: 'pending' | 'approved' | 'disbursed' | 'rejected' | 'completed';
  appliedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  monthlyPayment: number;
  remainingBalance: number;
  nextPaymentDate?: string;
}

export interface Savings {
  id: string;
  memberId: string;
  memberName: string;
  type: 'monthly_contribution' | 'voluntary_deposit' | 'withdrawal';
  amount: number;
  date: string;
  description: string;
  status: 'pending' | 'approved' | 'completed';
}

export interface ExternalIncome {
  id: string;
  memberId: string;
  source: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  category: 'salary' | 'business' | 'investment' | 'rental' | 'pension' | 'freelance' | 'agriculture' | 'other';
  verified: boolean;
  dateAdded: string;
  lastUpdated: string;
  description?: string;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationalId: string;
  
  // Employment Details
  position: string;
  department: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'suspended' | 'terminated';
  
  // Compensation
  basicSalary: number;
  allowances: EmployeeAllowance[];
  deductions: EmployeeDeduction[];
  payrollFrequency: 'monthly' | 'bi_weekly' | 'weekly';
  
  // Contact & Emergency
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  
  // System Access
  systemRole?: 'admin' | 'member' | 'auditor' | 'approval_officer' | 'chairperson' | 'vice_chairperson' | 'treasurer';
  permissions: string[];
  lastLogin?: string;
  
  // Documents
  avatar?: string;
  documents: EmployeeDocument[];
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface EmployeeAllowance {
  id: string;
  type: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one_time';
  taxable: boolean;
  description?: string;
}

export interface EmployeeDeduction {
  id: string;
  type: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one_time';
  mandatory: boolean;
  description?: string;
}

export interface EmployeeDocument {
  id: string;
  type: string;
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  basicSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  grossPay: number;
  netPay: number;
  status: 'draft' | 'approved' | 'paid';
  generatedAt: string;
  approvedBy?: string;
  paidAt?: string;
}

export interface SaccoExpense {
  id: string;
  category: 'operational' | 'administrative' | 'marketing' | 'maintenance' | 'utilities' | 'staff' | 'other';
  description: string;
  amount: number;
  date: string;
  approvedBy: string;
  status: 'pending' | 'approved' | 'paid';
  receiptNumber?: string;
  vendor?: string;
}

export interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  externalIncome: number;
  memberContributions: number;
  loanDisbursements: number;
  loanRepayments: number;
  expenses: number;
}

export interface CredibilityMetrics {
  memberId: string;
  memberName: string;
  score: number;
  factors: {
    paymentHistory: number;
    savingsConsistency: number;
    loanRepaymentRate: number;
    externalIncomeStability: number;
    membershipDuration: number;
  };
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
}

export interface Approval {
  id: string;
  type: 'membership' | 'loan' | 'withdrawal';
  applicantId: string;
  applicantName: string;
  amount?: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectedBy?: string;
  rejectedDate?: string;
  rejectionRemark?: string;
  level: number;
  maxLevel: number;
  description: string;
  currentApprover?: string;
  approvalFlow: ApprovalFlowStep[];
  history: ApprovalHistoryEntry[];
}

export interface ApprovalFlowStep {
  level: number;
  approverRole: string;
  approverName: string;
  required: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  processedDate?: string;
  remarks?: string;
}

export interface ApprovalHistoryEntry {
  level: number;
  approverName: string;
  action: 'approved' | 'rejected' | 'forwarded';
  date: string;
  remarks?: string;
}

export interface ApprovalConfiguration {
  id: string;
  type: 'membership' | 'loan' | 'withdrawal';
  name: string;
  description: string;
  steps: ApprovalConfigStep[];
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

export interface ApprovalConfigStep {
  level: number;
  role: string;
  title: string;
  required: boolean;
  conditions?: {
    minAmount?: number;
    maxAmount?: number;
    membershipDuration?: number;
    credibilityScore?: number;
  };
}

export interface Report {
  id: string;
  title: string;
  type: 'loans' | 'savings' | 'members' | 'arrears' | 'financial' | 'cashflow' | 'credibility' | 'expenses' | 'profile';
  generatedDate: string;
  generatedBy: string;
  format: 'pdf' | 'excel' | 'csv' | 'word' | 'json';
  status: 'generating' | 'ready' | 'error';
  downloadUrl?: string;
  memberId?: string; // For member-specific reports
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionRequired?: boolean;
  actionUrl?: string;
  relatedId?: string;
  relatedType?: string;
}

export interface AnalyticsData {
  monthlySavings: { month: string; amount: number; members: number }[];
  monthlyExternalIncome: { month: string; amount: number; sources: number }[];
  monthlyExpenses: { month: string; amount: number; categories: number }[];
  savingsVsIncome: { month: string; savings: number; income: number; expenses: number }[];
}

export interface OtherIncomeEntry {
  id: string;
  memberId: string;
  memberName: string;
  source: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  category: 'salary' | 'business' | 'investment' | 'rental' | 'pension' | 'freelance' | 'agriculture' | 'remittances' | 'grants' | 'other';
  verified: boolean;
  dateAdded: string;
  lastUpdated: string;
  description?: string;
  supportingDocuments?: string[];
  verifiedBy?: string;
  verificationDate?: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface SystemSettings {
  id: string;
  general: GeneralSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  financial: FinancialSettings;
  approval: ApprovalSettings;
  integrations: IntegrationSettings;
  lastModified: string;
  modifiedBy: string;
}

export interface GeneralSettings {
  saccoName: string;
  saccoCode: string;
  registrationNumber: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  timezone: string;
  currency: string;
  language: string;
  dateFormat: string;
  fiscalYearStart: string;
}

export interface NotificationSettings {
  email: EmailNotificationSettings;
  whatsapp: WhatsAppNotificationSettings;
  sms: SMSNotificationSettings;
  inApp: InAppNotificationSettings;
}

export interface EmailNotificationSettings {
  enabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  encryption: 'none' | 'tls' | 'ssl';
  templates: EmailTemplateSettings;
  triggers: NotificationTriggers;
}

export interface WhatsAppNotificationSettings {
  enabled: boolean;
  apiKey: string;
  phoneNumberId: string;
  accessToken: string;
  webhookUrl: string;
  businessAccountId: string;
  templates: WhatsAppTemplateSettings;
  triggers: NotificationTriggers;
}

export interface SMSNotificationSettings {
  enabled: boolean;
  provider: 'twilio' | 'africas_talking' | 'custom';
  apiKey: string;
  apiSecret: string;
  senderId: string;
  triggers: NotificationTriggers;
}

export interface InAppNotificationSettings {
  enabled: boolean;
  retentionDays: number;
  triggers: NotificationTriggers;
}

export interface NotificationTriggers {
  memberRegistration: boolean;
  memberApproval: boolean;
  loanApplication: boolean;
  loanApproval: boolean;
  loanRejection: boolean;
  loanDisbursement: boolean;
  paymentReminder: boolean;
  paymentReceived: boolean;
  savingsDeposit: boolean;
  withdrawalRequest: boolean;
  withdrawalApproval: boolean;
  accountSuspension: boolean;
  passwordReset: boolean;
  systemMaintenance: boolean;
  reportGeneration: boolean;
  meetingNotification: boolean;
  dividendDeclaration: boolean;
}

export interface EmailTemplateSettings {
  memberWelcome: EmailTemplate;
  loanApproval: EmailTemplate;
  loanRejection: EmailTemplate;
  paymentReminder: EmailTemplate;
  paymentConfirmation: EmailTemplate;
  withdrawalApproval: EmailTemplate;
  accountStatement: EmailTemplate;
  passwordReset: EmailTemplate;
  meetingInvitation: EmailTemplate;
}

export interface WhatsAppTemplateSettings {
  memberWelcome: WhatsAppTemplate;
  loanApproval: WhatsAppTemplate;
  paymentReminder: WhatsAppTemplate;
  paymentConfirmation: WhatsAppTemplate;
  withdrawalApproval: WhatsAppTemplate;
  meetingReminder: WhatsAppTemplate;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  isActive: boolean;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  templateName: string;
  language: string;
  content: string;
  variables: string[];
  isActive: boolean;
}

export interface SecuritySettings {
  passwordPolicy: PasswordPolicy;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  twoFactorAuth: boolean;
  ipWhitelist: string[];
  auditLogging: boolean;
  dataRetentionDays: number;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpiry: number;
  preventReuse: number;
}

export interface FinancialSettings {
  interestRates: InterestRateSettings;
  fees: FeeSettings;
  limits: LimitSettings;
  calculations: CalculationSettings;
  loanCalculationMethod: 'flat_rate' | 'reducing_balance' | 'compound_interest';
}

export interface InterestRateSettings {
  savingsRate: number;
  loanRates: {
    personal: number;
    business: number;
    emergency: number;
    education: number;
    agriculture: number;
  };
  penaltyRate: number;
}

export interface FeeSettings {
  membershipFee: number;
  processingFee: number;
  withdrawalFee: number;
  statementFee: number;
  latePaymentFee: number;
}

export interface LimitSettings {
  minSavingsBalance: number;
  maxLoanAmount: number;
  maxLoanToSavingsRatio: number;
  dailyWithdrawalLimit: number;
  monthlyWithdrawalLimit: number;
}

export interface CalculationSettings {
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
  gracePeriodDays: number;
  latePaymentGraceDays: number;
  credibilityScoreWeights: {
    paymentHistory: number;
    savingsConsistency: number;
    loanRepaymentRate: number;
    externalIncomeStability: number;
    membershipDuration: number;
  };
}

export interface ApprovalSettings {
  autoApprovalLimits: {
    loans: number;
    withdrawals: number;
  };
  escalationRules: EscalationRule[];
  reminderSettings: ReminderSettings;
}

export interface EscalationRule {
  id: string;
  type: 'loan' | 'withdrawal' | 'membership';
  condition: string;
  escalateAfterHours: number;
  escalateTo: string;
  isActive: boolean;
}

export interface ReminderSettings {
  enabled: boolean;
  firstReminderHours: number;
  secondReminderHours: number;
  finalReminderHours: number;
}

export interface IntegrationSettings {
  mobileMoneyProviders: MobileMoneyProvider[];
  bankingIntegrations: BankingIntegration[];
  accountingSoftware: AccountingIntegration;
  backupSettings: BackupSettings;
}

export interface MobileMoneyProvider {
  id: string;
  name: string;
  provider: 'mtn' | 'airtel' | 'other';
  apiKey: string;
  apiSecret: string;
  isActive: boolean;
  fees: {
    deposit: number;
    withdrawal: number;
  };
}

export interface BankingIntegration {
  id: string;
  bankName: string;
  accountNumber: string;
  apiEndpoint: string;
  apiKey: string;
  isActive: boolean;
}

export interface AccountingIntegration {
  enabled: boolean;
  software: 'quickbooks' | 'sage' | 'custom';
  apiKey: string;
  syncFrequency: 'realtime' | 'hourly' | 'daily';
}

export interface BackupSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  cloudProvider: 'aws' | 'google' | 'azure' | 'local';
  encryptionEnabled: boolean;
}

export interface NotificationQueue {
  id: string;
  type: 'email' | 'whatsapp' | 'sms' | 'in_app';
  recipient: string;
  subject?: string;
  content: string;
  templateId?: string;
  variables?: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  scheduledAt?: string;
  sentAt?: string;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  relatedId?: string;
  relatedType?: string;
}

export interface NotificationLog {
  id: string;
  notificationId: string;
  type: 'email' | 'whatsapp' | 'sms' | 'in_app';
  recipient: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  response?: any;
  errorMessage?: string;
}