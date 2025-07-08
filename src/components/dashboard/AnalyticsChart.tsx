import React from 'react';
import { BarChart3, PieChart, TrendingUp, DollarSign } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Financial Analytics</h3>
          <p className="text-sm text-gray-600">Comprehensive financial overview for {period}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{formatCurrency(totalSavings)}</div>
            <div className="text-xs text-gray-500">Total Savings</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{formatCurrency(totalIncome)}</div>
            <div className="text-xs text-gray-500">External Income</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <div className="text-xs text-gray-500">Total Expenses</div>
          </div>
        </div>
      </div>

      {/* Bar Chart - Savings vs Income vs Expenses */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span>Monthly Comparison</span>
        </h4>
        <div className="relative h-64">
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
                        className="w-4 bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                        style={{ height: `${savingsHeight}%` }}
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Savings: {formatCurrency(item.savings)}
                      </div>
                    </div>
                    
                    {/* Income bar */}
                    <div className="relative group">
                      <div
                        className="w-4 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${incomeHeight}%` }}
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Income: {formatCurrency(item.income)}
                      </div>
                    </div>
                    
                    {/* Expenses bar */}
                    <div className="relative group">
                      <div
                        className="w-4 bg-red-500 rounded-t transition-all duration-300 hover:bg-red-600"
                        style={{ height: `${expensesHeight}%` }}
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Expenses: {formatCurrency(item.expenses)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Member Savings</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">External Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      </div>

      {/* Pie Chart Representation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Savings Breakdown */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3 flex items-center space-x-2">
            <PieChart className="w-4 h-4" />
            <span>Savings Trends</span>
          </h4>
          <div className="space-y-2">
            {data.monthlySavings.slice(-3).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-green-700">{item.month}</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-900">{formatCurrency(item.amount)}</div>
                  <div className="text-xs text-green-600">{item.members} members</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Income Breakdown */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Income Growth</span>
          </h4>
          <div className="space-y-2">
            {data.monthlyExternalIncome.slice(-3).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-blue-700">{item.month}</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-900">{formatCurrency(item.amount)}</div>
                  <div className="text-xs text-blue-600">{item.sources} sources</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-3 flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Expense Control</span>
          </h4>
          <div className="space-y-2">
            {data.monthlyExpenses.slice(-3).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-red-700">{item.month}</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-900">{formatCurrency(item.amount)}</div>
                  <div className="text-xs text-red-600">{item.categories} categories</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Health Indicator */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Financial Health Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Net Position:</span>
            <div className={`font-bold ${(totalSavings + totalIncome - totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalSavings + totalIncome - totalExpenses)}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Expense Ratio:</span>
            <div className="font-bold text-gray-900">
              {((totalExpenses / (totalSavings + totalIncome)) * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <span className="text-gray-600">Growth Rate:</span>
            <div className="font-bold text-blue-600">
              {(((totalIncome / totalSavings) - 1) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}