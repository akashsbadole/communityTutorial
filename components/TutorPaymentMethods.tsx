"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  IndianRupee,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  Plus,
  Eye,
  EyeOff,
  Shield,
  Upload,
  QrCode
} from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  payment_type: string;
  upi_id?: string;
  qr_code_url?: string;
  bank_details?: any;
  paypal_email?: string;
  status: string;
  admin_approved: boolean;
  admin_notes?: string;
  approved_by?: string;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  created_at: string;
}

interface ApprovalRequest {
  id: string;
  request_type: string;
  payment_method_data: any;
  status: string;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export default function TutorPaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    paymentType: 'upi',
    upiId: '',
    qrCodeUrl: '',
    paypalEmail: '',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      accountHolderName: ''
    }
  });

  // Fetch payment methods
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tutor/payment-methods');
      
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
        setPendingRequests(data.pendingRequests || []);
      } else {
        toast.error('Failed to fetch payment methods');
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Network error while fetching payment methods');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate based on payment type
    if (formData.paymentType === 'upi' && !formData.upiId) {
      toast.error('UPI ID is required');
      return;
    }
    
    if (formData.paymentType === 'paypal' && !formData.paypalEmail) {
      toast.error('PayPal email is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tutor/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentType: formData.paymentType,
          upiId: formData.upiId || null,
          qrCodeUrl: formData.qrCodeUrl || null,
          paypalEmail: formData.paypalEmail || null,
          bankDetails: formData.paymentType === 'bank' ? formData.bankDetails : null
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Payment method submitted for admin approval');
        setShowAddForm(false);
        setFormData({
          paymentType: 'upi',
          upiId: '',
          qrCodeUrl: '',
          paypalEmail: '',
          bankDetails: {
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            accountHolderName: ''
          }
        });
        fetchPaymentMethods(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to submit payment method');
      }
    } catch (error) {
      console.error('Error submitting payment method:', error);
      toast.error('Network error while submitting payment method');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string, adminApproved: boolean) => {
    if (status === 'approved' && adminApproved) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (status === 'rejected') {
      return <XCircle className="h-4 w-4 text-red-600" />;
    } else {
      return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string, adminApproved: boolean) => {
    if (status === 'approved' && adminApproved) {
      return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
    } else if (status === 'rejected') {
      return <Badge variant="destructive">Rejected</Badge>;
    } else {
      return <Badge variant="secondary">Pending Approval</Badge>;
    }
  };

  const formatPaymentType = (type: string) => {
    switch (type) {
      case 'upi': return 'UPI';
      case 'paypal': return 'PayPal';
      case 'bank': return 'Bank Transfer';
      default: return type.toUpperCase();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading payment methods...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Methods</h2>
          <p className="text-gray-600">Manage your payment methods for receiving course payments</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Important Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          All payment methods require admin approval before they can be used for receiving payments. 
          This ensures security and compliance with platform policies.
        </AlertDescription>
      </Alert>

      {/* Add Payment Method Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPaymentMethod} className="space-y-4">
              {/* Payment Type Selection */}
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant={formData.paymentType === 'upi' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, paymentType: 'upi' }))}
                    className="justify-start"
                  >
                    <IndianRupee className="h-4 w-4 mr-2" />
                    UPI
                  </Button>
                  <Button
                    type="button"
                    variant={formData.paymentType === 'paypal' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, paymentType: 'paypal' }))}
                    className="justify-start"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    PayPal
                  </Button>
                  <Button
                    type="button"
                    variant={formData.paymentType === 'bank' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, paymentType: 'bank' }))}
                    className="justify-start"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Bank
                  </Button>
                </div>
              </div>

              {/* UPI Form */}
              {formData.paymentType === 'upi' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="upiId">UPI ID *</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@paytm"
                      value={formData.upiId}
                      onChange={(e) => setFormData(prev => ({ ...prev, upiId: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="qrCodeUrl">QR Code URL (Optional)</Label>
                    <Input
                      id="qrCodeUrl"
                      placeholder="https://example.com/qr-code.png"
                      value={formData.qrCodeUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, qrCodeUrl: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload your UPI QR code to an image hosting service and paste the URL here
                    </p>
                  </div>
                </div>
              )}

              {/* PayPal Form */}
              {formData.paymentType === 'paypal' && (
                <div>
                  <Label htmlFor="paypalEmail">PayPal Email *</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    placeholder="your-email@example.com"
                    value={formData.paypalEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, paypalEmail: e.target.value }))}
                    required
                  />
                </div>
              )}

              {/* Bank Form */}
              {formData.paymentType === 'bank' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                    <Input
                      id="accountHolderName"
                      value={formData.bankDetails.accountHolderName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bankDetails: { ...prev.bankDetails, accountHolderName: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      value={formData.bankDetails.accountNumber}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bankDetails: { ...prev.bankDetails, accountNumber: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifscCode">IFSC Code *</Label>
                    <Input
                      id="ifscCode"
                      value={formData.bankDetails.ifscCode}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bankDetails: { ...prev.bankDetails, ifscCode: e.target.value }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      value={formData.bankDetails.bankName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        bankDetails: { ...prev.bankDetails, bankName: e.target.value }
                      }))}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit for Approval'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Approved Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Approved Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMethods.filter(method => method.admin_approved).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No approved payment methods yet</p>
          ) : (
            <div className="space-y-4">
              {paymentMethods.filter(method => method.admin_approved).map((method) => (
                <div key={method.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(method.status, method.admin_approved)}
                      <span className="font-medium">{formatPaymentType(method.payment_type)}</span>
                    </div>
                    {getStatusBadge(method.status, method.admin_approved)}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    {method.upi_id && <p>UPI ID: {method.upi_id}</p>}
                    {method.paypal_email && <p>PayPal: {method.paypal_email}</p>}
                    {method.qr_code_url && (
                      <p className="flex items-center gap-1">
                        <QrCode className="h-3 w-3" />
                        QR Code Available
                      </p>
                    )}
                    <p>Approved: {new Date(method.approved_at!).toLocaleDateString()}</p>
                    {method.admin_notes && <p>Notes: {method.admin_notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Approval Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request) => {
                const methodData = JSON.parse(request.payment_method_data);
                return (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium">{formatPaymentType(request.request_type)}</span>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      {methodData.upiId && <p>UPI ID: {methodData.upiId}</p>}
                      {methodData.paypalEmail && <p>PayPal: {methodData.paypalEmail}</p>}
                      <p>Submitted: {new Date(request.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
