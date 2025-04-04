import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Key, 
  Mail, 
  Phone, 
  Shield, 
  Save,
  File, 
  Upload,
  Download,
  MapPin,
  Calendar,
  Briefcase,
  User,
  Building
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  bio: string;
  department: string;
  position: string;
  joinDate: string;
  documents: DocumentItem[];
}

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

const mockDocuments: DocumentItem[] = [
  { id: '1', name: 'Employment Contract.pdf', type: 'PDF', uploadDate: '2024-01-15', size: '1.2 MB' },
  { id: '2', name: 'ID Document.jpg', type: 'Image', uploadDate: '2024-01-15', size: '850 KB' },
  { id: '3', name: 'Tax Information.pdf', type: 'PDF', uploadDate: '2024-02-10', size: '980 KB' },
];

const ProfilePage = () => {
  const location = useLocation();
  const userRole = location.pathname.split('/')[1]; // Extracting role from URL
  const { toast } = useToast();
  
  const getInitialProfile = (): UserProfile => {
    switch(userRole) {
      case 'admin':
        return {
          id: 'A001',
          name: 'Admin User',
          email: 'admin@prms.com',
          role: 'admin',
          phone: '+1 (555) 123-4567',
          address: '123 Admin St, City, State 12345',
          bio: 'System administrator with full access privileges.',
          department: 'IT',
          position: 'System Administrator',
          joinDate: '2022-01-01',
          documents: mockDocuments,
        };
      case 'hr':
        return {
          id: 'HR002',
          name: 'HR Manager',
          email: 'hr@prms.com',
          role: 'hr',
          phone: '+1 (555) 234-5678',
          address: '456 HR Ave, City, State 12345',
          bio: 'Human resources manager responsible for employee management and payroll.',
          department: 'Human Resources',
          position: 'HR Manager',
          joinDate: '2022-03-15',
          documents: mockDocuments,
        };
      default:
        return {
          id: 'EMP003',
          name: 'Employee User',
          email: 'employee@prms.com',
          role: 'employee',
          phone: '+1 (555) 345-6789',
          address: '789 Employee Blvd, City, State 12345',
          bio: 'Regular employee with standard access privileges.',
          department: 'Engineering',
          position: 'Software Developer',
          joinDate: '2023-06-01',
          documents: mockDocuments,
        };
    }
  };

  const [profile, setProfile] = useState<UserProfile>(getInitialProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    setProfile(getInitialProfile());
    setEditedProfile(getInitialProfile());
  }, [userRole]);

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleUploadDocument = () => {
    toast({
      title: "Document Upload",
      description: "This feature would connect to a file storage service like Cloudinary.",
    });
  };

  const handleProfileImageUpload = () => {
    toast({
      title: "Profile Image Upload",
      description: "This feature would connect to a file storage service like Cloudinary.",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin':
        return 'bg-blue-600';
      case 'hr':
        return 'bg-purple-600';
      default:
        return 'bg-green-600';
    }
  };

  return (
    <AppLayout allowedRoles={['admin', 'hr', 'employee']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your personal information and account settings
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <Card className="border-accent/20 shadow-sm">
            <CardHeader className="pb-0 text-center">
              <div className="flex justify-center mb-4 relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">{profile.name.split(' ').map(name => name[0]).join('')}</AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="absolute bottom-0 right-20 rounded-full w-8 h-8"
                  onClick={handleProfileImageUpload}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              <div className="flex justify-center mt-1">
                <Badge className={getRoleBadgeColor(profile.role)}>{profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.position}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined: {new Date(profile.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="w-full">
                {userRole === 'admin' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Full System Access</span>
                  </div>
                )}
                <Button className="w-full" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Tabs defaultValue="personalInfo" className="space-y-4">
            <TabsList>
              <TabsTrigger value="personalInfo">Personal Information</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personalInfo">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    {isEditing ? "Edit your personal details below" : "Your personal details and contact information"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <Input 
                            id="name" 
                            value={editedProfile.name} 
                            onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/50">{profile.name}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        {isEditing ? (
                          <Input 
                            id="email" 
                            value={editedProfile.email}
                            onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/50">{profile.email}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        {isEditing ? (
                          <Input 
                            id="phone" 
                            value={editedProfile.phone}
                            onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/50">{profile.phone}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        {isEditing ? (
                          <Select 
                            value={editedProfile.department}
                            onValueChange={(value) => setEditedProfile({...editedProfile, department: value})}
                          >
                            <SelectTrigger id="department">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Human Resources">Human Resources</SelectItem>
                              <SelectItem value="Engineering">Engineering</SelectItem>
                              <SelectItem value="IT">IT</SelectItem>
                              <SelectItem value="Marketing">Marketing</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/50">{profile.department}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        {isEditing ? (
                          <Input 
                            id="position" 
                            value={editedProfile.position}
                            onChange={(e) => setEditedProfile({...editedProfile, position: e.target.value})}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/50">{profile.position}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="joinDate">Join Date</Label>
                        <div className="p-2 border rounded-md bg-muted/50">
                          {new Date(profile.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <Textarea 
                          id="address" 
                          rows={2}
                          value={editedProfile.address}
                          onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/50">{profile.address}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      {isEditing ? (
                        <Textarea 
                          id="bio" 
                          rows={3}
                          value={editedProfile.bio}
                          onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                        />
                      ) : (
                        <div className="p-2 border rounded-md bg-muted/50">{profile.bio}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
                {isEditing && (
                  <CardFooter className="border-t">
                    <Button className="ml-auto" onClick={handleSaveProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Manage your personal documents and files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" onClick={handleUploadDocument}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Document
                    </Button>
                    
                    <div className="border rounded-md">
                      {profile.documents.map((doc) => (
                        <div key={doc.id} className="p-4 border-b last:border-0 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <File className="h-8 w-8 text-blue-500" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <div className="flex gap-3 text-sm text-muted-foreground">
                                <span>{doc.type}</span>
                                <span>{doc.size}</span>
                                <span>Uploaded: {doc.uploadDate}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your security preferences and account access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Change your password to ensure account security
                      </p>
                      <Button variant="outline">
                        <Key className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline">
                        <Shield className="mr-2 h-4 w-4" />
                        Enable Two-Factor Authentication
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
