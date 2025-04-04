
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, Phone } from "lucide-react";
import { Employee } from "@/hooks/useRealTimeData";

// Export the EmployeeData type to match what's imported in AdminDashboard and HrDashboard
export type EmployeeData = {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: string;
  imageUrl?: string;
};

export interface EmployeeCardProps {
  employee: Employee | EmployeeData;
  onEdit?: (employee: Employee | EmployeeData) => void;
  onView?: (employee: Employee | EmployeeData) => void;
}

export function EmployeeCard({ employee, onEdit, onView }: EmployeeCardProps) {
  const { name, position, department, email, phone, status, imageUrl } = employee;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'on-leave':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'terminated':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="card-hover overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar className="h-14 w-14 border">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className="text-sm text-muted-foreground">{position}</p>
            </div>
          </div>
          <Badge className={getStatusColor(status)} variant="outline">
            {status.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          <div className="mb-1">Department: {department}</div>
          <div className="flex items-center gap-1 mb-1">
            <Mail className="h-3 w-3" />
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            <span>{phone}</span>
          </div>
        </div>
        <div className="flex justify-between gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onView && onView(employee)}
          >
            View Profile
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit && onEdit(employee)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
