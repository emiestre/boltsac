import React from 'react';
import { Clock, User, DollarSign, FileText, Check } from 'lucide-react';

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'loan_application',
      message: 'Jane Smith applied for a loan of UGX 2,000,000',
      time: '2 hours ago',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'member_joined',
      message: 'New member John Doe joined the SACCO',
      time: '4 hours ago',
      icon: User,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'loan_approved',
      message: 'Loan application for Peter Johnson approved',
      time: '1 day ago',
      icon: Check,
      color: 'text-green-600'
    },
    {
      id: 4,
      type: 'savings_deposit',
      message: 'Mary Wilson made a savings deposit of UGX 500,000',
      time: '2 days ago',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      id: 5,
      type: 'report_generated',
      message: 'Monthly financial report generated',
      time: '3 days ago',
      icon: FileText,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activity.icon;
        return (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg bg-gray-50 ${activity.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}