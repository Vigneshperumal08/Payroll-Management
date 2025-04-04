
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { PayrollOverview } from '@/components/payroll/PayrollOverview';
import { EmployeeCard, EmployeeData } from '@/components/employees/EmployeeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, CalendarClock, Clock, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRealTimeDataContext } from '@/providers/RealTimeDataProvider';

// Define allowed status types to match EmployeeCard
type EmployeeStatus = 'active' | 'on-leave' | 'terminated';

const HrDashboard = () => {
  const { employees, leaveRequests, addEmployee, updateLeaveStatus } = useRealTimeDataContext();
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false); // Added missing state
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    status: 'active' as EmployeeStatus
  });

  const payrollSummary = {
    totalGrossSalary: 125000,
    totalNetSalary: 89500,
    totalTaxes: 26500,
    totalDeductions: 9000,
    totalEmployeeCount: employees.length,
    totalProcessedCount: employees.length - 2,
    period: 'April 1-30, 2025',
    status: 'processing' as const,
  };

  const handleEditEmployee = (employee: EmployeeData) => {
    setSelectedEmployee(employee);
    setShowViewDialog(true);
  };

  const handleViewEmployee = (employee: EmployeeData) => {
    setSelectedEmployee(employee);
    setShowViewDialog(true);
  };

  const handleAddEmployee = async () => {
    await addEmployee(newEmployee);
    setShowAddDialog(false);
    setNewEmployee({
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      status: 'active'
    });
  };

  const handleApproveRequest = async (requestId: string) => {
    await updateLeaveStatus(requestId, 'Approved', 'HR Manager');
  };

  const handleRejectRequest = async (requestId: string) => {
    await updateLeaveStatus(requestId, 'Rejected', 'HR Manager');
  };

  // Get pending requests only
  const pendingRequests = leaveRequests.filter(req => req.status === 'Pending');

  // Convert employee status to the correct format
  const formatEmployeeData = (emp: any): EmployeeData => {
    // Ensure status is one of the allowed values
    let status: EmployeeStatus = 'active';
    
    if (emp.status.toLowerCase() === 'on-leave') {
      status = 'on-leave';
    } else if (emp.status.toLowerCase() === 'terminated' || emp.status.toLowerCase() === 'inactive') {
      status = 'terminated';
    }
    
    return {
      id: emp.id,
      name: emp.name,
      position: emp.position,
      department: emp.department,
      email: emp.email,
      phone: emp.phone || '',
      status: status
    };
  };

  return (
    <AppLayout allowedRoles={['hr']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">HR Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, HR Manager. Here's what's happening with your team.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Employees"
            value={employees.length.toString()}
            icon={<Users size={20} />}
          />
          <StatCard
            title="Time Off Requests"
            value={pendingRequests.length.toString()}
            icon={<CalendarClock size={20} />}
            trend={{ value: 2, isPositive: false }}
          />
          <StatCard
            title="Pending Approvals"
            value={pendingRequests.length.toString()}
            icon={<Clock size={20} />}
          />
          <StatCard
            title="Completed Tasks"
            value="12"
            icon={<BadgeCheck size={20} />}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <div 
                      key={request.id} 
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <div className="font-medium">{request.employeeName}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{request.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {request.startDate} to {request.endDate}
                          </span>
                        </div>
                        <div className="text-sm mt-1">
                          Reason: {request.reason}
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApproveRequest(request.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pending approval requests</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg border">
                  <div className="font-medium">New Hire Orientation</div>
                  <div className="text-sm text-muted-foreground">Apr 15, 10:00 AM - 12:00 PM</div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="font-medium">Performance Reviews</div>
                  <div className="text-sm text-muted-foreground">Apr 20 - Apr 24</div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="font-medium">Team Building</div>
                  <div className="text-sm text-muted-foreground">Apr 28, 2:00 PM - 5:00 PM</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <PayrollOverview summary={payrollSummary} />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Employees</h2>
            <Button onClick={() => setShowAddDialog(true)}>Add Employee</Button>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="on-leave">On Leave</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {employees.map((employee) => (
                  <EmployeeCard 
                    key={employee.id} 
                    employee={formatEmployeeData(employee)}
                    onEdit={handleEditEmployee}
                    onView={handleViewEmployee}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {employees
                  .filter(emp => emp.status.toLowerCase() === 'active')
                  .map((employee) => (
                    <EmployeeCard 
                      key={employee.id} 
                      employee={formatEmployeeData(employee)}
                      onEdit={handleEditEmployee}
                      onView={handleViewEmployee}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="on-leave" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {employees
                  .filter(emp => emp.status.toLowerCase() === 'on-leave')
                  .map((employee) => (
                    <EmployeeCard 
                      key={employee.id} 
                      employee={formatEmployeeData(employee)}
                      onEdit={handleEditEmployee}
                      onView={handleViewEmployee}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Add Employee Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter employee details to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={newEmployee.name} 
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={newEmployee.email} 
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input 
                  id="position" 
                  value={newEmployee.position} 
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department" 
                  value={newEmployee.department} 
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={newEmployee.phone} 
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newEmployee.status} 
                  onValueChange={(value: EmployeeStatus) => setNewEmployee({...newEmployee, status: value})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="terminated">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddEmployee}>Add Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View/Edit Employee Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
              <DialogDescription>
                View and manage employee information.
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Full Name</Label>
                    <p className="font-medium">{selectedEmployee.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Position</Label>
                    <p className="font-medium">{selectedEmployee.position}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Department</Label>
                    <p className="font-medium">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedEmployee.phone || 'Not available'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="pt-1">
                      <Badge
                        variant={
                          selectedEmployee.status === 'active' ? 'default' :
                          selectedEmployee.status === 'on-leave' ? 'secondary' :
                          'outline'
                        }
                      >
                        {selectedEmployee.status.charAt(0).toUpperCase() + selectedEmployee.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default HrDashboard;
