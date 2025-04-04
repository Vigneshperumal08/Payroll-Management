
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRealTimeDataContext } from '@/providers/RealTimeDataProvider';
import { toast } from 'sonner';

export type LeaveRequestFormProps = {
  employeeId: string;
  employeeName: string;
  onSuccess?: () => void;
};

export const LeaveRequestForm = ({ employeeId, employeeName, onSuccess }: LeaveRequestFormProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [leaveType, setLeaveType] = useState<string>('Sick Leave');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { submitLeaveRequest } = useRealTimeDataContext();

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    
    if (!leaveType) {
      toast.error("Please select a leave type");
      return;
    }
    
    if (!reason.trim()) {
      toast.error("Please provide a reason for your leave request");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await submitLeaveRequest({
        employeeId,
        employeeName,
        type: leaveType,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        reason,
        status: 'Pending'
      });
      
      if (success) {
        toast.success("Leave request submitted successfully");
        setReason('');
        setLeaveType('Sick Leave');
        if (onSuccess) onSuccess();
      } else {
        toast.error("Failed to submit leave request");
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      toast.error("Failed to submit leave request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="leave-type">Leave Type</Label>
          <Select 
            value={leaveType} 
            onValueChange={setLeaveType}
          >
            <SelectTrigger id="leave-type">
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sick Leave">Sick Leave</SelectItem>
              <SelectItem value="Vacation">Vacation</SelectItem>
              <SelectItem value="Personal Leave">Personal Leave</SelectItem>
              <SelectItem value="Bereavement">Bereavement</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => startDate && date < startDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please provide details for your leave request"
          rows={4}
          className="resize-none"
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6"
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </div>
  );
};
