import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Pencil, Plus, Search, Trash2, UserPlus, Users, Eye } from 'lucide-react';
import { useRealTimeDataContext } from '@/providers/RealTimeDataProvider';
import { motion } from 'framer-motion';
import ImageUploader from '@/components/employees/ImageUploader';
import { Employee } from '@/hooks/useRealTimeData';

const EmployeeManagement = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useRealTimeDataContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    joinDate: '',
    status: 'Active',
    imageUrl: ''
  });
  
  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddEmployee = () => {
    addEmployee({
      ...newEmployee,
      status: newEmployee.status
    });
    setNewEmployee({
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      joinDate: '',
      status: 'Active',
      imageUrl: ''
    });
    setShowAddDialog(false);
  };
  
  const handleUpdateEmployee = () => {
    if (currentEmployee) {
      updateEmployee(currentEmployee.id, currentEmployee);
      setShowEditDialog(false);
    }
  };
  
  const handleDeleteEmployee = () => {
    if (currentEmployee) {
      deleteEmployee(currentEmployee.id);
      setShowDeleteDialog(false);
    }
  };
  
  const openEditDialog = (employee: Employee) => {
    setCurrentEmployee({...employee});
    setShowEditDialog(true);
  };
  
  const openDeleteDialog = (employee: Employee) => {
    setCurrentEmployee({...employee});
    setShowDeleteDialog(true);
  };

  const openViewDialog = (employee: Employee) => {
    setCurrentEmployee({...employee});
    setShowViewDialog(true);
  };

  return (
    <AppLayout allowedRoles={['admin', 'hr']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Employee Management</h1>
            <p className="text-muted-foreground">Manage employee records and information</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Enter employee details to add them to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                  <div className="mx-auto">
                    <ImageUploader 
                      onImageUpload={(url) => setNewEmployee({...newEmployee, imageUrl: url})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="joinDate">Join Date</Label>
                      <Input 
                        id="joinDate" 
                        type="date" 
                        value={newEmployee.joinDate} 
                        onChange={(e) => setNewEmployee({...newEmployee, joinDate: e.target.value})} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={newEmployee.status} 
                        onValueChange={(value) => setNewEmployee({...newEmployee, status: value})}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  <Button onClick={handleAddEmployee}>Add Employee</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Employee</DialogTitle>
                  <DialogDescription>
                    Update employee information.
                  </DialogDescription>
                </DialogHeader>
                {currentEmployee && (
                  <div className="grid grid-cols-1 gap-4 py-4">
                    <div className="mx-auto">
                      <ImageUploader 
                        onImageUpload={(url) => setCurrentEmployee({...currentEmployee, imageUrl: url})}
                        currentImage={currentEmployee.imageUrl}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-name">Full Name</Label>
                        <Input 
                          id="edit-name" 
                          value={currentEmployee.name} 
                          onChange={(e) => setCurrentEmployee({...currentEmployee, name: e.target.value})} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input 
                          id="edit-email" 
                          type="email" 
                          value={currentEmployee.email} 
                          onChange={(e) => setCurrentEmployee({...currentEmployee, email: e.target.value})} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-position">Position</Label>
                        <Input 
                          id="edit-position" 
                          value={currentEmployee.position} 
                          onChange={(e) => setCurrentEmployee({...currentEmployee, position: e.target.value})} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-department">Department</Label>
                        <Input 
                          id="edit-department" 
                          value={currentEmployee.department} 
                          onChange={(e) => setCurrentEmployee({...currentEmployee, department: e.target.value})} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <Select 
                          value={currentEmployee.status} 
                          onValueChange={(value) => setCurrentEmployee({...currentEmployee, status: value})}
                        >
                          <SelectTrigger id="edit-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="On Leave">On Leave</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                  <Button onClick={handleUpdateEmployee}>Update Employee</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Employee</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this employee? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                {currentEmployee && (
                  <div className="py-4">
                    <Alert variant="destructive">
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        You are about to delete {currentEmployee.name}. All their records will be permanently removed.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDeleteEmployee}>Delete Employee</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Employee Details</DialogTitle>
                </DialogHeader>
                {currentEmployee && (
                  <div className="py-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="mx-auto sm:mx-0">
                        {currentEmployee.imageUrl ? (
                          <img 
                            src={currentEmployee.imageUrl} 
                            alt={currentEmployee.name} 
                            className="h-24 w-24 rounded-full object-cover border-2 border-primary"
                          />
                        ) : (
                          <div className="h-24 w-24 bg-muted flex items-center justify-center rounded-full border-2 border-muted-foreground/50">
                            <Users className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-xl">{currentEmployee.name}</h3>
                          <p className="text-muted-foreground">{currentEmployee.position}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Department</p>
                            <p>{currentEmployee.department}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge
                              variant={
                                currentEmployee.status === 'Active' ? 'default' :
                                currentEmployee.status === 'On Leave' ? 'secondary' :
                                'outline'
                              }
                            >
                              {currentEmployee.status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p>{currentEmployee.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p>{currentEmployee.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button onClick={() => setShowViewDialog(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-10 max-w-md mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="grid">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            <div className="text-sm text-muted-foreground flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Total Employees: {employees.length}
            </div>
          </div>
          
          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="card-hover relative overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{employee.name}</CardTitle>
                            <CardDescription>{employee.position}</CardDescription>
                          </div>
                          <Badge
                            variant={
                              employee.status === 'Active' ? 'default' :
                              employee.status === 'On Leave' ? 'secondary' :
                              'outline'
                            }
                          >
                            {employee.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-4 mb-3">
                          {employee.imageUrl ? (
                            <img 
                              src={employee.imageUrl} 
                              alt={employee.name} 
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-muted flex items-center justify-center rounded-full">
                              <Users className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="text-muted-foreground">Department:</span> {employee.department}
                            </div>
                            {employee.email && (
                              <div>
                                <span className="text-muted-foreground">Email:</span> {employee.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => openViewDialog(employee)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => openEditDialog(employee)}
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => openDeleteDialog(employee)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No employees found matching your search criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="table" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {employee.imageUrl ? (
                                <img 
                                  src={employee.imageUrl} 
                                  alt={employee.name} 
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : null}
                              {employee.name}
                            </div>
                          </TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                employee.status === 'Active' ? 'default' :
                                employee.status === 'On Leave' ? 'secondary' :
                                'outline'
                              }
                            >
                              {employee.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openViewDialog(employee)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600"
                              onClick={() => openEditDialog(employee)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => openDeleteDialog(employee)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No employees found matching your search criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
};

export default EmployeeManagement;
