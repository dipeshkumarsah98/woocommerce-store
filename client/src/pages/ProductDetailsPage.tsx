import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getProductBySku, getProductOrders } from "@/services/products";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag, Package, DollarSign, ShoppingCart } from "lucide-react";
import { getStatusColor } from "@/lib/utils";
import { format } from "date-fns";
import OrderCardSkeleton from "@/components/skeletons/OrderCardSkeleton";
import ProductDetailsSkeleton from "@/components/skeletons/ProductDetailsSkeleton";

const ProductDetailsPage = () => {
  const { sku } = useParams();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", sku],
    queryFn: () => getProductBySku(sku || ""),
  });

  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ["product-orders", sku],
    queryFn: () => getProductOrders(sku || ""),
    enabled: !!sku && !!product,
  });

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-destructive">Error: {error.message}</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Product not found</div>
        </div>
      </div>
    );
  }

  const mainImage = product.images?.[0];
  const stockStatusColor = product.stock_status === "instock" 
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="mb-6">
        <Link to="/products">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{product.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-base">
                <Tag className="h-4 w-4" />
                SKU: {product.sku}
              </CardDescription>
            </div>
            <Badge className={stockStatusColor} variant="outline">
              {product.stock_status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex justify-center">
              {mainImage ? (
                <div className="w-full max-w-md">
                  <img 
                    src={mainImage.src} 
                    alt={mainImage.alt || product.name}
                    className="w-full h-auto object-cover rounded-lg border shadow-sm"
                  />
                </div>
              ) : (
                <div className="w-full max-w-md h-64 bg-muted rounded-lg flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="text-3xl font-bold">Rs. {product.price}</span>
              </div>

              {product.categories && product.categories.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category: any) => (
                      <Badge key={category.id} variant="outline">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <div 
                    className="text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product ID:</span>
                    <span>{product.product_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU:</span>
                    <span>{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock Status:</span>
                    <Badge className={stockStatusColor} variant="outline">
                      {product.stock_status}
                    </Badge>
                  </div>
                  {product.stock_quantity && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stock Quantity:</span>
                      <span>{product.stock_quantity}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Related Orders
          </CardTitle>
          <CardDescription>
            Orders that include this product
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <OrderCardSkeleton key={index} />
              ))}
            </div>
          ) : ordersError ? (
            <div className="text-center py-8">
              <div className="text-destructive mb-2">Error loading orders</div>
              <p className="text-muted-foreground text-sm">
                {ordersError.message}
              </p>
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((order: any) => (
                <Link key={order._id} to={`/orders/${order.order_key}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Order #{order.number}</CardTitle>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {order.billing.first_name} {order.billing.last_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Date:</span>
                          <span>{format(new Date(order.date_created), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Customer:</span>
                          <span className="truncate ml-2">{order.billing.email}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-muted-foreground">Total:</span>
                          <span>Rs. {order.total}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-muted-foreground text-lg mb-2">No orders found</div>
              <p className="text-muted-foreground/70 text-sm">
                This product hasn't been ordered yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;