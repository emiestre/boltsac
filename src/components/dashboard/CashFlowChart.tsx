import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  externalIncome: number;
  memberContributions: number;
  loanDisbursements: number;
  loanRepayments: number;
}

interface CashFlowChartProps {
  data: CashFlowData[];
  period: string;
}

export function CashFlowChart({ data, period }: CashFlowChartProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cash Flow Analysis</h3>
          <p className="text-sm text-gray-600">Financial trends for {period}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Inflow</span>
            </div>
            <div className="text-lg font-bold text-green-600">{formatCurrency(totalInflow)}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <ArrowDownRight className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">Outflow</span>
            </div>
            <div className="text-lg font-bold text-red-600">{formatCurrency(totalOutflow)}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center space-x-1">
              {netCashFlow >= 0 ? (
                <TrendingUp className="w-4 h-4 text-blue-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-orange-600" />
              )}
              <span className="text-sm font-medium text-gray-600">Net Flow</span>
            </div>
            <div className={`text-lg font-bold ${netCashFlow >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {formatCurrency(netCashFlow)}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64 mb-6">
        <div className="absolute inset-0 flex items-end justify-between space-x-1">
          {data.map((item, index) => {
            const inflowHeight = (item.inflow / maxValue) * 100;
            const outflowHeight = (item.outflow / maxValue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                <div className="w-full flex justify-center space-x-1">
                  {/* Inflow bar */}
                  <div className="relative group">
                    <div
                      className="w-6 bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                      style={{ height: `${inflowHeight}%` }}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Inflow: {formatCurrency(item.inflow)}
                    </div>
                  </div>
                  
                  {/* Outflow bar */}
                  <div className="relative group">
                    <div
                      className="w-6 bg-red-500 rounded-t transition-all duration-300 hover:bg-red-600"
                      style={{ height: `${outflowHeight}%` }}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Outflow: {formatCurrency(item.outflow)}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 text-center">
                  {formatDate(item.date)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend and breakdown */}
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
                {formatCurrency(500000)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span className="text-sm text-gray-600">Other Expenses</span>
              </div>
              <span className="text-sm font-medium">
                {formatCurrency(200000)}
              </span>
            </div>
          </div>
        </div>
      </div>

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