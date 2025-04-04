
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, FileText, Calendar, Download, Plus } from 'lucide-react';
import { useRealTimeDataContext } from '@/providers/RealTimeDataProvider';

const PayrollManagement = () => {
  const { payrolls, processBatchPayroll } = useRealTimeDataContext();
  const [selectedPeriod, setSelectedPeriod] = useState("April 2025");
  const [isGeneratingPayroll, setIsGeneratingPayroll] = useState(false);
  const { toast } = useToast();

  const handleGeneratePayroll = async () => {
    setIsGeneratingPayroll(true);
    try {
      const processedCount = await processBatchPayroll();
      setIsGeneratingPayroll(false);
    } catch (error) {
      console.error('Error processing payroll:', error);
      setIsGeneratingPayroll(false);
      toast({
        title: "Processing Error",
        description: "An error occurred while processing the payroll",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPayslip = (employeeId: string) => {
    toast({
      title: "Payslip Downloaded",
      description: `Payslip for ${employeeId} has been downloaded.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge className="bg-green-500">Processed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout allowedRoles={['hr', 'admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payroll Management</h1>
          <p className="text-muted-foreground">
            Process payrolls, generate payslips, and manage employee compensation
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <Card className="w-full md:w-3/4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payroll Overview</CardTitle>
                <CardDescription>
                  Current period: {selectedPeriod}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select 
                  value={selectedPeriod} 
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="April 2025">April 2025</SelectItem>
                    <SelectItem value="March 2025">March 2025</SelectItem>
                    <SelectItem value="February 2025">February 2025</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleGeneratePayroll} disabled={isGeneratingPayroll}>
                  {isGeneratingPayroll ? "Processing..." : "Generate Payroll"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="processed">Processed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Employee Name</TableHead>
                          <TableHead>Basic Salary</TableHead>
                          <TableHead>Deductions</TableHead>
                          <TableHead>Bonuses</TableHead>
                          <TableHead>Net Salary</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payrolls.length > 0 ? payrolls.map((payroll) => (
                          <TableRow key={payroll.id}>
                            <TableCell>{payroll.employeeId}</TableCell>
                            <TableCell>{payroll.employeeName}</TableCell>
                            <TableCell>${payroll.basicSalary.toLocaleString()}</TableCell>
                            <TableCell>${payroll.deductions.toLocaleString()}</TableCell>
                            <TableCell>${payroll.bonuses.toLocaleString()}</TableCell>
                            <TableCell className="font-medium">${payroll.netSalary.toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDownloadPayslip(payroll.employeeId)}
                                disabled={payroll.status === "pending"}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Payslip
                              </Button>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">No payroll records found.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="pending">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Employee Name</TableHead>
                          <TableHead>Basic Salary</TableHead>
                          <TableHead>Deductions</TableHead>
                          <TableHead>Bonuses</TableHead>
                          <TableHead>Net Salary</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payrolls.filter(p => p.status === "pending").length > 0 ? 
                          payrolls.filter(p => p.status === "pending").map((payroll) => (
                            <TableRow key={payroll.id}>
                              <TableCell>{payroll.employeeId}</TableCell>
                              <TableCell>{payroll.employeeName}</TableCell>
                              <TableCell>${payroll.basicSalary.toLocaleString()}</TableCell>
                              <TableCell>${payroll.deductions.toLocaleString()}</TableCell>
                              <TableCell>${payroll.bonuses.toLocaleString()}</TableCell>
                              <TableCell className="font-medium">${payroll.netSalary.toLocaleString()}</TableCell>
                              <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                            </TableRow>
                          )) : (
                            <TableRow>
                              <TableCell colSpan={7} className="h-24 text-center">No pending payroll records.</TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="processed">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Employee Name</TableHead>
                          <TableHead>Basic Salary</TableHead>
                          <TableHead>Deductions</TableHead>
                          <TableHead>Bonuses</TableHead>
                          <TableHead>Net Salary</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payrolls.filter(p => p.status === "processed").length > 0 ? 
                          payrolls.filter(p => p.status === "processed").map((payroll) => (
                            <TableRow key={payroll.id}>
                              <TableCell>{payroll.employeeId}</TableCell>
                              <TableCell>{payroll.employeeName}</TableCell>
                              <TableCell>${payroll.basicSalary.toLocaleString()}</TableCell>
                              <TableCell>${payroll.deductions.toLocaleString()}</TableCell>
                              <TableCell>${payroll.bonuses.toLocaleString()}</TableCell>
                              <TableCell className="font-medium">${payroll.netSalary.toLocaleString()}</TableCell>
                              <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleDownloadPayslip(payroll.employeeId)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Payslip
                                </Button>
                              </TableCell>
                            </TableRow>
                          )) : (
                            <TableRow>
                              <TableCell colSpan={8} className="h-24 text-center">No processed payroll records.</TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="w-full md:w-1/4">
            <CardHeader>
              <CardTitle>Payroll Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-4 bg-muted/50 rounded-lg">
                <DollarSign className="h-8 w-8 mr-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Payroll</p>
                  <p className="text-2xl font-bold">
                    ${payrolls.reduce((sum, curr) => sum + curr.netSalary, 0).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-muted/50 rounded-lg">
                <FileText className="h-8 w-8 mr-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Payslips</p>
                  <p className="text-2xl font-bold">{payrolls.length}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-muted/50 rounded-lg">
                <Calendar className="h-8 w-8 mr-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Next Payroll Date</p>
                  <p className="text-2xl font-bold">May 1, 2025</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download All Payslips
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default PayrollManagement;
