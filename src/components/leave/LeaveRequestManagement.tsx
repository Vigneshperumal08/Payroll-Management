
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRealTimeDataContext } from "@/providers/RealTimeDataProvider";
import { toast } from "sonner";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { motion } from 'framer-motion';

export type LeaveRequestManagementProps = {
  hrName?: string;
};

export const LeaveRequestManagement = ({ hrName = "HR Manager" }: LeaveRequestManagementProps) => {
  const { leaveRequests, updateLeaveStatus } = useRealTimeDataContext();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject' | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const pendingRequests = leaveRequests.filter(request => request.status === 'Pending');
  const approvedRequests = leaveRequests.filter(request => request.status === 'Approved');
  const rejectedRequests = leaveRequests.filter(request => request.status === 'Rejected');

  const handleOpenDialog = (requestId: string, action: 'approve' | 'reject') => {
    setSelectedRequest(requestId);
    setDialogAction(action);
    setResponseMessage('');
  };

  const handleCloseDialog = () => {
    setSelectedRequest(null);
    setDialogAction(null);
    setResponseMessage('');
  };

  const handleSubmitResponse = async () => {
    if (!selectedRequest || !dialogAction) return;
    
    setIsUpdating(true);
    
    try {
      const status = dialogAction === 'approve' ? 'Approved' : 'Rejected';
      const success = await updateLeaveStatus(selectedRequest, status, hrName);
      
      if (success) {
        toast.success(`Leave request ${status.toLowerCase()} successfully`);
        handleCloseDialog();
      } else {
        toast.error(`Failed to ${dialogAction} leave request`);
      }
    } catch (error) {
      console.error(`Error ${dialogAction}ing leave request:`, error);
      toast.error(`Failed to ${dialogAction} leave request`);
    } finally {
      setIsUpdating(false);
    }
  };

  const getRequestById = (id: string) => {
    return leaveRequests.find(request => request.id === id);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              Pending
              <Badge className="bg-yellow-500" variant="secondary">
                {pendingRequests.length}
              </Badge>
            </CardTitle>
            <CardDescription>Leave requests awaiting approval</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-3 bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{request.employeeName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {request.startDate} to {request.endDate}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        {request.type}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3 line-clamp-2">{request.reason}</p>
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleOpenDialog(request.id, 'reject')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleOpenDialog(request.id, 'approve')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">No pending requests</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              Approved
              <Badge className="bg-green-500" variant="secondary">
                {approvedRequests.length}
              </Badge>
            </CardTitle>
            <CardDescription>Recently approved leave requests</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            {approvedRequests.length > 0 ? (
              <div className="space-y-4">
                {approvedRequests.map((request) => (
                  <div 
                    key={request.id}
                    className="border rounded-lg p-3 bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{request.employeeName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {request.startDate} to {request.endDate}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Approved
                      </Badge>
                    </div>
                    <p className="text-sm mb-1 line-clamp-2">{request.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      Approved by {request.approverName || hrName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">No approved requests</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              Declined
              <Badge className="bg-red-500" variant="secondary">
                {rejectedRequests.length}
              </Badge>
            </CardTitle>
            <CardDescription>Recently declined leave requests</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            {rejectedRequests.length > 0 ? (
              <div className="space-y-4">
                {rejectedRequests.map((request) => (
                  <div 
                    key={request.id}
                    className="border rounded-lg p-3 bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{request.employeeName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {request.startDate} to {request.endDate}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                        Declined
                      </Badge>
                    </div>
                    <p className="text-sm mb-1 line-clamp-2">{request.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      Declined by {request.approverName || hrName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">No declined requests</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={!!selectedRequest && !!dialogAction} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'approve' ? 'Approve Leave Request' : 'Decline Leave Request'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve' 
                ? 'The employee will be notified that their request has been approved.'
                : 'Please provide a reason for declining this leave request.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="py-4">
              <div className="mb-4 p-3 bg-muted rounded-md">
                <p className="font-medium text-sm">Request Details:</p>
                <p className="text-sm">Employee: {getRequestById(selectedRequest)?.employeeName}</p>
                <p className="text-sm">Type: {getRequestById(selectedRequest)?.type}</p>
                <p className="text-sm">Dates: {getRequestById(selectedRequest)?.startDate} to {getRequestById(selectedRequest)?.endDate}</p>
                <p className="text-sm mt-2">Reason: {getRequestById(selectedRequest)?.reason}</p>
              </div>
              
              {dialogAction === 'reject' && (
                <div className="space-y-2">
                  <label htmlFor="response" className="text-sm font-medium">Response Message (Optional)</label>
                  <Textarea
                    id="response"
                    placeholder="Provide a reason for declining this request..."
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmitResponse}
              disabled={isUpdating}
              variant={dialogAction === 'approve' ? 'default' : 'destructive'}
            >
              {isUpdating 
                ? 'Processing...' 
                : dialogAction === 'approve' 
                  ? 'Approve Request' 
                  : 'Decline Request'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
