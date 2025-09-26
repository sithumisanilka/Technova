import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { orderApi } from '@/services/api';
import { CheckoutRequest, PaymentMethod } from '@/types/order';
import { ArrowLeft, CreditCard, MapPin, Package, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const checkoutSchema = z.object({
  shippingName: z.string().min(2, 'Name must be at least 2 characters'),
  shippingAddress: z.string().min(10, 'Address must be at least 10 characters'),
  shippingCity: z.string().min(2, 'City is required'),
  shippingPostalCode: z.string().min(5, 'Postal code must be at least 5 characters'),
  shippingPhone: z.string().min(10, 'Phone number must be at least 10 characters'),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: 'Please select a payment method' })
  }),
  notes: z.string().optional()
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const Checkout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
      shippingAddress: user?.address || '',
      shippingCity: user?.city || '',
      shippingPostalCode: user?.postalCode || '',
      shippingPhone: user?.phone || '',
      paymentMethod: PaymentMethod.CASH,
      notes: ''
    }
  });

  const selectedPaymentMethod = watch('paymentMethod');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, cart, navigate]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user || !cart) return;

    try {
      setIsSubmitting(true);

      const checkoutRequest: CheckoutRequest = {
        customerId: user.id,
        shippingName: data.shippingName,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingPostalCode: data.shippingPostalCode,
        shippingPhone: data.shippingPhone,
        paymentMethod: data.paymentMethod,
        notes: data.notes || undefined
      };

      const order = await orderApi.checkout(checkoutRequest);
      
      // Clear cart after successful checkout
      await clearCart();
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.orderNumber} has been placed and is being processed.`,
      });

      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const cartTotal = getCartTotal();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <a href="/cart">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </a>
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your laptop order</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Shipping Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shippingName">Full Name *</Label>
                <Input
                  id="shippingName"
                  {...register('shippingName')}
                  className={errors.shippingName ? 'border-red-500' : ''}
                />
                {errors.shippingName && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="shippingAddress">Address *</Label>
                <Input
                  id="shippingAddress"
                  {...register('shippingAddress')}
                  className={errors.shippingAddress ? 'border-red-500' : ''}
                  placeholder="Street address, building, apartment"
                />
                {errors.shippingAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shippingCity">City *</Label>
                  <Input
                    id="shippingCity"
                    {...register('shippingCity')}
                    className={errors.shippingCity ? 'border-red-500' : ''}
                  />
                  {errors.shippingCity && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingCity.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="shippingPostalCode">Postal Code *</Label>
                  <Input
                    id="shippingPostalCode"
                    {...register('shippingPostalCode')}
                    className={errors.shippingPostalCode ? 'border-red-500' : ''}
                  />
                  {errors.shippingPostalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingPostalCode.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="shippingPhone">Phone Number *</Label>
                <Input
                  id="shippingPhone"
                  {...register('shippingPhone')}
                  className={errors.shippingPhone ? 'border-red-500' : ''}
                  placeholder="+94 77 123 4567"
                />
                {errors.shippingPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingPhone.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Method</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="paymentMethod">Select Payment Method *</Label>
                  <Select
                    value={selectedPaymentMethod}
                    onValueChange={(value) => setValue('paymentMethod', value as PaymentMethod)}
                  >
                    <SelectTrigger className={errors.paymentMethod ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Choose payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PaymentMethod.CASH}>Cash on Delivery</SelectItem>
                      <SelectItem value={PaymentMethod.CREDIT_CARD}>Credit Card</SelectItem>
                      <SelectItem value={PaymentMethod.DEBIT_CARD}>Debit Card</SelectItem>
                      <SelectItem value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</SelectItem>
                      <SelectItem value={PaymentMethod.DIGITAL_WALLET}>Digital Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
                  )}
                </div>

                {selectedPaymentMethod === PaymentMethod.CASH && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Cash on Delivery:</strong> Pay with cash when your order is delivered.
                    </p>
                  </div>
                )}

                {selectedPaymentMethod === PaymentMethod.BANK_TRANSFER && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 text-sm">
                      <strong>Bank Transfer:</strong> Transfer the amount to our account and include your order number in the reference.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Order Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register('notes')}
                placeholder="Any special instructions or notes for your order..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${cart.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${cart.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};