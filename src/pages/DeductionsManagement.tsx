
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Download, BadgePercent } from 'lucide-react';

interface DeductionType {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  applicableTo: 'all' | 'specific';
}

interface EmployeeDeduction {
  id: string;
  employeeId: string;
  employeeName: string;
  deductionTypeId: string;
  deductionName: string;
  amount: number;
  startDate: string;
  endDate: string | null;
  status: 'active' | 'inactive' | 'scheduled';
}

const DeductionsManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock deduction types
  const [deductionTypes, setDeductionTypes] = useState<DeductionType[]>([
    { 
      id: '1', 
      name: 'Income Tax', 
      description: 'Federal income tax deduction', 
      type: 'percentage', 
      value: 20, 
      applicableTo: 'all' 
    },
    { 
      id: '2', 
      name: 'Health Insurance', 
      description: 'Employee health insurance premium', 
      type: 'fixed', 
      value: 150, 
      applicableTo: 'all' 
    },
    { 
      id: '3', 
      name: 'Retirement Plan', 
      description: '401(k) contribution', 
      type: 'percentage', 
      value: 5, 
      applicableTo: 'all' 
    },
    { 
      id: '4', 
      name: 'Loan Repayment', 
      description: 'Employee loan repayment', 
      type: 'fixed', 
      value: 200, 
      applicableTo: 'specific' 
    },
  ]);

  // Mock employee deductions
  const [employeeDeductions, setEmployeeDeductions] = useState<EmployeeDeduction[]>([
    {
      id: '1',
      employeeId: '101',
      employeeName: 'John Smith',
      deductionTypeId: '1',
      deductionName: 'Income Tax',
      amount: 850,
      startDate: '2023-01-01',
      endDate: null,
      status: 'active'
    },
    {
      id: '2',
      employeeId: '101',
      employeeName: 'John Smith',
      deductionTypeId: '2',
      deductionName: 'Health Insurance',
      amount: 150,
      startDate: '2023-01-01',
      endDate: null,
      status: 'active'
    },
    {
      id: '3',
      employeeId: '102',
      employeeName: 'Emily Johnson',
      deductionTypeId: '1',
      deductionName: 'Income Tax',
      amount: 750,
      startDate: '2023-01-01',
      endDate: null,
      status: 'active'
    },
    {
      id: '4',
      employeeId: '102',
      employeeName: 'Emily Johnson',
      deductionTypeId: '4',
      deductionName: 'Loan Repayment',
      amount: 200,
      startDate: '2023-03-01',
      endDate: '2023-12-31',
      status: 'active'
    },
    {
      id: '5',
      employeeId: '103',
      employeeName: 'Michael Brown',
      deductionTypeId: '1',
      deductionName: 'Income Tax',
      amount: 620,
      startDate: '2023-01-01',
      endDate: null,
      status: 'active'
    },
  ]);

  // New deduction type form state
  const [newDeductionType, setNewDeductionType] = useState<Omit<DeductionType, 'id'>>({
    name: '',
    description: '',
    type: 'fixed',
    value: 0,
    applicableTo: 'all'
  });

  // New employee deduction form state
  const [newEmployeeDeduction, setNewEmployeeDeduction] = useState({
    employeeId: '',
    employeeName: '',
    deductionTypeId: '',
    amount: 0,
    startDate: '',
    endDate: '',
  });

  // Dialog open states
  const [isAddDeductionTypeOpen, setIsAddDeductionTypeOpen] = useState(false);
  const [isAddEmployeeDeductionOpen, setIsAddEmployeeDeductionOpen] = useState(false);

  // Filter employee deductions based on search query
  const filteredDeductions = employeeDeductions.filter(deduction => 
    deduction.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deduction.deductionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add new deduction type
  const handleAddDeductionType = () => {
    if (!newDeductionType.name || !newDeductionType.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newId = (deductionTypes.length + 1).toString();
    setDeductionTypes([
      ...deductionTypes, 
      { 
        id: newId, 
        ...newDeductionType 
      }
    ]);
    
    setIsAddDeductionTypeOpen(false);
    setNewDeductionType({
      name: '',
      description: '',
      type: 'fixed',
      value: 0,
      applicableTo: 'all'
    });

    toast({
      title: "Deduction Type Added",
      description: `${newDeductionType.name} has been added successfully`,
    });
  };

  // Add new employee deduction
  const handleAddEmployeeDeduction = () => {
    if (!newEmployeeDeduction.employeeId || !newEmployeeDeduction.deductionTypeId || !newEmployeeDeduction.startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const deductionType = deductionTypes.find(dt => dt.id === newEmployeeDeduction.deductionTypeId);
    if (!deductionType) return;

    // For demonstration, we're using mock data
    const employeeName = newEmployeeDeduction.employeeId === '101' 
      ? 'John Smith' 
      : newEmployeeDeduction.employeeId === '102'
      ? 'Emily Johnson'
      : 'Michael Brown';

    const newId = (employeeDeductions.length + 1).toString();
    setEmployeeDeductions([
      ...employeeDeductions,
      {
        id: newId,
        employeeId: newEmployeeDeduction.employeeId,
        employeeName: employeeName,
        deductionTypeId: newEmployeeDeduction.deductionTypeId,
        deductionName: deductionType.name,
        amount: newEmployeeDeduction.amount || deductionType.type === 'fixed' ? deductionType.value : 0,
        startDate: newEmployeeDeduction.startDate,
        endDate: newEmployeeDeduction.endDate || null,
        status: 'active'
      }
    ]);

    setIsAddEmployeeDeductionOpen(false);
    setNewEmployeeDeduction({
      employeeId: '',
      employeeName: '',
      deductionTypeId: '',
      amount: 0,
      startDate: '',
      endDate: '',
    });

    toast({
      title: "Deduction Added",
      description: `Deduction has been assigned to employee successfully`,
    });
  };

  // Download deductions report
  const downloadReport = () => {
    toast({
      title: "Report Generated",
      description: "Deductions report has been generated and is downloading",
    });
  };

  return (
    <AppLayout allowedRoles={['admin', 'hr']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Deductions Management</h1>
            <p className="text-muted-foreground">
              Manage employee deductions, taxes, and withholdings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={downloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddDeductionTypeOpen} onOpenChange={setIsAddDeductionTypeOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deduction Type
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create Deduction Type</DialogTitle>
                  <DialogDescription>
                    Add a new type of deduction that can be applied to employees.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Deduction Name</Label>
                      <Input
                        id="name"
                        value={newDeductionType.name}
                        onChange={(e) => setNewDeductionType({...newDeductionType, name: e.target.value})}
                        placeholder="e.g., Health Insurance"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newDeductionType.description}
                        onChange={(e) => setNewDeductionType({...newDeductionType, description: e.target.value})}
                        placeholder="Description of the deduction"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Deduction Type</Label>
                      <Select
                        value={newDeductionType.type}
                        onValueChange={(value: 'percentage' | 'fixed') => 
                          setNewDeductionType({...newDeductionType, type: value})
                        }
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="value">
                        {newDeductionType.type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                      </Label>
                      <Input
                        id="value"
                        type="number"
                        value={newDeductionType.value}
                        onChange={(e) => setNewDeductionType({
                          ...newDeductionType, 
                          value: parseFloat(e.target.value) || 0
                        })}
                        placeholder={newDeductionType.type === 'percentage' ? '5' : '100'}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="applicableTo">Applicable To</Label>
                    <Select
                      value={newDeductionType.applicableTo}
                      onValueChange={(value: 'all' | 'specific') => 
                        setNewDeductionType({...newDeductionType, applicableTo: value})
                      }
                    >
                      <SelectTrigger id="applicableTo">
                        <SelectValue placeholder="Select applicable employees" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        <SelectItem value="specific">Specific Employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDeductionTypeOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddDeductionType}>Create Deduction Type</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Deduction Types</CardTitle>
              <CardDescription>Available deduction categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {deductionTypes.map((type) => (
                <div key={type.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <BadgePercent className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {type.type === 'percentage' 
                        ? `${type.value}%` 
                        : `$${type.value.toFixed(2)}`
                      }
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Employee Deductions</CardTitle>
                <CardDescription>Currently applied deductions for employees</CardDescription>
              </div>
              <Dialog open={isAddEmployeeDeductionOpen} onOpenChange={setIsAddEmployeeDeductionOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Deduction
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Assign Deduction to Employee</DialogTitle>
                    <DialogDescription>
                      Apply a deduction to an employee's payroll
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="employeeId">Employee</Label>
                      <Select
                        value={newEmployeeDeduction.employeeId}
                        onValueChange={(value) => 
                          setNewEmployeeDeduction({...newEmployeeDeduction, employeeId: value})
                        }
                      >
                        <SelectTrigger id="employeeId">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="101">John Smith</SelectItem>
                          <SelectItem value="102">Emily Johnson</SelectItem>
                          <SelectItem value="103">Michael Brown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="deductionTypeId">Deduction Type</Label>
                      <Select
                        value={newEmployeeDeduction.deductionTypeId}
                        onValueChange={(value) => 
                          setNewEmployeeDeduction({...newEmployeeDeduction, deductionTypeId: value})
                        }
                      >
                        <SelectTrigger id="deductionTypeId">
                          <SelectValue placeholder="Select deduction type" />
                        </SelectTrigger>
                        <SelectContent>
                          {deductionTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name} ({type.type === 'percentage' ? `${type.value}%` : `$${type.value}`})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Override Amount (Optional)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newEmployeeDeduction.amount}
                          onChange={(e) => setNewEmployeeDeduction({
                            ...newEmployeeDeduction, 
                            amount: parseFloat(e.target.value) || 0
                          })}
                          placeholder="Leave blank to use default"
                        />
                      </div>
                      <div></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newEmployeeDeduction.startDate}
                          onChange={(e) => setNewEmployeeDeduction({
                            ...newEmployeeDeduction, 
                            startDate: e.target.value
                          })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="endDate">End Date (Optional)</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newEmployeeDeduction.endDate}
                          onChange={(e) => setNewEmployeeDeduction({
                            ...newEmployeeDeduction, 
                            endDate: e.target.value
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddEmployeeDeductionOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddEmployeeDeduction}>Assign Deduction</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="flex items-center py-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employee or deduction..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Deduction Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeductions.length > 0 ? (
                      filteredDeductions.map((deduction) => (
                        <TableRow key={deduction.id}>
                          <TableCell className="font-medium">{deduction.employeeName}</TableCell>
                          <TableCell>{deduction.deductionName}</TableCell>
                          <TableCell className="text-right">${deduction.amount.toFixed(2)}</TableCell>
                          <TableCell>{deduction.startDate}</TableCell>
                          <TableCell>{deduction.endDate || 'Ongoing'}</TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold 
                              ${deduction.status === 'active' 
                                ? 'border-green-200 bg-green-100 text-green-700' 
                                : deduction.status === 'inactive'
                                ? 'border-gray-200 bg-gray-100 text-gray-700'
                                : 'border-amber-200 bg-amber-100 text-amber-700'
                              }`}
                            >
                              {deduction.status.charAt(0).toUpperCase() + deduction.status.slice(1)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No deductions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default DeductionsManagement;
