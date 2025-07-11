import React, { useState } from 'react';
import { Employee, PayrollRecord } from '../../types';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2, 
  Download,
  DollarSign,
  Calendar,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  Award,
  FileText
} from 'lucide-react';

interface EmployeeManagementProps {
  employees: Employee[];
  payrollRecords: PayrollRecord[];
  onAddEmployee: (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditEmployee: (id: string, employee: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
  onGeneratePayroll: (period: string) => void;
}

export function EmployeeManagement({ 
  employees, 
  payrollRecords, 
  onAddEmployee, 
  onEditEmployee, 
  onDeleteEmployee,
  onGeneratePayroll 
}: EmployeeManagementProps) {
  const [activeTab, setActiveTab] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const tabs = [
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-yellow-100 text-yellow-800',
      terminated: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status as keyof typeof classes]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getEmploymentTypeBadge = (type: string) => {
    const classes = {
      full_time: 'bg-blue-100 text-blue-800',
      part_time: 'bg-purple-100 text-purple-800',
      contract: 'bg-orange-100 text-orange-800',
      intern: 'bg-pink-100 text-pink-800'
    };

    const labels = {
      full_time: 'Full Time',
      part_time: 'Part Time',
      contract: 'Contract',
      intern: 'Intern'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[type as keyof typeof classes]}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = [...new Set(employees.map(emp => emp.department))];
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const totalPayroll = employees
    .filter(emp => emp.status === 'active')
    .reduce((sum, emp) => sum + emp.basicSalary, 0);

  const renderEmployeesList = () => (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="terminated">Terminated</option>
          </select>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Employees</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{employees.length}</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Active</span>
          </div>
          <div className="text-2xl font-bold text-green-600 mt-1">{activeEmployees}</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Monthly Payroll</span>
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{formatCurrency(totalPayroll)}</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Departments</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 mt-1">{departments.length}</div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={employee.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{employee.employeeNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.email}</div>
                    <div className="text-sm text-gray-500">{employee.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employee.position}</div>
                    <div className="text-sm text-gray-500">{employee.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getEmploymentTypeBadge(employee.employmentType)}
                      <div className="text-xs text-gray-500">
                        Since {new Date(employee.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(employee.basicSalary)}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {employee.payrollFrequency.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(employee.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedEmployee(employee)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {/* Handle edit */}}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Employees Found</h3>
            <p className="text-gray-500">No employees match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPayrollManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Payroll Management</h3>
        <div className="flex items-center space-x-3">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Current Month</option>
            <option>Previous Month</option>
            <option>Custom Period</option>
          </select>
          <button
            onClick={() => onGeneratePayroll('current')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate Payroll
          </button>
        </div>
      </div>

      {/* Payroll Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 mb-1">Total Gross Pay</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPayroll)}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 mb-1">Total Deductions</div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalPayroll * 0.15)}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600 mb-1">Net Payroll</div>
          <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalPayroll * 0.85)}</div>
        </div>
      </div>

      {/* Payroll Records */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-md font-semibold text-gray-900">Payroll Records</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrollRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.period}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(record.grossPay)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(record.totalDeductions)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(record.netPay)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Employee Reports</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          'Employee Directory',
          'Payroll Summary',
          'Attendance Report',
          'Performance Review',
          'Department Analysis',
          'Salary Analysis',
          'Employee Turnover',
          'Benefits Report',
          'Tax Report'
        ].map((report) => (
          <div key={report} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="font-medium text-gray-900">{report}</div>
            </div>
            <div className="flex space-x-2">
              {['PDF', 'Excel', 'CSV'].map((format) => (
                <button
                  key={format}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600">Manage employees, payroll, and HR operations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'employees' && renderEmployeesList()}
      {activeTab === 'payroll' && renderPayrollManagement()}
      {activeTab === 'reports' && renderReports()}

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedEmployee.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
                    alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </h2>
                    <p className="text-gray-600">{selectedEmployee.position} • {selectedEmployee.department}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Eye className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedEmployee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedEmployee.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedEmployee.address}</span>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Employment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Employee Number</div>
                    <div className="font-medium">{selectedEmployee.employeeNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Employment Type</div>
                    <div className="font-medium">{getEmploymentTypeBadge(selectedEmployee.employmentType)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Start Date</div>
                    <div className="font-medium">{new Date(selectedEmployee.startDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-medium">{getStatusBadge(selectedEmployee.status)}</div>
                  </div>
                </div>
              </div>

              {/* Compensation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Compensation</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 mb-1">Basic Salary</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedEmployee.basicSalary)}
                  </div>
                  <div className="text-sm text-green-700 capitalize">
                    {selectedEmployee.payrollFrequency.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}