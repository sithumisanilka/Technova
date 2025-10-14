import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";

export const Cart = () => {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 fade-in">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground text-lg">
              Looks like you haven't added any laptops to your cart yet.
            </p>
          </div>

          <Button size="lg" asChild>
            <Link to="/products">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="card-gradient border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full md:w-32 h-32 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-muted-foreground text-sm">
                        Product Image
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">
                              <Link
                                to={`/products/${item.product.productId}`}
                                className="hover:text-primary transition-colors"
                              >
                                {item.product.name}
                              </Link>
                            </h3>
                            <Badge variant="outline" className="mt-1">
                              {item.product.brand}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeItem(item.product.productId.toString())
                            }
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-muted-foreground">
                            Quantity:
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.product.quantity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            ${(item.price * item.quantity).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${item.price} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="card-gradient border-0 sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>${total.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-success">
                      {total >= 999 ? "FREE" : "$29.99"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(total * 0.08).toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>
                      $
                      {(
                        total +
                        (total >= 999 ? 0 : 29.99) +
                        total * 0.08
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <Button size="lg" className="w-full" asChild>
                    <Link to="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>

                {total < 999 && (
                  <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                    <p className="text-sm text-accent-foreground">
                      💡 Add ${(999 - total).toFixed(2)} more to get{" "}
                      <strong>FREE shipping</strong>!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
