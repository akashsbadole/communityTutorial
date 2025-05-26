"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Wallet, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface PaymentSelectorProps {
  amount: number;
  currency?: string;
  courseTitle: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export default function PaymentSelector({
  amount,
  currency = "USD",
  courseTitle,
  onPaymentSuccess,
  onPaymentError,
}: PaymentSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"select" | "processing" | "success">("select");

  const paymentMethods = [
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay securely with your PayPal account",
      icon: <Wallet className="h-6 w-6" />,
      available: true,
      fees: "2.9% + $0.30",
    },
    {
      id: "razorpay",
      name: "Razorpay",
      description: "Credit/Debit Cards, UPI, Net Banking",
      icon: <CreditCard className="h-6 w-6" />,
      available: true,
      fees: "2% + GST",
      badge: "Popular in India",
    },
    {
      id: "stripe",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard, American Express",
      icon: <CreditCard className="h-6 w-6" />,
      available: false,
      fees: "2.9% + $0.30",
      badge: "Coming Soon",
    },
  ];

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const calculateTotal = () => {
    const baseAmount = amount;
    let fees = 0;
    
    if (selectedMethod === "paypal") {
      fees = baseAmount * 0.029 + 0.30;
    } else if (selectedMethod === "razorpay") {
      fees = baseAmount * 0.02;
    }
    
    return {
      baseAmount,
      fees: Math.round(fees * 100) / 100,
      total: Math.round((baseAmount + fees) * 100) / 100,
    };
  };

  const processPayment = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    setPaymentStep("processing");

    try {
      const { total } = calculateTotal();

      if (selectedMethod === "paypal") {
        await processPayPalPayment(total);
      } else if (selectedMethod === "razorpay") {
        await processRazorpayPayment(total);
      }
    } catch (error) {
      console.error("Payment error:", error);
      onPaymentError(error instanceof Error ? error.message : "Payment failed");
      setPaymentStep("select");
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayPalPayment = async (amount: number) => {
    // Simulate PayPal payment process
    console.log("Processing PayPal payment for:", amount);
    
    // In a real implementation, you would:
    // 1. Create PayPal order via your backend
    // 2. Redirect to PayPal or open PayPal popup
    // 3. Handle PayPal callback
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const paymentData = {
      paymentId: `paypal_${Date.now()}`,
      method: "paypal",
      amount,
      currency,
      status: "completed",
      transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
    };

    setPaymentStep("success");
    setTimeout(() => {
      onPaymentSuccess(paymentData);
    }, 1500);
  };

  const processRazorpayPayment = async (amount: number) => {
    // Simulate Razorpay payment process
    console.log("Processing Razorpay payment for:", amount);
    
    // In a real implementation, you would:
    // 1. Create Razorpay order via your backend
    // 2. Open Razorpay checkout
    // 3. Handle Razorpay callback
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const paymentData = {
      paymentId: `razorpay_${Date.now()}`,
      method: "razorpay",
      amount,
      currency: "INR",
      status: "completed",
      transactionId: `rzp_${Math.random().toString(36).substr(2, 9)}`,
    };

    setPaymentStep("success");
    setTimeout(() => {
      onPaymentSuccess(paymentData);
    }, 1500);
  };

  if (paymentStep === "processing") {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <h3 className="text-lg font-semibold">Processing Payment</h3>
            <p className="text-gray-600">
              Please wait while we process your payment securely...
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <Shield className="h-4 w-4 inline mr-1" />
                Your payment is secured with industry-standard encryption
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paymentStep === "success") {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">Payment Successful!</h3>
            <p className="text-gray-600">
              Your enrollment for <strong>{courseTitle}</strong> has been confirmed.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your dashboard...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { baseAmount, fees, total } = calculateTotal();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Course Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Course: {courseTitle}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Course Fee:</span>
              <span>${baseAmount}</span>
            </div>
            {selectedMethod && fees > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Processing Fee:</span>
                <span>${fees}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>${selectedMethod ? total : baseAmount}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h4 className="font-medium mb-4">Select Payment Method</h4>
          <RadioGroup value={selectedMethod} onValueChange={handlePaymentMethodSelect}>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="relative">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedMethod === method.id
                        ? "border-blue-500 bg-blue-50"
                        : method.available
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-gray-100 bg-gray-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={method.id}
                        id={method.id}
                        disabled={!method.available}
                      />
                      <Label
                        htmlFor={method.id}
                        className={`flex-1 cursor-pointer ${
                          !method.available ? "text-gray-400" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={method.available ? "text-gray-700" : "text-gray-400"}>
                              {method.icon}
                            </div>
                            <div>
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-gray-600">{method.description}</div>
                              <div className="text-xs text-gray-500">Fees: {method.fees}</div>
                            </div>
                          </div>
                          {method.badge && (
                            <Badge
                              variant={method.available ? "secondary" : "outline"}
                              className="text-xs"
                            >
                              {method.badge}
                            </Badge>
                          )}
                        </div>
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-green-800">Secure Payment</p>
              <p className="text-green-700">
                All payments are processed securely using industry-standard encryption.
                Your financial information is never stored on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={processPayment}
          disabled={!selectedMethod || isProcessing}
          className="w-full py-3 text-lg"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${selectedMethod ? `$${total}` : `$${baseAmount}`}`
          )}
        </Button>

        {!selectedMethod && (
          <p className="text-center text-sm text-gray-500">
            Please select a payment method to continue
          </p>
        )}
      </CardContent>
    </Card>
  );
}
