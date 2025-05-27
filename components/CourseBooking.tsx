"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  ShoppingCart,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Receipt,
  Star,
  Clock,
  Users,
  Award,
  Tag,
  DollarSign,
  IndianRupee,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  instructor_name: string;
  price: number;
  price_usd?: number;
  price_inr?: number;
  currency_primary?: string;
  currency_supported?: string[];
  duration: string;
  level: string;
  description: string;
  rating?: number;
  students?: number;
}

interface CourseBookingProps {
  course: Course;
  onBookingComplete?: (orderData: any) => void;
}

export default function CourseBooking({
  course,
  onBookingComplete,
}: CourseBookingProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingStep, setBookingStep] = useState<
    "details" | "payment" | "success"
  >("details");
  const [orderData, setOrderData] = useState<any>(null);

  // Form state
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [discountCode, setDiscountCode] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(
    course.currency_primary || "USD"
  );
  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  // Pricing calculations with currency support
  const getCurrentPrice = () => {
    if (selectedCurrency === "USD" && course.price_usd) {
      return course.price_usd;
    } else if (selectedCurrency === "INR" && course.price_inr) {
      return course.price_inr;
    }
    return course.price; // fallback to default price
  };

  const basePrice = getCurrentPrice();
  const discountAmount =
    discountCode === "SAVE10"
      ? basePrice * 0.1
      : discountCode === "SAVE20"
      ? basePrice * 0.2
      : 0;
  const discountedPrice = basePrice - discountAmount;
  const taxAmount = discountedPrice * 0.08; // 8% tax
  const totalAmount = discountedPrice + taxAmount;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!billingAddress.fullName || !billingAddress.email) {
      toast.error("Please fill in all required billing information");
      return;
    }

    if (
      paymentMethod === "card" &&
      (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv)
    ) {
      toast.error("Please fill in all card details");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/courses/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course.id,
          paymentMethod,
          billingAddress,
          discountCode: discountCode || null,
          cardDetails: paymentMethod === "card" ? cardDetails : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderData(data);
        setBookingStep("success");
        toast.success("Course booking completed successfully!");

        if (onBookingComplete) {
          onBookingComplete(data);
        }
      } else {
        toast.error(data.error || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (amount: number, currency: string = selectedCurrency) => {
    const locale = currency === "INR" ? "en-IN" : "en-US";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case "USD":
        return DollarSign;
      case "INR":
        return IndianRupee;
      default:
        return DollarSign;
    }
  };

  if (bookingStep === "success" && orderData) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-600">
            Booking Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your course enrollment is now active. You can start learning
              immediately!
            </AlertDescription>
          </Alert>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Order Number:</span>
                <span className="font-mono">{orderData.order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Course:</span>
                <span>{orderData.order.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-semibold">
                  {formatPrice(orderData.order.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment ID:</span>
                <span className="font-mono text-xs">
                  {orderData.order.paymentId}
                </span>
              </div>
            </div>
          </div>

          {/* Receipt */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-800">Receipt</span>
            </div>
            <p className="text-sm text-blue-700">
              Receipt #{orderData.order.receiptNumber} has been generated. You
              can download it from your student dashboard.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => (window.location.href = "/student/dashboard")}
              className="flex-1"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => setBookingStep("details")}
              className="flex-1"
            >
              Book Another Course
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Course Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Course Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{course.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>Instructor: {course.instructor_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Duration: {course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-500" />
              <span>Level: {course.level}</span>
            </div>
            {course.rating && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>
                  {course.rating}/5 ({course.students || 0} students)
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Currency Selection */}
          {course.currency_supported &&
            course.currency_supported.length > 1 && (
              <div className="space-y-2">
                <Label>Currency</Label>
                <div className="flex gap-2">
                  {course.currency_supported.map((currency) => {
                    const CurrencyIcon = getCurrencyIcon(currency);
                    return (
                      <Button
                        key={currency}
                        type="button"
                        variant={
                          selectedCurrency === currency ? "default" : "outline"
                        }
                        onClick={() => setSelectedCurrency(currency)}
                        className="flex items-center gap-2"
                        size="sm"
                      >
                        <CurrencyIcon className="h-4 w-4" />
                        {currency}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Pricing Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Course Price:</span>
              <span>{formatPrice(basePrice)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discountCode}):</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>

          {/* Discount Code */}
          <div className="space-y-2">
            <Label htmlFor="discount">Discount Code</Label>
            <div className="flex gap-2">
              <Input
                id="discount"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              />
              <Button variant="outline" size="sm">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            {discountCode && (
              <p className="text-xs text-gray-500">
                Try: SAVE10 (10% off) or SAVE20 (20% off)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            {/* Billing Address */}
            <div className="space-y-3">
              <h4 className="font-semibold">Billing Information</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    required
                    value={billingAddress.fullName}
                    onChange={(e) =>
                      setBillingAddress((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={billingAddress.email}
                    onChange={(e) =>
                      setBillingAddress((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={billingAddress.address}
                  onChange={(e) =>
                    setBillingAddress((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={billingAddress.city}
                    onChange={(e) =>
                      setBillingAddress((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={billingAddress.state}
                    onChange={(e) =>
                      setBillingAddress((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={billingAddress.zipCode}
                    onChange={(e) =>
                      setBillingAddress((prev) => ({
                        ...prev,
                        zipCode: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Method */}
            <div className="space-y-3">
              <h4 className="font-semibold">Payment Method</h4>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                  className="justify-start"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit Card
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === "paypal" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("paypal")}
                  className="justify-start"
                >
                  PayPal
                </Button>
                {selectedCurrency === "INR" && (
                  <Button
                    type="button"
                    variant={paymentMethod === "upi" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("upi")}
                    className="justify-start"
                  >
                    <IndianRupee className="h-4 w-4 mr-2" />
                    UPI
                  </Button>
                )}
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) =>
                        setCardDetails((prev) => ({
                          ...prev,
                          cardNumber: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(e) =>
                          setCardDetails((prev) => ({
                            ...prev,
                            expiryDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails((prev) => ({
                            ...prev,
                            cvv: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">
                      UPI Payment
                    </h5>
                    <p className="text-sm text-blue-700 mb-3">
                      You will be redirected to your UPI app to complete the
                      payment.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <IndianRupee className="h-4 w-4" />
                      <span>Supported: PhonePe, Google Pay, Paytm, BHIM</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">
                      PayPal Payment
                    </h5>
                    <p className="text-sm text-blue-700">
                      You will be redirected to PayPal to complete your payment
                      securely.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Your payment information is encrypted and secure. We use
                industry-standard security measures.
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing}
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Complete Purchase - {formatPrice(totalAmount)}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
