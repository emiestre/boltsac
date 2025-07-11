import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, BarChart3, LineChart, Activity } from 'lucide-react';

interface CashFlowData {
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

interface CashFlowChartProps {
  data: CashFlowData[];
  period: string;
}

export function CashFlowChart({ data, period }: CashFlowChartProps) {
  const [chartType, setChartType] = useState('bars');
  const [viewMode, setViewMode] = useState('net');

  const maxValue = Math.max(...data.map(d => Math.max(d.inflow, d.outflow)));
  const totalInflow = data.reduce((sum, d) => sum + d.inflow, 0);
  const totalOutflow = data.reduce((sum, d) => sum + d.outflow, 0);
  const netCashFlow = totalInflow - totalOutflow;
  const totalExternalIncome = data.reduce((sum, d) => sum + d.externalIncome, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      notation: 'compact'
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartTypes = [
    { id: 'bars', label: 'Bar Chart', icon: BarChart3 },
    { id: 'lines', label: 'Line Chart', icon: LineChart },
    { id: 'flow', label: 'Flow View', icon: Activity },
  ];

  const viewModes = [
    { id: 'net', label: 'Net Flow' },
    { id: 'inout', label: 'In/Out Flow' },
    { id: 'detailed', label: 'Detailed' },
  ];

  const renderBarChart = () => (
    <div className="relative h-80">
      <div className="absolute inset-0 flex items-end justify-between space-x-1">
        {data.map((item, index) => {
          const inflowHeight = (item.inflow / maxValue) * 100;
          const outflowHeight = (item.outflow / maxValue) * 100;
          const netHeight = Math.abs(item.netFlow) / maxValue * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              {viewMode === 'net' ? (
                <div className="w-full flex justify-center">
                  <div className="relative group">
                    <div
                      className={`w-8 rounded-t transition-all duration-500 ${
                        item.netFlow >= 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                      }`}
                      style={{ height: `${netHeight}%` }}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Net: {formatCurrency(item.netFlow)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full flex justify-center space-x-1">
                  {/* Inflow bar */}
                  <div className="relative group">
                    <div
                      className="w-6 bg-green-500 rounded-t transition-all duration-500 hover:bg-green-600"
                      style={{ height: `${inflowHeight}%` }}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Inflow: {formatCurrency(item.inflow)}
                    </div>
                  </div>
                  
                  {/* Outflow bar */}
                  <div className="relative group">
                    <div
                      className="w-6 bg-red-500 rounded-t transition-all duration-500 hover:bg-red-600"
                      style={{ height: `${outflowHeight}%` }}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Outflow: {formatCurrency(item.outflow)}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-xs text-gray-500 text-center transform -rotate-45 origin-center">
                {formatDate(item.date)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderLineChart = () => (
    <div className="relative h-80">
      <svg className="w-full h-full" viewBox="0 0 800 300">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={300 - (y * 3)}
            x2="800"
            y2={300 - (y * 3)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Inflow line */}
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          points={data.map((item, index) => {
            const x = (index / (data.length - 1)) * 800;
            const y = 300 - ((item.inflow / maxValue) * 280);
            return `${x},${y}`;
          }).join(' ')}
        />
        
        {/* Outflow line */}
        <polyline
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          points={data.map((item, index) => {
            const x = (index / (data.length - 1)) * 800;
            const y = 300 - ((item.outflow / maxValue) * 280);
            return `${x},${y}`;
          }).join(' ')}
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 800;
          const inflowY = 300 - ((item.inflow / maxValue) * 280);
          const outflowY = 300 - ((item.outflow / maxValue) * 280);
          
          return (
            <g key={index}>
              <circle cx={x} cy={inflowY} r="4" fill="#10b981" />
              <circle cx={x} cy={outflowY} r="4" fill="#ef4444" />
            </g>
          );
        })}
      </svg>
    </div>
  );

  const renderFlowView = () => (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium text-gray-900">{formatDate(item.date)}</div>
            <div className={`flex items-center space-x-1 ${
              item.netFlow >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {item.netFlow >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">{formatCurrency(item.netFlow)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Inflow:</span>
              <span className="font-medium text-green-600">{formatCurrency(item.inflow)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Outflow:</span>
              <span className="font-medium text-red-600">{formatCurrency(item.outflow)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">External:</span>
              <span className="font-medium text-blue-600">{formatCurrency(item.externalIncome)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Contributions:</span>
              <span className="font-medium text-purple-600">{formatCurrency(item.memberContributions)}</span>
            </div>
          </div>
          
          {/* Progress bar for net flow */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  item.netFlow >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(Math.abs(item.netFlow) / maxValue * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cash Flow Analysis</h3>
          <p className="text-sm text-gray-600">Financial trends for {period}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setChartType(type.id)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                    chartType === type.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* View Mode Selector */}
          {chartType === 'bars' && (
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {viewModes.map((mode) => (
                <option key={mode.id} value={mode.id}>
                  {mode.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowUpRight className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Total Inflow</span>
          </div>
          <div className="text-xl font-bold text-green-600">{formatCurrency(totalInflow)}</div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowDownRight className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">Total Outflow</span>
          </div>
          <div className="text-xl font-bold text-red-600">{formatCurrency(totalOutflow)}</div>
        </div>
        
        <div className={`p-4 rounded-lg ${netCashFlow >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
          <div className="flex items-center space-x-2 mb-2">
            {netCashFlow >= 0 ? (
              <TrendingUp className="w-4 h-4 text-blue-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-orange-600" />
            )}
            <span className={`text-sm font-medium ${netCashFlow >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
              Net Flow
            </span>
          </div>
          <div className={`text-xl font-bold ${netCashFlow >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {formatCurrency(netCashFlow)}
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">External Income</span>
          </div>
          <div className="text-xl font-bold text-purple-600">{formatCurrency(totalExternalIncome)}</div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="mb-6">
        {chartType === 'bars' && renderBarChart()}
        {chartType === 'lines' && renderLineChart()}
        {chartType === 'flow' && renderFlowView()}
      </div>

      {/* Legend and breakdown */}
      {chartType !== 'flow' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Income Sources</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">Member Contributions</span>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(data.reduce((sum, d) => sum + d.memberContributions, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">External Income</span>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(totalExternalIncome)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-sm text-gray-600">Loan Repayments</span>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(data.reduce((sum, d) => sum + d.loanRepayments, 0))}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Expenditures</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600">Loan Disbursements</span>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(data.reduce((sum, d) => sum + d.loanDisbursements, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-sm text-gray-600">Operating Expenses</span>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(data.reduce((sum, d) => sum + d.expenses, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* External Income Impact */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h4 className="font-medium text-green-900">External Income Impact</h4>
        </div>
        <p className="text-sm text-green-800">
          External income sources contributed <strong>{formatCurrency(totalExternalIncome)}</strong> ({((totalExternalIncome / totalInflow) * 100).toFixed(1)}%) 
          to total cash inflow this {period.toLowerCase()}, strengthening the SACCO's financial position.
        </p>
      </div>
    </div>
  );
}