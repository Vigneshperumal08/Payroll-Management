
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Download, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadCSV, downloadJSON } from '@/utils/downloadUtils';

const TaxCalculator = () => {
  const [salaryInfo, setSalaryInfo] = useState({
    grossIncome: '',
    taxFilingStatus: 'single',
    allowances: '',
    state: 'california',
  });

  const [taxResults, setTaxResults] = useState<{
    federalTax: number;
    stateTax: number;
    medicareTax: number;
    socialSecurityTax: number;
    totalTax: number;
    netIncome: number;
  } | null>(null);

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setSalaryInfo({
      ...salaryInfo,
      [field]: value,
    });
  };

  const calculateTaxes = () => {
    const grossIncome = parseFloat(salaryInfo.grossIncome);
    if (isNaN(grossIncome) || grossIncome <= 0) return;

    // This is a simplified tax calculation for demonstration
    // In a real application, these would follow actual tax brackets and rules
    const federalTax = grossIncome * 0.22;  // Simplified federal tax rate
    
    // Different state tax rates based on selection (simplified)
    let stateTaxRate = 0.06;  // Default
    if (salaryInfo.state === 'california') stateTaxRate = 0.093;
    if (salaryInfo.state === 'texas') stateTaxRate = 0;
    if (salaryInfo.state === 'new_york') stateTaxRate = 0.068;
    
    const stateTax = grossIncome * stateTaxRate;
    const medicareTax = grossIncome * 0.0145;
    const socialSecurityTax = Math.min(grossIncome * 0.062, 8853.60); // 2023 limit
    
    const totalTax = federalTax + stateTax + medicareTax + socialSecurityTax;
    const netIncome = grossIncome - totalTax;
    
    setTaxResults({
      federalTax,
      stateTax,
      medicareTax,
      socialSecurityTax,
      totalTax,
      netIncome,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleDownload = (format: 'csv' | 'json') => {
    if (!taxResults) return;
    
    const employeeName = 'Employee'; // In a real app, this would be dynamic
    const calculationDate = new Date().toISOString().split('T')[0];
    
    const data = [
      {
        employeeName,
        calculationDate,
        grossIncome: parseFloat(salaryInfo.grossIncome),
        federalTax: taxResults.federalTax,
        stateTax: taxResults.stateTax,
        medicareTax: taxResults.medicareTax,
        socialSecurityTax: taxResults.socialSecurityTax,
        totalTax: taxResults.totalTax,
        netIncome: taxResults.netIncome,
        taxFilingStatus: salaryInfo.taxFilingStatus,
        state: salaryInfo.state
      }
    ];
    
    if (format === 'csv') {
      downloadCSV(data, `tax-calculation-${calculationDate}`);
    } else {
      downloadJSON(data, `tax-calculation-${calculationDate}`);
    }
    
    toast({
      title: "Download Complete",
      description: `Tax calculation has been downloaded as a ${format.toUpperCase()} file.`,
    });
  };

  return (
    <AppLayout allowedRoles={['hr', 'admin', 'employee']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tax Calculator</h1>
          <p className="text-muted-foreground">
            Calculate estimated taxes and take-home pay for employees
          </p>
        </div>
        
        <Tabs defaultValue="calculator" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="batch">Batch Processing</TabsTrigger>
            <TabsTrigger value="history">Calculation History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Salary Information</CardTitle>
                  <CardDescription>
                    Enter employee's salary details to calculate taxes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="grossIncome">Annual Gross Income</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="grossIncome"
                          type="number"
                          placeholder="60000"
                          className="pl-7"
                          value={salaryInfo.grossIncome}
                          onChange={(e) => handleInputChange('grossIncome', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="taxFilingStatus">Tax Filing Status</Label>
                      <Select
                        value={salaryInfo.taxFilingStatus}
                        onValueChange={(value) => handleInputChange('taxFilingStatus', value)}
                      >
                        <SelectTrigger id="taxFilingStatus">
                          <SelectValue placeholder="Select filing status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married_joint">Married Filing Jointly</SelectItem>
                          <SelectItem value="married_separate">Married Filing Separately</SelectItem>
                          <SelectItem value="head_household">Head of Household</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="allowances">Allowances/Exemptions</Label>
                      <Input
                        id="allowances"
                        type="number"
                        placeholder="0"
                        value={salaryInfo.allowances}
                        onChange={(e) => handleInputChange('allowances', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={salaryInfo.state}
                        onValueChange={(value) => handleInputChange('state', value)}
                      >
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="california">California</SelectItem>
                          <SelectItem value="new_york">New York</SelectItem>
                          <SelectItem value="texas">Texas</SelectItem>
                          <SelectItem value="florida">Florida</SelectItem>
                          <SelectItem value="illinois">Illinois</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      type="button" 
                      className="w-full mt-4" 
                      onClick={calculateTaxes}
                      disabled={!salaryInfo.grossIncome}
                    >
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculate Taxes
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tax Calculation Results</CardTitle>
                  <CardDescription>
                    Estimated tax breakdown and net income
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {taxResults ? (
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Federal Income Tax</p>
                          <p className="text-2xl font-semibold">{formatCurrency(taxResults.federalTax)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">State Income Tax</p>
                          <p className="text-2xl font-semibold">{formatCurrency(taxResults.stateTax)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Medicare</p>
                          <p className="text-2xl font-semibold">{formatCurrency(taxResults.medicareTax)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Social Security</p>
                          <p className="text-2xl font-semibold">{formatCurrency(taxResults.socialSecurityTax)}</p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">Gross Income</p>
                          <p className="font-semibold">{formatCurrency(parseFloat(salaryInfo.grossIncome))}</p>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm font-medium">Total Tax</p>
                          <p className="font-semibold text-red-500">{formatCurrency(taxResults.totalTax)}</p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <p className="text-base font-bold">Net Income (Annual)</p>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(taxResults.netIncome)}</p>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-muted-foreground">Monthly Take-home</p>
                          <p className="text-sm font-medium">{formatCurrency(taxResults.netIncome / 12)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[300px] flex flex-col items-center justify-center text-center">
                      <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Calculation Yet</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mt-2">
                        Fill in the salary information on the left and click "Calculate Taxes" to see the tax breakdown
                      </p>
                    </div>
                  )}
                </CardContent>
                {taxResults && (
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownload('csv')}>
                      <FileDown className="mr-2 h-4 w-4" />
                      Download CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload('json')}>
                      <FileDown className="mr-2 h-4 w-4" />
                      Download JSON
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="batch">
            <Card>
              <CardHeader>
                <CardTitle>Batch Tax Processing</CardTitle>
                <CardDescription>
                  Calculate taxes for multiple employees at once
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button variant="outline">Upload CSV</Button>
                    <Button variant="outline">Download Template</Button>
                  </div>
                  <div className="border rounded-lg p-6 text-center">
                    <p className="text-muted-foreground">
                      Upload a CSV file with employee salary information to calculate taxes for multiple employees at once.
                      You can download a template to see the required format.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Calculation History</CardTitle>
                <CardDescription>
                  View your recent tax calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-6">
                  No recent calculations found. Calculations will be shown here once you start using the calculator.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TaxCalculator;
