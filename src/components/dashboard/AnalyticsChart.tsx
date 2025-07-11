import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';

interface AnalyticsData {
  monthlySavings: { month: string; amount: number; members: number }[];
  monthlyExternalIncome: { month: string; amount: number; sources: number }[];
  monthlyExpenses: { month: string; amount: number; categories: number }[];
  savingsVsIncome: { month: string; savings: number; income: number; expenses: number }[];
}

interface AnalyticsChartProps {
  data: AnalyticsData;
  period: string;
}

export function AnalyticsChart({ data, period }: AnalyticsChartProps) {
  const [activeChart, setActiveChart] = useState('overview');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      notation: 'compact'
    }).format(amount);
  };

  const maxValue = Math.max(
    ...data.savingsVsIncome.map(d => Math.max(d.savings, d.income, d.expenses))
  );

  const totalSavings = data.monthlySavings.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = data.monthlyExternalIncome.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = data.monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
  const netPosition = totalSavings + totalIncome - totalExpenses;

  const chartTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'breakdown', label: 'Breakdown', icon: PieChart },
  ];

  const renderOverviewChart = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Total Savings</span>
          </div>
          <div className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalSavings)}</div>
          <div className="text-xs text-green-700">Member contributions</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">External Income</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(totalIncome)}</div>
          <div className="text-xs text-blue-700">From external sources</div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">Total Expenses</span>
          </div>
          <div className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalExpenses)}</div>
          <div className="text-xs text-red-700">Operational costs</div>
        </div>

        <div className={`p-4 rounded-lg ${netPosition >= 0 ? 'bg-purple-50' : 'bg-orange-50'}`}>
          <div className="flex items-center space-x-2">
            <TrendingUp className={`w-5 h-5 ${netPosition >= 0 ? 'text-purple-600' : 'text-orange-600'}`} />
            <span className={`text-sm font-medium ${netPosition >= 0 ? 'text-purple-900' : 'text-orange-900'}`}>
              Net Position
            </span>
          </div>
          <div className={`text-2xl font-bold mt-1 ${netPosition >= 0 ? 'text-purple-600' : 'text-orange-600'}`}>
            {formatCurrency(netPosition)}
          </div>
          <div className={`text-xs ${netPosition >= 0 ? 'text-purple-700' : 'text-orange-700'}`}>
            {netPosition >= 0 ? 'Positive' : 'Negative'} cash flow
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span>Monthly Financial Comparison</span>
        </h4>
        <div className="relative h-80">
          <div className="absolute inset-0 flex items-end justify-between space-x-2">
            {data.savingsVsIncome.map((item, index) => {
              const savingsHeight = (item.savings / maxValue) * 100;
              const incomeHeight = (item.income / maxValue) * 100;
              const expensesHeight = (item.expenses / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                  <div className="w-full flex justify-center space-x-1">
                    {/* Savings bar */}
                    <div className="relative group">
                      <div
                        className="w-6 bg-green-500 rounded-t transition-all duration-500 hover:bg-green-600"
                        style={{ height: `${savingsHeight}%` }}
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Savings: {formatCurrency(item.savings)}
                      </div>
                    </div>
                    
                    {/* Income bar */}
                    <div className="relative group">
                      <div
                        className="w-6 bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                        style={{ height: `${incomeHeight}%` }}
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Income: {formatCurrency(item.income)}
                      </div>
                    </div>
                    
                    {/* Expenses bar */}
                    <div className="relative group">
                      <div
                        className="w-6 bg-red-500 rounded-t transition-all duration-500 hover:bg-red-600"
                        style={{ height: `${expensesHeight}%` }}
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Expenses: {formatCurrency(item.expenses)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center transform -rotate-45 origin-center">
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Member Savings</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">External Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrendsChart = () => (
    <div className="space-y-6">
      {/* Growth Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-medium text-green-900 mb-3 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Savings Growth</span>
          </h4>
          <div className="space-y-3">
            {data.monthlySavings.slice(-3).map((item, index) => {
              const growth = index > 0 ? 
                ((item.amount - data.monthlySavings[data.monthlySavings.length - 3 + index - 1].amount) / 
                 data.monthlySavings[data.monthlySavings.length - 3 + index - 1].amount * 100) : 0;
              
              return (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-900">{formatCurrency(item.amount)}</div>
                    {index > 0 && (
                      <div className={`text-xs ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Income Trends</span>
          </h4>
          <div className="space-y-3">
            {data.monthlyExternalIncome.slice(-3).map((item, index) => {
              const growth = index > 0 ? 
                ((item.amount - data.monthlyExternalIncome[data.monthlyExternalIncome.length - 3 + index - 1].amount) / 
                 data.monthlyExternalIncome[data.monthlyExternalIncome.length - 3 + index - 1].amount * 100) : 0;
              
              return (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-900">{formatCurrency(item.amount)}</div>
                    {index > 0 && (
                      <div className={`text-xs ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-medium text-red-900 mb-3 flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Expense Control</span>
          </h4>
          <div className="space-y-3">
            {data.monthlyExpenses.slice(-3).map((item, index) => {
              const growth = index > 0 ? 
                ((item.amount - data.monthlyExpenses[data.monthlyExpenses.length - 3 + index - 1].amount) / 
                 data.monthlyExpenses[data.monthlyExpenses.length - 3 + index - 1].amount * 100) : 0;
              
              return (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-900">{formatCurrency(item.amount)}</div>
                    {index > 0 && (
                      <div className={`text-xs ${growth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Financial Health Indicators</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {((totalIncome / totalSavings) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Income to Savings Ratio</div>
            <div className="text-xs text-gray-500 mt-1">Higher is better</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {((totalExpenses / (totalSavings + totalIncome)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Expense Ratio</div>
            <div className="text-xs text-gray-500 mt-1">Lower is better</div>
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${netPosition >= 0 ? 'text-purple-600' : 'text-orange-600'}`}>
              {netPosition >= 0 ? '+' : ''}{((netPosition / (totalSavings + totalIncome)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Net Margin</div>
            <div className="text-xs text-gray-500 mt-1">Positive indicates growth</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBreakdownChart = () => (
    <div className="space-y-6">
      {/* Pie Chart Representations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Income Sources Distribution</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Member Savings</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{formatCurrency(totalSavings)}</div>
                <div className="text-xs text-gray-500">
                  {((totalSavings / (totalSavings + totalIncome)) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">External Income</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{formatCurrency(totalIncome)}</div>
                <div className="text-xs text-gray-500">
                  {((totalIncome / (totalSavings + totalIncome)) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            {/* Visual representation */}
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
              <div 
                className="bg-green-500 h-4 rounded-l-full" 
                style={{ width: `${(totalSavings / (totalSavings + totalIncome)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Monthly Member Activity</h4>
          <div className="space-y-3">
            {data.monthlySavings.slice(-4).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">{item.members} members</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Quarterly Performance Summary</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-600">Period</th>
                <th className="text-right py-2 text-sm font-medium text-gray-600">Savings</th>
                <th className="text-right py-2 text-sm font-medium text-gray-600">External Income</th>
                <th className="text-right py-2 text-sm font-medium text-gray-600">Expenses</th>
                <th className="text-right py-2 text-sm font-medium text-gray-600">Net Position</th>
              </tr>
            </thead>
            <tbody>
              {data.savingsVsIncome.map((item, index) => {
                const net = item.savings + item.income - item.expenses;
                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-sm text-gray-900">{item.month}</td>
                    <td className="py-2 text-sm text-right text-green-600">{formatCurrency(item.savings)}</td>
                    <td className="py-2 text-sm text-right text-blue-600">{formatCurrency(item.income)}</td>
                    <td className="py-2 text-sm text-right text-red-600">{formatCurrency(item.expenses)}</td>
                    <td className={`py-2 text-sm text-right font-medium ${net >= 0 ? 'text-purple-600' : 'text-orange-600'}`}>
                      {formatCurrency(net)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Financial Analytics Dashboard</h3>
          <p className="text-sm text-gray-600">Comprehensive financial overview for {period}</p>
        </div>
        
        {/* Chart Type Selector */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          {chartTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeChart === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Content */}
      {activeChart === 'overview' && renderOverviewChart()}
      {activeChart === 'trends' && renderTrendsChart()}
      {activeChart === 'breakdown' && renderBreakdownChart()}
    </div>
  );
}