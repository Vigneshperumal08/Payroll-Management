
import { useState, useEffect, useCallback } from 'react';
import MongoDbService from '../services/mongoDbService';
import CloudinaryService from '../services/cloudinaryService';
import { toast } from 'sonner';

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: string;
  joinDate: string;
  imageUrl: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Approved' | 'Rejected' | 'Pending';
  approverName?: string;
  type: string;
}

export interface Timesheet {
  id: string;
  employeeId: string;
  date: string;
  hoursWorked: number;
  status: string;
  week?: string;
  days?: {
    monday: { status: 'approved' | 'pending' | 'none'; hours: number };
    tuesday: { status: 'approved' | 'pending' | 'none'; hours: number };
    wednesday: { status: 'approved' | 'pending' | 'none'; hours: number };
    thursday: { status: 'approved' | 'pending' | 'none'; hours: number };
    friday: { status: 'approved' | 'pending' | 'none'; hours: number };
    saturday: { status: 'approved' | 'pending' | 'none'; hours: number };
    sunday: { status: 'approved' | 'pending' | 'none'; hours: number };
  };
  totalHours?: number;
}

export interface PayrollData {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  amount: number;
  status: string;
  basicSalary: number;
  deductions: number;
  bonuses: number;
  netSalary: number;
}

export interface BenefitsData {
  id?: string;
  employeeId: string;
  healthInsurance: boolean;
  retirement: boolean;
  paidTimeOff: number;
  benefit?: string;
  coverage?: string;
  status?: string;
  cost?: string;
}

export interface DocumentInfo {
  id: string;
  employeeId: string;
  name: string;
  type: string;
  uploadDate: string;
  url: string;
}

class DatabaseConnection {
  data: {
    employees: Employee[];
    leaveRequests: LeaveRequest[];
    timesheets: Timesheet[];
    payrolls: PayrollData[];
    benefits: BenefitsData[];
    documents: DocumentInfo[];
  };

  listeners: (() => void)[];

  constructor() {
    this.listeners = [];
    this.data = {
      employees: [
        {
          id: 'emp-001',
          name: 'John Doe',
          position: 'Software Engineer',
          department: 'Engineering',
          email: 'john.doe@example.com',
          phone: '(123) 456-7890',
          status: 'Active',
          joinDate: '2023-01-15',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 'emp-002',
          name: 'Jane Smith',
          position: 'HR Manager',
          department: 'Human Resources',
          email: 'jane.smith@example.com',
          phone: '(234) 567-8901',
          status: 'Active',
          joinDate: '2022-05-10',
          imageUrl: '/placeholder.svg'
        },
        {
          id: 'emp-003',
          name: 'David Johnson',
          position: 'Financial Analyst',
          department: 'Finance',
          email: 'david.johnson@example.com',
          phone: '(345) 678-9012',
          status: 'On Leave',
          joinDate: '2022-08-22',
          imageUrl: '/placeholder.svg'
        }
      ],
      leaveRequests: [],
      timesheets: [],
      payrolls: [],
      benefits: [],
      documents: []
    };
  }

  addEmployee(employee: Partial<Employee>): Promise<Employee> {
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      name: employee.name || '',
      position: employee.position || '',
      department: employee.department || '',
      email: employee.email || '',
      phone: employee.phone || '',
      status: employee.status || 'Active',
      joinDate: employee.joinDate || new Date().toISOString().split('T')[0],
      imageUrl: employee.imageUrl || '/placeholder.svg'
    };
    
    this.data.employees.push(newEmployee);
    this.notifyListeners();
    return Promise.resolve(newEmployee);
  }

  submitLeaveRequest(leaveData: Partial<LeaveRequest>): Promise<boolean> {
    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: leaveData.employeeId || '',
      employeeName: leaveData.employeeName || '',
      startDate: leaveData.startDate || '',
      endDate: leaveData.endDate || '',
      reason: leaveData.reason || '',
      status: 'Pending',
      type: leaveData.type || 'Personal Leave'
    };
    
    this.data.leaveRequests.push(newLeave);
    this.notifyListeners();
    return Promise.resolve(true);
  }

  updateLeaveStatus(id: string, status: 'Approved' | 'Rejected' | 'Pending', approverName?: string): Promise<boolean> {
    const leaveRequest = this.data.leaveRequests.find(leave => leave.id === id);
    if (leaveRequest) {
      leaveRequest.status = status;
      if (approverName) {
        leaveRequest.approverName = approverName;
      }
      this.notifyListeners();
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  submitTimesheet(timesheetData: Partial<Timesheet>): Promise<boolean> {
    const newTimesheet: Timesheet = {
      id: `timesheet-${Date.now()}`,
      employeeId: timesheetData.employeeId || '',
      date: timesheetData.date || new Date().toISOString().split('T')[0],
      hoursWorked: timesheetData.hoursWorked || 0,
      status: timesheetData.status || 'Pending',
      week: timesheetData.week,
      days: timesheetData.days,
      totalHours: timesheetData.totalHours
    };
    
    this.data.timesheets.push(newTimesheet);
    this.notifyListeners();
    return Promise.resolve(true);
  }

  updateBenefits(employeeId: string, benefitData: Partial<BenefitsData>): Promise<boolean> {
    const newBenefit: BenefitsData = {
      id: `benefit-${Date.now()}`,
      employeeId: employeeId,
      healthInsurance: benefitData.healthInsurance || false,
      retirement: benefitData.retirement || false,
      paidTimeOff: benefitData.paidTimeOff || 0,
      benefit: benefitData.benefit,
      coverage: benefitData.coverage,
      status: benefitData.status,
      cost: benefitData.cost
    };
    
    this.data.benefits.push(newBenefit);
    this.notifyListeners();
    return Promise.resolve(true);
  }

  processBatchPayroll(): Promise<number> {
    const count = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < count; i++) {
      const basicSalary = Math.floor(Math.random() * 5000) + 3000;
      const deductions = Math.floor(basicSalary * 0.2);
      const bonuses = Math.floor(Math.random() * 1000);
      const netSalary = basicSalary - deductions + bonuses;
      
      this.data.payrolls.push({
        id: `payroll-${Date.now()}-${i}`,
        employeeId: `emp-00${i + 1}`,
        employeeName: `Employee ${i + 1}`,
        period: 'April 2025',
        amount: netSalary,
        status: Math.random() > 0.3 ? 'processed' : 'pending',
        basicSalary,
        deductions,
        bonuses,
        netSalary
      });
    }
    
    this.notifyListeners();
    return Promise.resolve(count);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

const dbConnection = new DatabaseConnection();

export const useRealTimeData = () => {
  const [data, setData] = useState<{
    employees: Employee[];
    leaveRequests: LeaveRequest[];
    timesheets: Timesheet[];
    payrolls: PayrollData[];
    benefits: BenefitsData[];
    documents: DocumentInfo[];
  } | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const connectToDatabase = useCallback(async (userRole: string) => {
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      // Configure Cloudinary
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
      
      if (cloudName && apiKey && cloudName !== 'your_cloudinary_cloud_name') {
        CloudinaryService.configure({
          cloudName,
          apiKey,
        });
      }
      
      // Connect to MongoDB
      const mongoUri = import.meta.env.VITE_MONGODB_URI;
      
      if (!mongoUri || mongoUri === 'your_mongodb_atlas_connection_string') {
        throw new Error('MongoDB URI not provided or invalid');
      }
      
      const success = await MongoDbService.connect({
        uri: mongoUri,
        dbName: 'prms',
        userRole
      });
      
      if (!success) {
        throw new Error('Failed to connect to MongoDB');
      }
      
      console.log(`Connected to MongoDB as ${userRole}`);
      toast.success(`Connected to MongoDB as ${userRole}`);
      
      setData(dbConnection.data);
      setIsConnected(true);
      setLastUpdated(new Date());
      
      return () => {
        console.log('Disconnected from MongoDB');
        setIsConnected(false);
        MongoDbService.disconnect();
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to database';
      setConnectionError(errorMessage);
      console.error('Database connection error:', errorMessage);
      toast.error(`Connection error: ${errorMessage}`);
      return undefined;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setData({...dbConnection.data});
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }, [isConnected]);

  useEffect(() => {
    const listener = () => {
      if (isConnected) {
        setData(dbConnection.data);
        setLastUpdated(new Date());
      }
    };

    dbConnection.listeners.push(listener);
    return () => {
      dbConnection.listeners = dbConnection.listeners.filter(l => l !== listener);
    };
  }, [isConnected]);

  return {
    isConnected,
    lastUpdated,
    employees: data?.employees || [],
    leaveRequests: data?.leaveRequests || [],
    timesheets: data?.timesheets || [],
    payrolls: data?.payrolls || [],
    benefits: data?.benefits || [],
    documents: data?.documents || [],
    connectToDatabase,
    addEmployee: (employeeData: Partial<Employee>) => dbConnection.addEmployee(employeeData),
    updateEmployee: async (id: string, employeeData: Partial<Employee>) => {
      console.log('Updating employee:', id, employeeData);
    },
    deleteEmployee: async (id: string) => {
      console.log('Deleting employee:', id);
    },
    submitLeaveRequest: (leaveData: Partial<LeaveRequest>) => dbConnection.submitLeaveRequest(leaveData),
    updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected' | 'Pending', approverName?: string) => 
      dbConnection.updateLeaveStatus(id, status, approverName),
    submitTimesheet: (timesheetData: Partial<Timesheet>) => dbConnection.submitTimesheet(timesheetData),
    processBatchPayroll: () => dbConnection.processBatchPayroll(),
    addDocument: async (documentData: Partial<DocumentInfo>) => {
      console.log('Adding document:', documentData);
      return true;
    },
    updateBenefits: (employeeId: string, benefitData: Partial<BenefitsData>) => 
      dbConnection.updateBenefits(employeeId, benefitData),
    refreshData
  };
};
