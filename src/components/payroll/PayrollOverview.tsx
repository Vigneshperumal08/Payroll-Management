
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PayrollSummary {
  totalGrossSalary: number;
  totalNetSalary: number;
  totalTaxes: number;
  totalDeductions: number;
  totalEmployeeCount: number;
  totalProcessedCount: number;
  period: string;
  status: "draft" | "processing" | "completed";
}

interface PayrollOverviewProps {
  summary: PayrollSummary;
}

export function PayrollOverview({ summary }: PayrollOverviewProps) {
  const {
    totalGrossSalary,
    totalNetSalary,
    totalTaxes,
    totalDeductions,
    totalEmployeeCount,
    totalProcessedCount,
    period,
    status,
  } = summary;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const progressPercentage = (totalProcessedCount / totalEmployeeCount) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payroll Overview</CardTitle>
            <CardDescription>Period: {period}</CardDescription>
          </div>
          <div className={cn("px-3 py-1 rounded-full text-xs font-medium", getStatusColor(status))}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Gross Salary</p>
            <p className="text-2xl font-bold">{formatCurrency(totalGrossSalary)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Net Salary</p>
            <p className="text-2xl font-bold">{formatCurrency(totalNetSalary)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Taxes</p>
            <p className="text-2xl font-bold">{formatCurrency(totalTaxes)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Deductions</p>
            <p className="text-2xl font-bold">{formatCurrency(totalDeductions)}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Processing Status</p>
            <p className="text-sm font-medium">{totalProcessedCount}/{totalEmployeeCount} employees</p>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
