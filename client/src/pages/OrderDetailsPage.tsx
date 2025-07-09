import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getOrderByKey, getOrderProducts } from "@/services/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Phone, Mail, CreditCard, Package } from "lucide-react";
import { format } from "date-fns";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import OrderCardSkeleton from "@/components/skeletons/OrderCardSkeleton";
import AddressCardSkeleton from "@/components/AddressCardSkeleton";

/* Product response
  [{
            "_id": "686e6ea7c62f165028cb4d3b",
            "product_id": 34,
            "description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>\n<p>Photography by @cottonbro.</p>\n",
            "name": "Hat",
            "meta_data": [
                {
                    "id": 222,
                    "key": "_wpcom_is_markdown",
                    "value": "1"
                }
            ],
            "sku": "woo-fasion-hat",
            "stock_status": "instock",
            "categories": [
                {
                    "id": 20,
                    "name": "Accessories",
                    "slug": "accessories"
                }
            ],
            "price": "12",
            "images": [
                {
                    "id": 33,
                    "src": "https://interview-test.matat.io/wp-content/uploads/2024/03/167113811-0be977aa-edfe-4a09-b36d-a62f02de4a29.jpeg",
                    "name": "167113811-0be977aa-edfe-4a09-b36d-a62f02de4a29.jpeg",
                    "alt": "",
                    "_id": "686e6ea7c62f165028cb4d3c"
                }
            ],
            "__v": 0
        }]
*/

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "refunded":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
};

const OrderDetailsPage = () => {
  const { order_key } = useParams();

  const { data: order, isLoading: orderLoading, error: orderError } = useQuery({
    queryKey: ["order", order_key],
    queryFn: () => getOrderByKey(order_key as string),
  });

  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ["order-products", order_key],
    queryFn: () => getOrderProducts(order_key as string),
    enabled: !!order,
  });

  if (orderError) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-destructive">Error: {orderError.message}</div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/orders">
          <Button variant="outline" className="mb-4 flex items-center gap-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
        {orderLoading ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
          </div>
        ) : order ? (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.number}</h1>
              <p className="text-muted-foreground mt-1">
                Order Key: {order.order_key}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-muted-foreground">Order not found</div>
          </div>
        )}
      </div>

      {orderLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <AddressCardSkeleton />
          <AddressCardSkeleton />
        </div>
      ) : order ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium">
                  {format(new Date(order.date_created), "MMM dd, yyyy 'at' h:mm a")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer ID:</span>
                <span className="font-medium">{order.customer_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-bold text-lg">Rs. {order.total}</span>
              </div>
              {order.customer_note && (
                <div>
                  <span className="text-muted-foreground block mb-2">Customer Note:</span>
                  <p className="text-sm bg-muted p-3 rounded-md">{order.customer_note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order.billing.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order.billing.phone}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">
                {order.billing.first_name} {order.billing.last_name}
              </p>
              {order.billing.company && <p>{order.billing.company}</p>}
              <p>{order.billing.address_1}</p>
              {order.billing.address_2 && <p>{order.billing.address_2}</p>}
              <p>
                {order.billing.city}
                {order.billing.state && `, ${order.billing.state}`}
                {order.billing.postcode && ` ${order.billing.postcode}`}
              </p>
              <p>{order.billing.country}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">
                {order.shipping.first_name} {order.shipping.last_name}
              </p>
              {order.shipping.company && <p>{order.shipping.company}</p>}
              <p>{order.shipping.address_1}</p>
              {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
              <p>
                {order.shipping.city}
                {order.shipping.state && `, ${order.shipping.state}`}
                {order.shipping.postcode && ` ${order.shipping.postcode}`}
              </p>
              <p>{order.shipping.country}</p>
              {order.shipping.phone && (
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{order.shipping.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items
          </CardTitle>
          <CardDescription>
            Products in this order
          </CardDescription>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : productsError ? (
            <div className="text-center py-8">
              <div className="text-destructive">Error loading products: {productsError.message}</div>
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product: any) => (
                <ProductCard 
                  key={product._id} 
                  product={product}
                  showQuantity={true}
                  quantity={1} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No products found for this order</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailsPage;