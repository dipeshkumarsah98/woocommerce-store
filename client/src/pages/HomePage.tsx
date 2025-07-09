import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/services/orders";
import { getProducts } from "@/services/products";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle,
  Database,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { getStatusColor } from "@/lib/utils";


const HomePage = () => {
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  const { data: products  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;
  const totalRevenue = orders?.reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0) || 0;
  const recentOrders = orders?.slice(0, 5) || [];
  const completedOrders = orders?.filter((order: any) => order.status === 'completed').length || 0;
  const pendingOrders = orders?.filter((order: any) => order.status === 'pending').length || 0;

 

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">WooCommerce Store Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          MERN Stack Application - Interview Assessment Task
        </p>
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            MongoDB + Express + React + Node.js
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            WooCommerce API Integration
          </Badge>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {completedOrders} completed, {pendingOrders} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Synced from WooCommerce
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From all orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">
              Daily at 12 PM
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Overview */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Orders Management
            </CardTitle>
            <CardDescription>
              Complete order management with advanced filtering and search capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Search by ID, number, billing/shipping info, or product name
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Filter by order status (completed, pending, processing, etc.)
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Sort by total amount or creation date
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                View detailed order information with line items
              </div>
            </div>
            <Link to="/orders">
              <Button className="w-full mt-4">
                View Orders <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products Catalog
            </CardTitle>
            <CardDescription>
              Synchronized product catalog with search and sorting features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Search by product name or SKU
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Sort by name or price
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Display product images and details
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                View related orders for each product
              </div>
            </div>
            <Link to="/products">
              <Button className="w-full mt-4">
                View Products <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Orders
          </CardTitle>
          <CardDescription>
            Latest orders from your WooCommerce store
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="text-center py-8">Loading recent orders...</div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order: any) => (
                <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium">Order #{order.number}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.billing.first_name} {order.billing.last_name}
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Rs. {order.total}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(order.date_created), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
              ))}
              <Link to="/orders">
                <Button variant="outline" className="w-full">
                  View All Orders
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent orders found
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Technical Implementation
          </CardTitle>
          <CardDescription>
            Key features and technical highlights of this MERN stack application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Backend Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• WooCommerce REST API integration</li>
                <li>• Automated daily sync at 12 PM (cron job)</li>
                <li>• MongoDB data storage and management</li>
                <li>• Error handling and logging</li>
                <li>• Automatic cleanup of old orders (3 months)</li>
                <li>• TypeScript implementation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Frontend Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• React with TypeScript</li>
                <li>• Advanced search and filtering</li>
                <li>• Responsive design with Tailwind CSS</li>
                <li>• Real-time data updates</li>
                <li>• URL-based state management</li>
                <li>• Optimized performance with React Query</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;