
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, Download, Filter, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

// Mock report data
const payrollSummaryData = [
  { id: 1, month: "January 2025", totalGross: 320000, totalDeductions: 86400, totalNet: 233600, employeeCount: 48 },
  { id: 2, month: "February 2025", totalGross: 325000, totalDeductions: 87750, totalNet: 237250, employeeCount: 50 },
  { id: 3, month: "March 2025", totalGross: 332000, totalDeductions: 89640, totalNet: 242360, employeeCount: 52 },
];

const employeePayStubs = [
  { id: 1, period: "April 2025", grossSalary: 5000, deductions: 1350, netSalary: 3650, issueDate: "2025-04-30" },
  { id: 2, period: "March 2025", grossSalary: 5000, deductions: 1350, netSalary: 3650, issueDate: "2025-03-31" },
  { id: 3, period: "February 2025", grossSalary: 4800, deductions: 1296, netSalary: 3504, issueDate: "2025-02-28" },
  { id: 4, period: "January 2025", grossSalary: 4800, deductions: 1296, netSalary: 3504, issueDate: "2025-01-31" },
];

const taxReports = [
  { id: 1, name: "Q1 2025 Tax Report", description: "January - March 2025 tax summary", date: "2025-04-15", type: "Quarterly" },
  { id: 2, name: "Q4 2024 Tax Report", description: "October - December 2024 tax summary", date: "2025-01-15", type: "Quarterly" },
  { id: 3, name: "2024 Annual Tax Report", description: "Full year 2024 tax summary", date: "2025-02-28", type: "Annual" },
];

const Reports = () => {
  const [reportType, setReportType] = useState('payroll');
  const [reportPeriod, setReportPeriod] = useState('2025-Q1');
  const { toast } = useToast();
  const location = useLocation();
  const userRole = location.pathname.split('/')[1]; // Extracting role from URL

  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "Report Downloaded",
      description: `${reportName} has been downloaded successfully.`,
    });
  };

  const handleDownloadPayStub = (period: string) => {
    toast({
      title: "Pay Stub Downloaded",
      description: `Pay stub for ${period} has been downloaded.`,
    });
  };

  return (
    <AppLayout allowedRoles={['admin', 'hr', 'employee']}>
      <div className="space-y-6">
        <div>
          {userRole === 'employee' ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight">My Pay Stubs</h1>
              <p className="text-muted-foreground">
                Access and download your pay stubs and tax documents
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                Generate and view payroll, tax, and employee reports
              </p>
            </>
          )}
        </div>

        {userRole === 'employee' ? (
          <Card>
            <CardHeader>
              <CardTitle>Pay Stubs</CardTitle>
              <CardDescription>Your historical pay statements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Gross Salary</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeePayStubs.map((payStub) => (
                      <TableRow key={payStub.id}>
                        <TableCell>{payStub.period}</TableCell>
                        <TableCell>${payStub.grossSalary.toLocaleString()}</TableCell>
                        <TableCell>${payStub.deductions.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">${payStub.netSalary.toLocaleString()}</TableCell>
                        <TableCell>{payStub.issueDate}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPayStub(payStub.period)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div></div>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="w-full md:w-1/3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Report Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={reportType} 
                    onValueChange={setReportType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payroll">Payroll Summary</SelectItem>
                      <SelectItem value="tax">Tax Reports</SelectItem>
                      <SelectItem value="attendance">Attendance Reports</SelectItem>
                      <SelectItem value="benefits">Benefits Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              
              <Card className="w-full md:w-1/3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Report Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={reportPeriod} 
                    onValueChange={setReportPeriod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-Q1">2025 - Q1</SelectItem>
                      <SelectItem value="2024-Q4">2024 - Q4</SelectItem>
                      <SelectItem value="2024-Q3">2024 - Q3</SelectItem>
                      <SelectItem value="2024-Q2">2024 - Q2</SelectItem>
                      <SelectItem value="2024">Year 2024</SelectItem>
                      <SelectItem value="2023">Year 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              
              <Card className="w-full md:w-1/3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Report Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
            
            <Button className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            
            <Separator />
            
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Available Reports</h2>
              
              <Tabs defaultValue="payroll" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="payroll">Payroll</TabsTrigger>
                  <TabsTrigger value="tax">Tax</TabsTrigger>
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="payroll">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payroll Summary Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Period</TableHead>
                              <TableHead>Total Gross</TableHead>
                              <TableHead>Total Deductions</TableHead>
                              <TableHead>Total Net</TableHead>
                              <TableHead>Employee Count</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {payrollSummaryData.map((report) => (
                              <TableRow key={report.id}>
                                <TableCell>{report.month}</TableCell>
                                <TableCell>${report.totalGross.toLocaleString()}</TableCell>
                                <TableCell>${report.totalDeductions.toLocaleString()}</TableCell>
                                <TableCell>${report.totalNet.toLocaleString()}</TableCell>
                                <TableCell>{report.employeeCount}</TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDownloadReport(`Payroll Summary - ${report.month}`)}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="tax">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tax Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Report Name</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {taxReports.map((report) => (
                              <TableRow key={report.id}>
                                <TableCell className="font-medium">{report.name}</TableCell>
                                <TableCell>{report.description}</TableCell>
                                <TableCell>{report.date}</TableCell>
                                <TableCell>{report.type}</TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDownloadReport(report.name)}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="attendance">
                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center h-40 text-center">
                        <div className="space-y-2">
                          <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                          <h3 className="text-lg font-medium">No attendance reports available</h3>
                          <p className="text-sm text-muted-foreground">
                            Generate a new attendance report by selecting options above.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Reports;
