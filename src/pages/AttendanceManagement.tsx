
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileDown, Search, Users, Filter } from 'lucide-react';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { LeaveRequestManagement } from '@/components/leave/LeaveRequestManagement';

const AttendanceManagement = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const { employees } = useRealTimeData();
  
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout allowedRoles={['admin', 'hr']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Attendance & Leave Management</h1>
          <Button variant="outline" className="flex gap-2">
            <FileDown className="h-4 w-4" /> Export Data
          </Button>
        </div>
        
        <Tabs defaultValue="leave" className="w-full">
          <TabsList>
            <TabsTrigger value="leave">Leave Requests</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="report">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leave" className="mt-4">
            <LeaveRequestManagement />
          </TabsContent>
          
          <TabsContent value="attendance">
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="w-full md:w-1/3">
                <CardHeader>
                  <CardTitle>Calendar View</CardTitle>
                  <CardDescription>Select a date to view attendance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border mx-auto pointer-events-auto"
                  />
                  
                  <div className="flex justify-center items-center space-x-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Late</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Leave</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="w-full md:w-2/3">
                <CardHeader>
                  <CardTitle>Daily Attendance</CardTitle>
                  <CardDescription>
                    {date ? format(date, 'MMMM dd, yyyy') : 'Select a date'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="border rounded-md max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Hours</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-xs text-muted-foreground">{employee.position}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${
                                  employee.id === '1' ? 'bg-green-500' :
                                  employee.id === '2' ? 'bg-yellow-500' :
                                  'bg-blue-500'
                                }`}></span>
                                {employee.id === '1' ? 'Present' :
                                 employee.id === '2' ? 'Late' : 'On Leave'}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {employee.id === '1' ? '8h 15m' :
                               employee.id === '2' ? '7h 30m' : '0h 00m'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="report">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Report</CardTitle>
                <CardDescription>
                  Detailed attendance data for {format(date || new Date(), 'MMMM yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Working Days</TableHead>
                        <TableHead>Present</TableHead>
                        <TableHead>Absent</TableHead>
                        <TableHead>Leave</TableHead>
                        <TableHead>Late</TableHead>
                        <TableHead className="text-right">Total Hours</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="font-medium">{employee.name}</div>
                          </TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>22</TableCell>
                          <TableCell>20</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>2</TableCell>
                          <TableCell>1</TableCell>
                          <TableCell className="text-right">160h 15m</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  Total Employees: {employees.length}
                </div>
                <Button variant="outline" className="flex gap-2">
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
};

export default AttendanceManagement;
