
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Download, CalendarClock, CalendarDays, Clock } from 'lucide-react';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { LeaveRequestForm } from '@/components/leave/LeaveRequestForm';

const EmployeeAttendance = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { leaveRequests } = useRealTimeData();
  
  const filterLeavesByStatus = (status: string) => {
    return leaveRequests.filter(leave => leave.status === status);
  };

  // Mock current user - in a real app, get from auth context
  const currentUser = {
    id: 'current-user',
    name: 'John Doe'
  };

  return (
    <AppLayout allowedRoles={['employee']}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Attendance & Leave Management</h1>
        </div>

        <Tabs defaultValue="leave" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="leave" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Leave Requests
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Attendance Log
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Time Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="leave" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Leave</CardTitle>
                <CardDescription>Submit a new leave request</CardDescription>
              </CardHeader>
              <CardContent>
                <LeaveRequestForm 
                  employeeId={currentUser.id} 
                  employeeName={currentUser.name} 
                />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Pending
                      <span className="text-lg bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full">
                        {filterLeavesByStatus('Pending').length}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
                    {filterLeavesByStatus('Pending').length > 0 ? (
                      filterLeavesByStatus('Pending').map((leave) => (
                        <div key={leave.id} className="border rounded-lg p-3 bg-card hover:shadow-md transition-all">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{leave.type}</h4>
                              <p className="text-sm text-muted-foreground">
                                {leave.startDate} to {leave.endDate}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              Pending
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm truncate">{leave.reason}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">No pending requests</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Approved
                      <span className="text-lg bg-green-100 text-green-800 py-1 px-3 rounded-full">
                        {filterLeavesByStatus('Approved').length}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
                    {filterLeavesByStatus('Approved').length > 0 ? (
                      filterLeavesByStatus('Approved').map((leave) => (
                        <div key={leave.id} className="border rounded-lg p-3 bg-card hover:shadow-md transition-all">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{leave.type}</h4>
                              <p className="text-sm text-muted-foreground">
                                {leave.startDate} to {leave.endDate}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              Approved
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm truncate">{leave.reason}</p>
                          {leave.approverName && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Approved by: {leave.approverName}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">No approved requests</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Rejected
                      <span className="text-lg bg-red-100 text-red-800 py-1 px-3 rounded-full">
                        {filterLeavesByStatus('Rejected').length}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
                    {filterLeavesByStatus('Rejected').length > 0 ? (
                      filterLeavesByStatus('Rejected').map((leave) => (
                        <div key={leave.id} className="border rounded-lg p-3 bg-card hover:shadow-md transition-all">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{leave.type}</h4>
                              <p className="text-sm text-muted-foreground">
                                {leave.startDate} to {leave.endDate}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                              Rejected
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm truncate">{leave.reason}</p>
                          {leave.approverName && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Rejected by: {leave.approverName}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">No rejected requests</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Calendar</CardTitle>
                <CardDescription>View your attendance record for the month</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border mx-auto pointer-events-auto"
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="flex gap-2">
                  <Download className="h-4 w-4" /> Download Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="time">
            <Card>
              <CardHeader>
                <CardTitle>Time Management</CardTitle>
                <CardDescription>Track your working hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-8">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Today's Hours</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">8h 15m</div>
                        <p className="text-xs text-muted-foreground">Clock In: 9:00 AM</p>
                        <p className="text-xs text-muted-foreground">Expected Clock Out: 5:15 PM</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">32h 45m</div>
                        <p className="text-xs text-muted-foreground">Target: 40h 00m</p>
                        <p className="text-xs text-muted-foreground">Remaining: 7h 15m</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="flex-1">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">142h 30m</div>
                        <p className="text-xs text-muted-foreground">Target: 160h 00m</p>
                        <p className="text-xs text-muted-foreground">Remaining: 17h 30m</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {[
                        { date: '2025-04-03', clockIn: '09:00 AM', clockOut: '05:15 PM', total: '8h 15m' },
                        { date: '2025-04-02', clockIn: '08:55 AM', clockOut: '05:00 PM', total: '8h 05m' },
                        { date: '2025-04-01', clockIn: '09:10 AM', clockOut: '05:25 PM', total: '8h 15m' },
                        { date: '2025-03-31', clockIn: '08:50 AM', clockOut: '05:05 PM', total: '8h 15m' },
                        { date: '2025-03-30', clockIn: '09:05 AM', clockOut: '05:15 PM', total: '8h 10m' },
                      ].map((day, i) => (
                        <div key={i} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md">
                          <div>
                            <p className="font-medium">{day.date}</p>
                            <div className="flex gap-3 text-sm text-muted-foreground">
                              <span>In: {day.clockIn}</span>
                              <span>Out: {day.clockOut}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{day.total}</p>
                            <p className="text-xs text-muted-foreground">Regular hours</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
};

export default EmployeeAttendance;
