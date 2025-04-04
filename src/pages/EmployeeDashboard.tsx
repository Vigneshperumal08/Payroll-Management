
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Wallet, Clock, Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeDataContext } from '@/providers/RealTimeDataProvider';

const EmployeeDashboard = () => {
  const { toast } = useToast();
  const { 
    employees, 
    leaveRequests, 
    benefits, 
    timesheets,
    submitLeaveRequest, 
    submitTimesheet,
    updateBenefits 
  } = useRealTimeDataContext();
  
  // State for dialogs
  const [showLeaveRequestDialog, setShowLeaveRequestDialog] = useState(false);
  const [showTimesheetDialog, setShowTimesheetDialog] = useState(false);
  const [showBenefitsDialog, setShowBenefitsDialog] = useState(false);
  
  // Form states
  const [leaveForm, setLeaveForm] = useState({
    type: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });
  
  const [timesheetForm, setTimesheetForm] = useState({
    monday: 8,
    tuesday: 8,
    wednesday: 8,
    thursday: 8,
    friday: 8,
    saturday: 0,
    sunday: 0
  });
  
  const [benefitForm, setBenefitForm] = useState({
    benefitType: 'Health Insurance',
    coverageType: 'Family',
  });

  // Mock employee ID (in a real app, would come from auth context)
  const currentEmployeeId = '1';
  const currentEmployee = employees.find(emp => emp.id === currentEmployeeId) || {
    name: 'John Doe',
    id: currentEmployeeId,
  };
  
  // Get employee's leave requests
  const employeeLeaveRequests = leaveRequests.filter(lr => lr.employeeId === currentEmployeeId);
  
  // Get employee's timesheet
  const currentTimesheet = timesheets.find(ts => ts.employeeId === currentEmployeeId) || {
    days: {
      monday: { status: 'approved' as const, hours: 8 },
      tuesday: { status: 'approved' as const, hours: 8 },
      wednesday: { status: 'approved' as const, hours: 8 },
      thursday: { status: 'pending' as const, hours: 8 },
      friday: { status: 'pending' as const, hours: 7.5 },
      saturday: { status: 'none' as const, hours: 0 },
      sunday: { status: 'none' as const, hours: 0 },
    }
  };
  
  // Calculate total hours worked
  const totalHours = Object.values(currentTimesheet.days || {}).reduce((total, day) => total + day.hours, 0);
  const targetHours = 40;
  const progressPercentage = (totalHours / targetHours) * 100;
  
  // Get employee's benefits
  const employeeBenefits = benefits.filter(b => b.employeeId === currentEmployeeId);
  
  // Mock pay stubs data
  const recentPayStubs = [
    { id: 1, period: 'March 1-31, 2025', netPay: '$3,450.00', date: 'Apr 5, 2025' },
    { id: 2, period: 'February 1-28, 2025', netPay: '$3,450.00', date: 'Mar 5, 2025' },
    { id: 3, period: 'January 1-31, 2025', netPay: '$3,450.00', date: 'Feb 5, 2025' },
  ];
  
  // Mock upcoming events
  const upcomingEvents = [
    { id: 1, title: 'Quarterly Review', date: 'Apr 15, 2025', time: '10:00 AM' },
    { id: 2, title: 'Team Meeting', date: 'Apr 18, 2025', time: '2:00 PM' },
    { id: 3, title: 'Company Picnic', date: 'Apr 30, 2025', time: '12:00 PM' },
  ];

  // Handle leave request submission
  const handleLeaveRequestSubmit = async () => {
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const success = await submitLeaveRequest({
      employeeId: currentEmployeeId,
      employeeName: currentEmployee.name,
      type: leaveForm.type,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      reason: leaveForm.reason,
      status: 'Pending'
    });
    
    if (success) {
      setShowLeaveRequestDialog(false);
      setLeaveForm({
        type: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: ''
      });
    }
  };
  
  // Handle timesheet submission
  const handleTimesheetSubmit = async () => {
    const days = {
      monday: { status: 'pending' as const, hours: timesheetForm.monday },
      tuesday: { status: 'pending' as const, hours: timesheetForm.tuesday },
      wednesday: { status: 'pending' as const, hours: timesheetForm.wednesday },
      thursday: { status: 'pending' as const, hours: timesheetForm.thursday },
      friday: { status: 'pending' as const, hours: timesheetForm.friday },
      saturday: { status: 'pending' as const, hours: timesheetForm.saturday },
      sunday: { status: 'pending' as const, hours: timesheetForm.sunday },
    };
    
    const totalHours = Object.values(days).reduce((total, day) => total + day.hours, 0);
    
    const success = await submitTimesheet({
      employeeId: currentEmployeeId,
      week: 'April 3-9, 2025',
      days,
      totalHours,
      status: 'submitted'
    });
    
    if (success) {
      setShowTimesheetDialog(false);
    }
  };
  
  // Handle benefits update
  const handleBenefitsUpdate = async () => {
    const success = await updateBenefits(currentEmployeeId, {
      benefit: benefitForm.benefitType,
      coverage: benefitForm.coverageType,
      cost: benefitForm.benefitType === 'Health Insurance' ? '$220/mo' : 
            benefitForm.benefitType === 'Dental Insurance' ? '$30/mo' : 
            '6% of salary',
      status: 'Enrolled'
    });
    
    if (success) {
      setShowBenefitsDialog(false);
    }
  };
  
  const handleDownloadPayslip = (period: string) => {
    toast({
      title: "Payslip Downloaded",
      description: `Payslip for period ${period} has been downloaded.`,
    });
  };

  return (
    <AppLayout allowedRoles={['employee']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentEmployee.name}. Here's your current information.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Current Pay"
            value="$3,450.00"
            icon={<DollarSign size={20} />}
            trend={{ value: 2.5, isPositive: true }}
          />
          <StatCard
            title="Hours This Week"
            value={`${totalHours} / ${targetHours}`}
            icon={<Clock size={20} />}
          />
          <StatCard
            title="PTO Balance"
            value="12 days"
            icon={<Calendar size={20} />}
          />
          <StatCard
            title="Benefits"
            value={`${employeeBenefits.length} Active`}
            icon={<Wallet size={20} />}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Pay Stubs</CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayStubs.map((payStub) => (
                    <TableRow key={payStub.id}>
                      <TableCell>{payStub.period}</TableCell>
                      <TableCell>{payStub.netPay}</TableCell>
                      <TableCell>{payStub.date}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadPayslip(payStub.period)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Events</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg border">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.date}, {event.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Timesheet</CardTitle>
                <CardDescription>Week of April 3 - April 9, 2025</CardDescription>
              </div>
              <Button onClick={() => setShowTimesheetDialog(true)}>Submit Timesheet</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-sm font-medium">{day}</div>
                    <div className="text-xs text-muted-foreground">Apr {3 + index}</div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Object.values(currentTimesheet.days || {}).map((day, index) => {
                  let badgeVariant = 'outline';
                  let badgeText = 'Not Set';
                  
                  if (day.status === 'approved') {
                    badgeVariant = 'default';
                    badgeText = `${day.hours}h`;
                  } else if (day.status === 'pending') {
                    badgeVariant = 'secondary';
                    badgeText = `${day.hours}h`;
                  }
                  
                  return (
                    <div key={index} className="text-center">
                      <Badge variant={badgeVariant as any} className="w-full">
                        {badgeText}
                      </Badge>
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Hours Logged</span>
                  <span className="text-sm font-medium">{totalHours} / {targetHours} hours</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leave Requests</CardTitle>
                <Button onClick={() => setShowLeaveRequestDialog(true)}>Request Leave</Button>
              </div>
            </CardHeader>
            <CardContent>
              {employeeLeaveRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeLeaveRequests.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>{leave.type}</TableCell>
                        <TableCell>{leave.startDate} to {leave.endDate}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              leave.status === 'Approved' ? 'default' :
                              leave.status === 'Rejected' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {leave.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No leave requests found</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Benefits</CardTitle>
                <Button onClick={() => setShowBenefitsDialog(true)}>Manage Benefits</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="enrolled">
                <TabsList>
                  <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
                  <TabsTrigger value="eligible">Eligible</TabsTrigger>
                </TabsList>
                <TabsContent value="enrolled" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Benefit</TableHead>
                        <TableHead>Coverage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employeeBenefits.map((benefit) => (
                        <TableRow key={benefit.id}>
                          <TableCell className="font-medium">{benefit.benefit}</TableCell>
                          <TableCell>{benefit.coverage}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                              {benefit.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{benefit.cost}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="eligible" className="mt-4">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">You are eligible for these additional benefits:</p>
                    <div className="mt-4 space-y-2">
                      <Badge variant="outline" className="mr-2 px-3 py-1">Vision Insurance</Badge>
                      <Badge variant="outline" className="mr-2 px-3 py-1">Life Insurance</Badge>
                      <Badge variant="outline" className="mr-2 px-3 py-1">Disability Insurance</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">The next open enrollment period is in November.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Leave Request Dialog */}
      <Dialog open={showLeaveRequestDialog} onOpenChange={setShowLeaveRequestDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Time Off</DialogTitle>
            <DialogDescription>
              Submit your leave request for approval.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select 
                value={leaveForm.type} 
                onValueChange={(value) => setLeaveForm({...leaveForm, type: value})}
              >
                <SelectTrigger id="leaveType">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Vacation">Vacation</SelectItem>
                  <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                  <SelectItem value="Family Leave">Family Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate" 
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea 
                id="reason"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                placeholder="Please provide a reason for your leave request"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeaveRequestDialog(false)}>Cancel</Button>
            <Button onClick={handleLeaveRequestSubmit}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Timesheet Dialog */}
      <Dialog open={showTimesheetDialog} onOpenChange={setShowTimesheetDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit Timesheet</DialogTitle>
            <DialogDescription>
              Enter your working hours for the week.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monday">Monday (Hours)</Label>
                <Input 
                  id="monday" 
                  type="number" 
                  value={timesheetForm.monday}
                  onChange={(e) => setTimesheetForm({...timesheetForm, monday: Number(e.target.value)})}
                  min="0"
                  max="24"
                />
              </div>
              <div>
                <Label htmlFor="tuesday">Tuesday (Hours)</Label>
                <Input 
                  id="tuesday" 
                  type="number"
                  value={timesheetForm.tuesday}
                  onChange={(e) => setTimesheetForm({...timesheetForm, tuesday: Number(e.target.value)})}
                  min="0"
                  max="24"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wednesday">Wednesday (Hours)</Label>
                <Input 
                  id="wednesday" 
                  type="number"
                  value={timesheetForm.wednesday}
                  onChange={(e) => setTimesheetForm({...timesheetForm, wednesday: Number(e.target.value)})}
                  min="0"
                  max="24"
                />
              </div>
              <div>
                <Label htmlFor="thursday">Thursday (Hours)</Label>
                <Input 
                  id="thursday" 
                  type="number"
                  value={timesheetForm.thursday}
                  onChange={(e) => setTimesheetForm({...timesheetForm, thursday: Number(e.target.value)})}
                  min="0"
                  max="24"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="friday">Friday (Hours)</Label>
                <Input 
                  id="friday" 
                  type="number"
                  value={timesheetForm.friday}
                  onChange={(e) => setTimesheetForm({...timesheetForm, friday: Number(e.target.value)})}
                  min="0"
                  max="24"
                />
              </div>
              <div>
                <Label htmlFor="saturday">Saturday (Hours)</Label>
                <Input 
                  id="saturday" 
                  type="number"
                  value={timesheetForm.saturday}
                  onChange={(e) => setTimesheetForm({...timesheetForm, saturday: Number(e.target.value)})}
                  min="0"
                  max="24"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="sunday">Sunday (Hours)</Label>
              <Input 
                id="sunday" 
                type="number"
                value={timesheetForm.sunday}
                onChange={(e) => setTimesheetForm({...timesheetForm, sunday: Number(e.target.value)})}
                min="0"
                max="24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTimesheetDialog(false)}>Cancel</Button>
            <Button onClick={handleTimesheetSubmit}>Submit Timesheet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Benefits Dialog */}
      <Dialog open={showBenefitsDialog} onOpenChange={setShowBenefitsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Benefits</DialogTitle>
            <DialogDescription>
              Update your benefits enrollment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="benefitType">Benefit Type</Label>
              <Select 
                value={benefitForm.benefitType} 
                onValueChange={(value) => setBenefitForm({...benefitForm, benefitType: value})}
              >
                <SelectTrigger id="benefitType">
                  <SelectValue placeholder="Select benefit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Health Insurance">Health Insurance</SelectItem>
                  <SelectItem value="Dental Insurance">Dental Insurance</SelectItem>
                  <SelectItem value="401(k)">401(k)</SelectItem>
                  <SelectItem value="Vision Insurance">Vision Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="coverageType">Coverage Type</Label>
              <Select 
                value={benefitForm.coverageType} 
                onValueChange={(value) => setBenefitForm({...benefitForm, coverageType: value})}
              >
                <SelectTrigger id="coverageType">
                  <SelectValue placeholder="Select coverage type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                  {benefitForm.benefitType === '401(k)' && (
                    <>
                      <SelectItem value="3% contribution">3% contribution</SelectItem>
                      <SelectItem value="6% contribution">6% contribution</SelectItem>
                      <SelectItem value="10% contribution">10% contribution</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBenefitsDialog(false)}>Cancel</Button>
            <Button onClick={handleBenefitsUpdate}>Enroll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default EmployeeDashboard;
