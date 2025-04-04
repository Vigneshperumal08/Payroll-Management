
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { PayrollOverview } from '@/components/payroll/PayrollOverview';
import { EmployeeCard, EmployeeData } from '@/components/employees/EmployeeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Users, DollarSign, TrendingUp, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for chart
const payrollData = [
  { name: 'Jan', amount: 24000 },
  { name: 'Feb', amount: 25500 },
  { name: 'Mar', amount: 25000 },
  { name: 'Apr', amount: 26000 },
  { name: 'May', amount: 27200 },
  { name: 'Jun', amount: 29500 },
  { name: 'Jul', amount: 29800 },
];

// Mock employee data
const recentEmployees: EmployeeData[] = [
  {
    id: '1',
    name: 'Vignesh',
    position: 'Software Engineer',
    department: 'Engineering',
    email: 'jane@example.com',
    phone: '(555) 123-4567',
    status: 'active',
  },
  {
    id: '2',
    name: 'vicky',
    position: 'Product Manager',
    department: 'Product',
    email: 'alex@example.com',
    phone: '(555) 234-5678',
    status: 'on-leave',
  },
];

const AdminDashboard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);

  const payrollSummary = {
    totalGrossSalary: 125000,
    totalNetSalary: 89500,
    totalTaxes: 26500,
    totalDeductions: 9000,
    totalEmployeeCount: 48,
    totalProcessedCount: 42,
    period: 'July 1-31, 2023',
    status: 'processing' as const,
  };

  const handleEditEmployee = (employee: EmployeeData) => {
    console.log('Edit employee:', employee);
    setSelectedEmployee(employee);
  };

  const handleViewEmployee = (employee: EmployeeData) => {
    console.log('View employee:', employee);
    setSelectedEmployee(employee);
  };

  return (
    <AppLayout allowedRoles={['admin']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Admin. Here's what's happening with your company.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Employees"
            value="48"
            icon={<Users size={20} />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Monthly Payroll"
            value="$125,000"
            icon={<DollarSign size={20} />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Pending Approvals"
            value="6"
            icon={<MoreHorizontal size={20} />}
          />
          <StatCard
            title="Revenue Per Employee"
            value="$8,250"
            icon={<TrendingUp size={20} />}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payroll Trends</CardTitle>
                <Button variant="ghost" size="sm">
                  View Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={payrollData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary) / 0.2)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Users size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">New employee added</p>
                    <p className="text-xs text-muted-foreground">Tyler Smith joined Engineering</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <DollarSign size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Payroll processed</p>
                    <p className="text-xs text-muted-foreground">June payroll was processed</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <BarChart size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Tax report generated</p>
                    <p className="text-xs text-muted-foreground">Q2 Tax report is ready</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <PayrollOverview summary={payrollSummary} />
          
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Employees</h2>
              <div className="flex gap-2">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="on-leave">On Leave</TabsTrigger>
                </TabsList>
                <Button size="sm">Add Employee</Button>
              </div>
            </div>
            <TabsContent value="all" className="mt-0">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentEmployees.map((employee) => (
                  <EmployeeCard 
                    key={employee.id} 
                    employee={employee} 
                    onEdit={handleEditEmployee}
                    onView={handleViewEmployee}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="active" className="mt-0">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentEmployees
                  .filter(emp => emp.status === 'active')
                  .map((employee) => (
                    <EmployeeCard 
                      key={employee.id} 
                      employee={employee} 
                      onEdit={handleEditEmployee}
                      onView={handleViewEmployee}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="on-leave" className="mt-0">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentEmployees
                  .filter(emp => emp.status === 'on-leave')
                  .map((employee) => (
                    <EmployeeCard 
                      key={employee.id} 
                      employee={employee} 
                      onEdit={handleEditEmployee}
                      onView={handleViewEmployee}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
