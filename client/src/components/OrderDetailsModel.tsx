import { useQuery } from "@tanstack/react-query";
import { getOrderProducts } from "@/services/orders";
import { Badge } from "@/components/ui/badge";
import { cn, getStatusColor } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Mail, Phone, Package, ShoppingCart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";

const OrderDetailsModal = ({ order, isOpen, onClose }: { 
  order: any; 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["order-products", order?.order_key],
    queryFn: () => getOrderProducts(order.order_key),
    enabled: isOpen && !!order?.order_key,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order?.number}</span>
            {order?.status && (
              <Badge className={cn(getStatusColor(order.status), "mt-4")}>
                {order.status}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {format(new Date(order?.date_created), "MMM dd, yyyy 'at' h:mm a")} • <strong>Rs. {order?.total}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {order?.billing?.first_name} {order?.billing?.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order?.billing?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order?.billing?.phone}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Shipping:</strong> {order?.shipping?.address_1}, {order?.shipping?.city}, {order?.shipping?.country}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Order Items ({products?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {products.map((product: any) => (
                    <ProductCard 
                      key={product._id} 
                      product={product}
                      showQuantity={true}
                      quantity={1}
                      showOrders={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="text-muted-foreground">No products found for this order</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;