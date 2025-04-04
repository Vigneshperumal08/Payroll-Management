
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  FileEdit, 
  Trash, 
  HeartHandshake,
  Wallet,
  User,
  Calendar
} from 'lucide-react';

// Mock benefit plans
const mockBenefitPlans = [
  { 
    id: 1, 
    name: "Standard Health Insurance", 
    type: "health", 
    provider: "Blue Cross", 
    coverage: "80% coverage, $1000 deductible", 
    monthlyCost: 250, 
    employeeContribution: 50, 
    eligibility: "Full-time employees", 
    status: "active" 
  },
  { 
    id: 2, 
    name: "Premium Health Insurance", 
    type: "health", 
    provider: "Aetna", 
    coverage: "90% coverage, $500 deductible", 
    monthlyCost: 400, 
    employeeContribution: 100, 
    eligibility: "Full-time employees (1+ year)", 
    status: "active" 
  },
  { 
    id: 3, 
    name: "Basic Dental", 
    type: "dental", 
    provider: "Delta Dental", 
    coverage: "Cleanings, basic procedures", 
    monthlyCost: 30, 
    employeeContribution: 15, 
    eligibility: "All employees", 
    status: "active" 
  },
  { 
    id: 4, 
    name: "Vision Care", 
    type: "vision", 
    provider: "VSP", 
    coverage: "Annual eye exam, $150 for glasses/contacts", 
    monthlyCost: 20, 
    employeeContribution: 10, 
    eligibility: "All employees", 
    status: "active" 
  },
  { 
    id: 5, 
    name: "401(k) Retirement", 
    type: "retirement", 
    provider: "Fidelity", 
    coverage: "5% employer match", 
    monthlyCost: 0, 
    employeeContribution: 0, 
    eligibility: "Full-time employees (3+ months)", 
    status: "active" 
  }
];

// Mock employee enrollments
const mockEnrollments = [
  { 
    id: 1, 
    employeeId: 101, 
    employeeName: "John Smith", 
    planId: 1, 
    planName: "Standard Health Insurance", 
    coverageLevel: "Family", 
    startDate: "2023-01-15", 
    monthlyDeduction: 50, 
    status: "active" 
  },
  { 
    id: 2, 
    employeeId: 101, 
    employeeName: "John Smith", 
    planId: 3, 
    planName: "Basic Dental", 
    coverageLevel: "Family", 
    startDate: "2023-01-15", 
    monthlyDeduction: 15, 
    status: "active" 
  },
  { 
    id: 3, 
    employeeId: 102, 
    employeeName: "Emily Johnson", 
    planId: 2, 
    planName: "Premium Health Insurance", 
    coverageLevel: "Individual", 
    startDate: "2022-05-10", 
    monthlyDeduction: 100, 
    status: "active" 
  },
  { 
    id: 4, 
    employeeId: 102, 
    employeeName: "Emily Johnson", 
    planId: 4, 
    planName: "Vision Care", 
    coverageLevel: "Individual", 
    startDate: "2022-05-10", 
    monthlyDeduction: 10, 
    status: "active" 
  },
  { 
    id: 5, 
    employeeId: 103, 
    employeeName: "Michael Brown", 
    planId: 1, 
    planName: "Standard Health Insurance", 
    coverageLevel: "Individual", 
    startDate: "2023-03-01", 
    monthlyDeduction: 50, 
    status: "pending" 
  }
];

const BenefitsManagement = () => {
  const [benefitPlans, setBenefitPlans] = useState(mockBenefitPlans);
  const [enrollments, setEnrollments] = useState(mockEnrollments);
  const [searchQuery, setSearchQuery] = useState('');
  const [newBenefitPlan, setNewBenefitPlan] = useState({
    name: '',
    type: 'health',
    provider: '',
    coverage: '',
    monthlyCost: '',
    employeeContribution: '',
    eligibility: '',
    status: 'active'
  });
  const { toast } = useToast();

  const filteredPlans = benefitPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    plan.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddBenefitPlan = () => {
    if (!newBenefitPlan.name || !newBenefitPlan.provider) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const id = benefitPlans.length > 0 ? Math.max(...benefitPlans.map(p => p.id)) + 1 : 1;
    setBenefitPlans([...benefitPlans, { 
      id, 
      ...newBenefitPlan,
      monthlyCost: parseFloat(newBenefitPlan.monthlyCost as string) || 0,
      employeeContribution: parseFloat(newBenefitPlan.employeeContribution as string) || 0
    }]);
    
    toast({
      title: "Benefit Plan Added",
      description: `${newBenefitPlan.name} has been successfully added`,
    });
  };

  const handleDeletePlan = (id: number) => {
    const planToDelete = benefitPlans.find(p => p.id === id);
    setBenefitPlans(benefitPlans.filter(plan => plan.id !== id));
    
    toast({
      title: "Benefit Plan Deleted",
      description: `${planToDelete?.name} has been removed from the system`,
    });
  };

  const handleApproveEnrollment = (id: number) => {
    setEnrollments(enrollments.map(enrollment => 
      enrollment.id === id ? { ...enrollment, status: 'active' } : enrollment
    ));
    
    toast({
      title: "Enrollment Approved",
      description: `The enrollment request has been approved`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBenefitTypeIcon = (type: string) => {
    switch (type) {
      case 'health':
        return <HeartHandshake className="h-4 w-4 text-red-500" />;
      case 'dental':
        return <HeartHandshake className="h-4 w-4 text-blue-500" />;
      case 'vision':
        return <HeartHandshake className="h-4 w-4 text-green-500" />;
      case 'retirement':
        return <Wallet className="h-4 w-4 text-purple-500" />;
      default:
        return <HeartHandshake className="h-4 w-4" />;
    }
  };

  return (
    <AppLayout allowedRoles={['hr', 'admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Benefits Management</h1>
          <p className="text-muted-foreground">
            Manage employee benefits, plans and enrollments
          </p>
        </div>
        
        <Tabs defaultValue="plans" className="space-y-4">
          <TabsList>
            <TabsTrigger value="plans">Benefit Plans</TabsTrigger>
            <TabsTrigger value="enrollments">Employee Enrollments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search benefit plans..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Benefit Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Benefit Plan</DialogTitle>
                    <DialogDescription>
                      Create a new benefit plan that employees can enroll in
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name">Plan Name</label>
                        <Input
                          id="name"
                          value={newBenefitPlan.name}
                          onChange={(e) => setNewBenefitPlan({...newBenefitPlan, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="type">Type</label>
                        <select
                          id="type"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          value={newBenefitPlan.type}
                          onChange={(e) => setNewBenefitPlan({...newBenefitPlan, type: e.target.value})}
                        >
                          <option value="health">Health Insurance</option>
                          <option value="dental">Dental Insurance</option>
                          <option value="vision">Vision Insurance</option>
                          <option value="retirement">Retirement</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="provider">Provider</label>
                      <Input
                        id="provider"
                        value={newBenefitPlan.provider}
                        onChange={(e) => setNewBenefitPlan({...newBenefitPlan, provider: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="coverage">Coverage Details</label>
                      <Input
                        id="coverage"
                        value={newBenefitPlan.coverage}
                        onChange={(e) => setNewBenefitPlan({...newBenefitPlan, coverage: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="monthlyCost">Monthly Cost</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            id="monthlyCost"
                            type="number"
                            className="pl-7"
                            value={newBenefitPlan.monthlyCost}
                            onChange={(e) => setNewBenefitPlan({...newBenefitPlan, monthlyCost: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="employeeContribution">Employee Contribution</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            id="employeeContribution"
                            type="number"
                            className="pl-7"
                            value={newBenefitPlan.employeeContribution}
                            onChange={(e) => setNewBenefitPlan({...newBenefitPlan, employeeContribution: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="eligibility">Eligibility</label>
                      <Input
                        id="eligibility"
                        value={newBenefitPlan.eligibility}
                        onChange={(e) => setNewBenefitPlan({...newBenefitPlan, eligibility: e.target.value})}
                        placeholder="e.g., Full-time employees"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddBenefitPlan}>Add Plan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Monthly Cost</TableHead>
                    <TableHead>Employee Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.length > 0 ? (
                    filteredPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getBenefitTypeIcon(plan.type)}
                            <span className="ml-2 capitalize">{plan.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{plan.provider}</TableCell>
                        <TableCell>{formatCurrency(plan.monthlyCost)}</TableCell>
                        <TableCell>{formatCurrency(plan.employeeContribution)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeletePlan(plan.id)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No benefit plans found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="enrollments" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Summary</CardTitle>
                  <CardDescription>Current enrollment statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                      <User className="h-8 w-8 text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">42</div>
                      <div className="text-sm text-muted-foreground">Enrolled Employees</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
                      <HeartHandshake className="h-8 w-8 text-green-500 mb-2" />
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-sm text-muted-foreground">Active Plans</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg">
                      <Calendar className="h-8 w-8 text-purple-500 mb-2" />
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-muted-foreground">Pending Enrollments</div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg">
                      <Wallet className="h-8 w-8 text-amber-500 mb-2" />
                      <div className="text-2xl font-bold">$8,750</div>
                      <div className="text-sm text-muted-foreground">Monthly Cost</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                  <CardDescription>Enrollment requests that need approval</CardDescription>
                </CardHeader>
                <CardContent>
                  {enrollments.filter(e => e.status === 'pending').length > 0 ? (
                    <div className="space-y-4">
                      {enrollments
                        .filter(e => e.status === 'pending')
                        .map(enrollment => (
                          <div 
                            key={enrollment.id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border"
                          >
                            <div>
                              <div className="font-medium">{enrollment.employeeName}</div>
                              <div className="text-sm text-muted-foreground">{enrollment.planName}</div>
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => handleApproveEnrollment(enrollment.id)}
                            >
                              Approve
                            </Button>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[140px] text-center">
                      <p className="text-muted-foreground">No pending enrollment requests</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Employee Enrollments</CardTitle>
                <CardDescription>Current benefit enrollments for all employees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Benefit Plan</TableHead>
                        <TableHead>Coverage</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Monthly Deduction</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell className="font-medium">{enrollment.employeeName}</TableCell>
                          <TableCell>{enrollment.planName}</TableCell>
                          <TableCell>{enrollment.coverageLevel}</TableCell>
                          <TableCell>{enrollment.startDate}</TableCell>
                          <TableCell>{formatCurrency(enrollment.monthlyDeduction)}</TableCell>
                          <TableCell>
                            {enrollment.status === 'active' ? (
                              <Badge className="bg-green-500">Active</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Reports</CardTitle>
                  <CardDescription>Monthly benefit costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-6">
                    <Button variant="outline">Generate Report</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Reports</CardTitle>
                  <CardDescription>Employee enrollment statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-6">
                    <Button variant="outline">Generate Report</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Plan Utilization</CardTitle>
                  <CardDescription>Benefit plan usage reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-6">
                    <Button variant="outline">Generate Report</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default BenefitsManagement;
