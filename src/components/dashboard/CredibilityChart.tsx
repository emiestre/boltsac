import React from 'react';
import { Star, TrendingUp, TrendingDown, Minus, Award, AlertTriangle } from 'lucide-react';

interface CredibilityMetrics {
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

interface CredibilityChartProps {
  data: CredibilityMetrics[];
}

export function CredibilityChart({ data }: CredibilityChartProps) {
  const averageScore = data.reduce((sum, member) => sum + member.score, 0) / data.length;
  const highPerformers = data.filter(member => member.score >= 80).length;
  const improvingMembers = data.filter(member => member.trend === 'improving').length;
  const atRiskMembers = data.filter(member => member.score < 60).length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const sortedData = [...data].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Member Credibility Scores</h3>
          <p className="text-sm text-gray-600">Based on payment history, savings consistency, and income stability</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{averageScore.toFixed(1)}</div>
            <div className="text-xs text-gray-500">Average Score</div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">High Performers</span>
          </div>
          <div className="text-2xl font-bold text-green-600 mt-1">{highPerformers}</div>
          <div className="text-xs text-green-700">Score ≥ 80</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Improving</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{improvingMembers}</div>
          <div className="text-xs text-blue-700">Positive trend</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">At Risk</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 mt-1">{atRiskMembers}</div>
          <div className="text-xs text-orange-700">Score &lt; 60</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Total Members</span>
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{data.length}</div>
          <div className="text-xs text-purple-700">Active members</div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Top 10 Members by Credibility Score</h4>
        <div className="space-y-2">
          {sortedData.slice(0, 10).map((member, index) => (
            <div key={member.memberId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{member.memberName}</div>
                  <div className="text-sm text-gray-500">
                    Updated {new Date(member.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(member.score)}`}>
                    {member.score}/100
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{getScoreLabel(member.score)}</div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {getTrendIcon(member.trend)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score Distribution */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Score Distribution</h4>
        <div className="space-y-3">
          {[
            { range: '80-100', label: 'Excellent', color: 'bg-green-500', count: data.filter(m => m.score >= 80).length },
            { range: '60-79', label: 'Good', color: 'bg-yellow-500', count: data.filter(m => m.score >= 60 && m.score < 80).length },
            { range: '40-59', label: 'Fair', color: 'bg-orange-500', count: data.filter(m => m.score >= 40 && m.score < 60).length },
            { range: '0-39', label: 'Poor', color: 'bg-red-500', count: data.filter(m => m.score < 40).length },
          ].map((category) => {
            const percentage = (category.count / data.length) * 100;
            return (
              <div key={category.range} className="flex items-center space-x-3">
                <div className="w-20 text-sm text-gray-600">{category.range}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div
                    className={`${category.color} h-4 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {category.count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600">{category.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Credibility Factors */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Credibility Scoring Factors</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
          <div>• Payment History (30%)</div>
          <div>• Savings Consistency (25%)</div>
          <div>• Loan Repayment Rate (20%)</div>
          <div>• External Income Stability (15%)</div>
          <div>• Membership Duration (10%)</div>
        </div>
      </div>
    </div>
  );
}