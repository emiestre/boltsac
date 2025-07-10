import { useState, useEffect } from 'react';
import { NotificationQueue, NotificationLog, SystemSettings } from '../types';
import { NotificationService } from '../services/notificationService';

export function useNotifications(settings: SystemSettings) {
  const [notifications, setNotifications] = useState<NotificationQueue[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [notificationService] = useState(() => new NotificationService(settings));

  useEffect(() => {
    // Load mock data
    const mockNotifications: NotificationQueue[] = [
      {
        id: '1',
        type: 'email',
        recipient: 'john@example.com',
        subject: 'Loan Application Approved',
        content: 'Your loan application has been approved.',
        priority: 'high',
        status: 'sent',
        retryCount: 0,
        maxRetries: 3,
        createdAt: '2024-02-28T10:00:00Z',
        sentAt: '2024-02-28T10:01:00Z'
      },
      {
        id: '2',
        type: 'whatsapp',
        recipient: '+256700123456',
        content: 'Payment reminder: UGX 235,000 due tomorrow.',
        priority: 'normal',
        status: 'pending',
        retryCount: 0,
        maxRetries: 3,
        createdAt: '2024-02-28T11:00:00Z'
      },
      {
        id: '3',
        type: 'email',
        recipient: 'jane@example.com',
        subject: 'Welcome to SACCO',
        content: 'Welcome to our SACCO management system.',
        priority: 'normal',
        status: 'failed',
        failureReason: 'Invalid email address',
        retryCount: 2,
        maxRetries: 3,
        createdAt: '2024-02-28T09:00:00Z'
      }
    ];

    const mockLogs: NotificationLog[] = [
      {
        id: '1',
        notificationId: '1',
        type: 'email',
        recipient: 'john@example.com',
        status: 'delivered',
        timestamp: '2024-02-28T10:02:00Z',
        response: { messageId: 'msg_123', provider: 'smtp' }
      },
      {
        id: '2',
        notificationId: '3',
        type: 'email',
        recipient: 'jane@example.com',
        status: 'failed',
        timestamp: '2024-02-28T09:01:00Z',
        errorMessage: 'Invalid email address'
      }
    ];

    setNotifications(mockNotifications);
    setLogs(mockLogs);
  }, []);

  const sendNotification = async (notification: Omit<NotificationQueue, 'id' | 'createdAt'>) => {
    const newNotification: NotificationQueue = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [...prev, newNotification]);

    // Process notification based on type
    try {
      let log: NotificationLog;
      
      switch (notification.type) {
        case 'email':
          log = await notificationService.sendEmail(newNotification);
          break;
        case 'whatsapp':
          log = await notificationService.sendWhatsApp(newNotification);
          break;
        case 'sms':
          log = await notificationService.sendSMS(newNotification);
          break;
        case 'in_app':
          log = await notificationService.sendInAppNotification(newNotification);
          break;
        default:
          throw new Error('Unsupported notification type');
      }

      // Update notification status
      setNotifications(prev => prev.map(n => 
        n.id === newNotification.id 
          ? { ...n, status: log.status === 'sent' ? 'sent' : 'failed', sentAt: log.timestamp }
          : n
      ));

      // Add to logs
      setLogs(prev => [...prev, log]);

    } catch (error) {
      // Update notification as failed
      setNotifications(prev => prev.map(n => 
        n.id === newNotification.id 
          ? { 
              ...n, 
              status: 'failed', 
              failureReason: error instanceof Error ? error.message : 'Unknown error'
            }
          : n
      ));
    }
  };

  const retryNotification = async (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification || notification.retryCount >= notification.maxRetries) {
      return;
    }

    // Update retry count
    setNotifications(prev => prev.map(n => 
      n.id === id 
        ? { ...n, retryCount: n.retryCount + 1, status: 'pending' }
        : n
    ));

    // Retry sending
    try {
      let log: NotificationLog;
      
      switch (notification.type) {
        case 'email':
          log = await notificationService.sendEmail(notification);
          break;
        case 'whatsapp':
          log = await notificationService.sendWhatsApp(notification);
          break;
        case 'sms':
          log = await notificationService.sendSMS(notification);
          break;
        case 'in_app':
          log = await notificationService.sendInAppNotification(notification);
          break;
        default:
          throw new Error('Unsupported notification type');
      }

      // Update notification status
      setNotifications(prev => prev.map(n => 
        n.id === id 
          ? { ...n, status: log.status === 'sent' ? 'sent' : 'failed', sentAt: log.timestamp }
          : n
      ));

      // Add to logs
      setLogs(prev => [...prev, log]);

    } catch (error) {
      // Update notification as failed
      setNotifications(prev => prev.map(n => 
        n.id === id 
          ? { 
              ...n, 
              status: 'failed', 
              failureReason: error instanceof Error ? error.message : 'Unknown error'
            }
          : n
      ));
    }
  };

  const cancelNotification = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, status: 'cancelled' } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Trigger functions for common events
  const triggerMemberRegistration = (memberData: any) => {
    return notificationService.triggerMemberRegistration(memberData);
  };

  const triggerLoanApproval = (loanData: any, memberData: any) => {
    return notificationService.triggerLoanApproval(loanData, memberData);
  };

  const triggerPaymentReminder = (loanData: any, memberData: any) => {
    return notificationService.triggerPaymentReminder(loanData, memberData);
  };

  return {
    notifications,
    logs,
    sendNotification,
    retryNotification,
    cancelNotification,
    deleteNotification,
    triggerMemberRegistration,
    triggerLoanApproval,
    triggerPaymentReminder
  };
}