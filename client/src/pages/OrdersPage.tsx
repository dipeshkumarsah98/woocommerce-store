import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/utils";
import OrdersSearchBar from "@/components/OrdersSearchBar";
import useFetchOrders from "@/hooks/useFetchOrders";
import { getStatusColor } from "@/lib/utils";


const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: orders, isLoading, error } = useFetchOrders(debouncedSearchTerm, statusFilter, sortBy);

  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (debouncedSearchTerm) {
        params.set("search", debouncedSearchTerm);
      } else {
        params.delete("search");
      }
      if (statusFilter && statusFilter !== "all") {
        params.set("status", statusFilter);
      } else {
        params.delete("status");
      }
      if (sortBy) {
        params.set("sort", sortBy);
      } else {
        params.delete("sort");
      }
      return params;
    });
  }, [debouncedSearchTerm, statusFilter, sortBy, setSearchParams]);

  if (error) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-destructive">Error: {error.message}</div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all your store orders
        </p>
      </div>

      {!isLoading && orders && (
        <OrdersSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      {!isLoading && orders && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            {orders.length} orders
            {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
            {statusFilter && statusFilter !== "all" && ` with status "${statusFilter}"`}
            {sortBy && ` sorted by ${sortBy.replace('_', ' ')}`}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading orders...</div>
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="bg-card rounded-lg shadow border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: any) => (
                <TableRow key={order._id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    #{order.number}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {order.billing.first_name} {order.billing.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.billing.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.date_created), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge className={ cn(getStatusColor(order.status), "hover:cursor-pointer")}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    Rs. {order.total}
                  </TableCell>
                  <TableCell>
                    <Link to={`/orders/${order.order_key}`}>
                    <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium hover:underline hover:text-blue-500">View Details</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">
            {debouncedSearchTerm || (statusFilter && statusFilter !== "all") ? "No orders match your filters" : "No orders found"}
          </div>
          <p className="text-muted-foreground/70 mt-2">
            {debouncedSearchTerm || (statusFilter && statusFilter !== "all")
              ? "Try adjusting your search terms or filters." 
              : "Orders will appear here once they are created."}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;