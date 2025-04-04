
import React, { createContext, useContext, ReactNode } from 'react';
import { useRealTimeData, Employee, LeaveRequest, Timesheet, PayrollData, BenefitsData, DocumentInfo } from '@/hooks/useRealTimeData';

interface RealTimeDataContextType {
  isConnected: boolean;
  lastUpdated: Date | null;
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  timesheets: Timesheet[];
  payrolls: PayrollData[];
  benefits: BenefitsData[];
  documents: DocumentInfo[];
  connectToDatabase: (userRole: string) => Promise<(() => void) | undefined>;
  addEmployee: (employeeData: Partial<Employee>) => Promise<Employee>;
  updateEmployee: (id: string, employeeData: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  submitLeaveRequest: (leaveData: Partial<LeaveRequest>) => Promise<boolean>;
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected' | 'Pending', approverName?: string) => Promise<boolean>;
  submitTimesheet: (timesheetData: Partial<Timesheet>) => Promise<boolean>;
  processBatchPayroll: () => Promise<number>;
  addDocument: (documentData: Partial<DocumentInfo>) => Promise<boolean>;
  updateBenefits: (employeeId: string, benefitData: Partial<BenefitsData>) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const RealTimeDataContext = createContext<RealTimeDataContextType | undefined>(undefined);

export const RealTimeDataProvider = ({ children }: { children: ReactNode }) => {
  const realTimeData = useRealTimeData();

  return (
    <RealTimeDataContext.Provider value={realTimeData}>
      {children}
    </RealTimeDataContext.Provider>
  );
};

export const useRealTimeDataContext = () => {
  const context = useContext(RealTimeDataContext);
  if (context === undefined) {
    throw new Error('useRealTimeDataContext must be used within a RealTimeDataProvider');
  }
  return context;
};
