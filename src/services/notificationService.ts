import { NotificationQueue, NotificationLog, SystemSettings } from '../types';

export class NotificationService {
  private settings: SystemSettings;

  constructor(settings: SystemSettings) {
    this.settings = settings;
  }

  async sendEmail(notification: NotificationQueue): Promise<NotificationLog> {
    try {
      if (!this.settings.notifications.email.enabled) {
        throw new Error('Email notifications are disabled');
      }

      // Mock email sending - replace with actual email service
      const response = await this.mockEmailSend(notification);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        notificationId: notification.id,
        type: 'email',
        recipient: notification.recipient,
        status: 'sent',
        timestamp: new Date().toISOString(),
        response: response
      };
    } catch (error) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        notificationId: notification.id,
        type: 'email',
        recipient: notification.recipient,
        status: 'failed',
        timestamp: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async sendWhatsApp(notification: NotificationQueue): Promise<NotificationLog> {
    try {
      if (!this.settings.notifications.whatsapp.enabled) {
        throw new Error('WhatsApp notifications are disabled');
      }

      // Mock WhatsApp sending - replace with actual WhatsApp Business API
      const response = await this.mockWhatsAppSend(notification);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        notificationId: notification.id,
        type: 'whatsapp',
        recipient: notification.recipient,
        status: 'sent',
        timestamp: new Date().toISOString(),
        response: response
      };
    } catch (error) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        notificationId: notification.id,
        type: 'whatsapp',
        recipient: notification.recipient,
        status: 'failed',
        timestamp: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async sendSMS(notification: NotificationQueue): Promise<NotificationLog> {
    try {
      if (!this.settings.notifications.sms.enabled) {
        throw new Error('SMS notifications are disabled');
      }

      // Mock SMS sending - replace with actual SMS service
      const response = await this.mockSMSSend(notification);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        notificationId: notification.id,
        type: 'sms',
        recipient: notification.recipient,
        status: 'sent',
        timestamp: new Date().toISOString(),
        response: response
      };
    } catch (error) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        notificationId: notification.id,
        type: 'sms',
        recipient: notification.recipient,
        status: 'failed',
        timestamp: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async sendInAppNotification(notification: NotificationQueue): Promise<NotificationLog> {
    try {
      // Mock in-app notification - replace with actual implementation
      const response = await this.mockInAppSend(notification);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        notificationId: notification.id,
        type: 'in_app',
        recipient: notification.recipient,
        status: 'sent',
        timestamp: new Date().toISOString(),
        response: response
      };
    } catch (error) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        notificationId: notification.id,
        type: 'in_app',
        recipient: notification.recipient,
        status: 'failed',
        timestamp: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Template processing
  processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, String(value));
    });
    
    return processed;
  }

  // Notification triggers
  async triggerMemberRegistration(memberData: any) {
    if (!this.settings.notifications.email.triggers.memberRegistration) return;

    const notification: Omit<NotificationQueue, 'id' | 'createdAt'> = {
      type: 'email',
      recipient: memberData.email,
      subject: 'Welcome to SACCO Manager',
      content: this.processTemplate(
        'Welcome {{memberName}}! Your membership application has been received and is under review.',
        { memberName: memberData.name }
      ),
      priority: 'normal',
      status: 'pending',
      retryCount: 0,
      maxRetries: 3
    };

    return this.queueNotification(notification);
  }

  async triggerLoanApproval(loanData: any, memberData: any) {
    if (!this.settings.notifications.email.triggers.loanApproval) return;

    const notifications: Omit<NotificationQueue, 'id' | 'createdAt'>[] = [];

    // Email notification
    if (this.settings.notifications.email.enabled) {
      notifications.push({
        type: 'email',
        recipient: memberData.email,
        subject: 'Loan Application Approved',
        content: this.processTemplate(
          'Congratulations {{memberName}}! Your loan application for {{amount}} has been approved.',
          { memberName: memberData.name, amount: this.formatCurrency(loanData.amount) }
        ),
        priority: 'high',
        status: 'pending',
        retryCount: 0,
        maxRetries: 3
      });
    }

    // WhatsApp notification
    if (this.settings.notifications.whatsapp.enabled && memberData.phone) {
      notifications.push({
        type: 'whatsapp',
        recipient: memberData.phone,
        content: this.processTemplate(
          'Hi {{memberName}}, your loan for {{amount}} has been approved! Visit our office to complete the disbursement process.',
          { memberName: memberData.name, amount: this.formatCurrency(loanData.amount) }
        ),
        priority: 'high',
        status: 'pending',
        retryCount: 0,
        maxRetries: 3
      });
    }

    return Promise.all(notifications.map(n => this.queueNotification(n)));
  }

  async triggerPaymentReminder(loanData: any, memberData: any) {
    if (!this.settings.notifications.email.triggers.paymentReminder) return;

    const notifications: Omit<NotificationQueue, 'id' | 'createdAt'>[] = [];

    // Email reminder
    if (this.settings.notifications.email.enabled) {
      notifications.push({
        type: 'email',
        recipient: memberData.email,
        subject: 'Payment Reminder - SACCO Loan',
        content: this.processTemplate(
          'Dear {{memberName}}, this is a reminder that your loan payment of {{amount}} is due on {{dueDate}}.',
          { 
            memberName: memberData.name, 
            amount: this.formatCurrency(loanData.monthlyPayment),
            dueDate: new Date(loanData.nextPaymentDate).toLocaleDateString()
          }
        ),
        priority: 'normal',
        status: 'pending',
        retryCount: 0,
        maxRetries: 3
      });
    }

    // WhatsApp reminder
    if (this.settings.notifications.whatsapp.enabled && memberData.phone) {
      notifications.push({
        type: 'whatsapp',
        recipient: memberData.phone,
        content: this.processTemplate(
          'Payment reminder: {{amount}} due on {{dueDate}}. Pay via mobile money or visit our office.',
          { 
            amount: this.formatCurrency(loanData.monthlyPayment),
            dueDate: new Date(loanData.nextPaymentDate).toLocaleDateString()
          }
        ),
        priority: 'normal',
        status: 'pending',
        retryCount: 0,
        maxRetries: 3
      });
    }

    return Promise.all(notifications.map(n => this.queueNotification(n)));
  }

  private async queueNotification(notification: Omit<NotificationQueue, 'id' | 'createdAt'>): Promise<NotificationQueue> {
    const queuedNotification: NotificationQueue = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    // In a real implementation, this would be saved to a database
    console.log('Notification queued:', queuedNotification);
    
    return queuedNotification;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Mock implementations - replace with actual service integrations
  private async mockEmailSend(notification: NotificationQueue): Promise<any> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful response
    return {
      messageId: Math.random().toString(36).substr(2, 9),
      status: 'sent',
      provider: 'smtp'
    };
  }

  private async mockWhatsAppSend(notification: NotificationQueue): Promise<any> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful response
    return {
      messageId: Math.random().toString(36).substr(2, 9),
      status: 'sent',
      provider: 'whatsapp_business_api'
    };
  }

  private async mockSMSSend(notification: NotificationQueue): Promise<any> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock successful response
    return {
      messageId: Math.random().toString(36).substr(2, 9),
      status: 'sent',
      provider: 'sms_gateway'
    };
  }

  private async mockInAppSend(notification: NotificationQueue): Promise<any> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock successful response
    return {
      messageId: Math.random().toString(36).substr(2, 9),
      status: 'sent',
      provider: 'in_app'
    };
  }
}

// Email templates
export const emailTemplates = {
  memberWelcome: {
    subject: 'Welcome to {{saccoName}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to {{saccoName}}!</h2>
        <p>Dear {{memberName}},</p>
        <p>Thank you for joining our SACCO. Your membership application has been received and is currently under review.</p>
        <p>Your member number is: <strong>{{memberNumber}}</strong></p>
        <p>We will notify you once your application has been approved.</p>
        <p>Best regards,<br>{{saccoName}} Team</p>
      </div>
    `,
    variables: ['saccoName', 'memberName', 'memberNumber']
  },
  
  loanApproval: {
    subject: 'Loan Application Approved - {{saccoName}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Loan Approved!</h2>
        <p>Dear {{memberName}},</p>
        <p>Congratulations! Your loan application has been approved.</p>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Loan Details:</h3>
          <ul>
            <li>Amount: {{loanAmount}}</li>
            <li>Interest Rate: {{interestRate}}%</li>
            <li>Term: {{loanTerm}} months</li>
            <li>Monthly Payment: {{monthlyPayment}}</li>
          </ul>
        </div>
        <p>Please visit our office to complete the disbursement process.</p>
        <p>Best regards,<br>{{saccoName}} Team</p>
      </div>
    `,
    variables: ['memberName', 'loanAmount', 'interestRate', 'loanTerm', 'monthlyPayment', 'saccoName']
  },

  paymentReminder: {
    subject: 'Payment Reminder - {{saccoName}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">Payment Reminder</h2>
        <p>Dear {{memberName}},</p>
        <p>This is a friendly reminder that your loan payment is due soon.</p>
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Payment Details:</h3>
          <ul>
            <li>Amount Due: {{paymentAmount}}</li>
            <li>Due Date: {{dueDate}}</li>
            <li>Loan Balance: {{remainingBalance}}</li>
          </ul>
        </div>
        <p>You can make payments via mobile money or visit our office.</p>
        <p>Best regards,<br>{{saccoName}} Team</p>
      </div>
    `,
    variables: ['memberName', 'paymentAmount', 'dueDate', 'remainingBalance', 'saccoName']
  }
};

// WhatsApp templates
export const whatsappTemplates = {
  memberWelcome: {
    content: 'Welcome to {{saccoName}}! Your membership application ({{memberNumber}}) is under review. We will notify you once approved.',
    variables: ['saccoName', 'memberNumber']
  },
  
  loanApproval: {
    content: 'Great news {{memberName}}! Your loan for {{loanAmount}} has been approved. Visit our office to complete disbursement.',
    variables: ['memberName', 'loanAmount']
  },

  paymentReminder: {
    content: 'Payment reminder: {{paymentAmount}} due on {{dueDate}}. Pay via mobile money or visit our office. Thank you!',
    variables: ['paymentAmount', 'dueDate']
  }
};