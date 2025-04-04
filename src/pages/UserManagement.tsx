
import React, { useState, useEffect } from 'react';
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
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Edit, Trash2, UserPlus, Eye } from 'lucide-react';
import { useRealTimeDataContext } from '@/providers/RealTimeDataProvider';

// Extended user interface with employee ID
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  employeeId?: string;
}

const UserManagement = () => {
  // Mock user data - will be replaced with real data when connected to backend
  const initialUsers = [
    { 
      id: 1, 
      name: "John Smith", 
      email: "john@example.com", 
      role: "admin", 
      department: "Executive", 
      status: "active",
      employeeId: "1"
    },
    { 
      id: 2, 
      name: "Emily Johnson", 
      email: "emily@example.com", 
      role: "hr", 
      department: "Human Resources", 
      status: "active",
      employeeId: "2" 
    },
    { 
      id: 3, 
      name: "Michael Brown", 
      email: "michael@example.com", 
      role: "employee", 
      department: "Engineering", 
      status: "inactive",
      employeeId: "3"
    },
    { 
      id: 4, 
      name: "Sarah Davis", 
      email: "sarah@example.com", 
      role: "employee", 
      department: "Marketing", 
      status: "active" 
    },
    { 
      id: 5, 
      name: "David Wilson", 
      email: "david@example.com", 
      role: "hr", 
      department: "Human Resources", 
      status: "active" 
    },
  ];

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'employee',
    department: '',
    status: 'active',
    employeeId: ''
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();
  const { employees } = useRealTimeDataContext();

  // Sync users with employee data when available
  useEffect(() => {
    if (employees && employees.length > 0) {
      // Update existing users with employee data
      const updatedUsers = [...users];
      
      employees.forEach(employee => {
        const existingUserIndex = users.findIndex(user => 
          user.employeeId === employee.id || 
          user.email === employee.email
        );
        
        if (existingUserIndex !== -1) {
          updatedUsers[existingUserIndex] = {
            ...updatedUsers[existingUserIndex],
            name: employee.name,
            email: employee.email,
            department: employee.department,
            status: employee.status.toLowerCase(),
            employeeId: employee.id
          };
        }
      });
      
      setUsers(updatedUsers);
    }
  }, [employees]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    setUsers([...users, { id, ...newUser }]);
    setNewUser({
      name: '',
      email: '',
      role: 'employee',
      department: '',
      status: 'active',
      employeeId: ''
    });
    setIsAddUserOpen(false);
    
    toast({
      title: "User Added",
      description: `${newUser.name} has been successfully added as ${newUser.role}`,
    });
  };

  const handleEditUser = () => {
    if (!currentUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? currentUser : user
    );
    
    setUsers(updatedUsers);
    setIsEditUserOpen(false);
    
    toast({
      title: "User Updated",
      description: `${currentUser.name}'s information has been updated`,
    });
  };

  const handleDeleteUser = (id: number) => {
    const userToDelete = users.find(u => u.id === id);
    setUsers(users.filter(user => user.id !== id));
    
    toast({
      title: "User Deleted",
      description: `${userToDelete?.name} has been removed from the system`,
    });
  };

  const openEditUser = (user: User) => {
    setCurrentUser({...user});
    setIsEditUserOpen(true);
  };

  const openViewUser = (user: User) => {
    setCurrentUser({...user});
    setIsViewUserOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-blue-600">Admin</Badge>;
      case 'hr':
        return <Badge className="bg-purple-600">HR</Badge>;
      case 'employee':
        return <Badge variant="secondary">Employee</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <AppLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts, roles and permissions
            </p>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with appropriate role and department
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name">Full Name</label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="John Smith"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="role">Role</label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="department">Department</label>
                  <Input
                    id="department"
                    value={newUser.department}
                    onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                    placeholder="Human Resources"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="status">Status</label>
                  <Select value={newUser.status} onValueChange={(value) => setNewUser({...newUser, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>All Users</CardTitle>
            <CardDescription>Showing {filteredUsers.length} users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center py-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openViewUser(user)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Modify user account details
              </DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-name">Full Name</label>
                  <Input
                    id="edit-name"
                    value={currentUser.name}
                    onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-email">Email</label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={currentUser.email}
                    onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-role">Role</label>
                  <Select 
                    value={currentUser.role} 
                    onValueChange={(value) => setCurrentUser({...currentUser, role: value})}
                  >
                    <SelectTrigger id="edit-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-department">Department</label>
                  <Input
                    id="edit-department"
                    value={currentUser.department}
                    onChange={(e) => setCurrentUser({...currentUser, department: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-status">Status</label>
                  <Select 
                    value={currentUser.status} 
                    onValueChange={(value) => setCurrentUser({...currentUser, status: value})}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
              <Button onClick={handleEditUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View User Dialog */}
        <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                View detailed information about this user
              </DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-muted-foreground">Full Name</h3>
                    <p className="font-medium">{currentUser.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Email</h3>
                    <p className="font-medium">{currentUser.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Role</h3>
                    <div className="pt-1">{getRoleBadge(currentUser.role)}</div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Status</h3>
                    <div className="pt-1">{getStatusBadge(currentUser.status)}</div>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">Department</h3>
                    <p className="font-medium">{currentUser.department}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">User ID</h3>
                    <p className="font-medium">#{currentUser.id}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewUserOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default UserManagement;
