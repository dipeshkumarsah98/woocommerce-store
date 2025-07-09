import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import OrdersPageSkeleton from "@/components/skeletons/OrderPageSkeleton";
import { 
  Eye,
} from "lucide-react";

import OrderDetailsModal from "@/components/OrderDetailsModel";

const OrdersTable = React.memo(({ 
  orders, 
  onViewOrder 
}: { 
  orders: any[]; 
  onViewOrder: (order: any) => void;
}) => {
  return (
    <div className="bg-card rounded-lg shadow border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewOrder(order)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Link to={`/orders/${order.order_key}`}>
                    <Button 
                      variant="link" 
                      size="sm"
                      className="text-primary hover:text-primary/80 font-medium hover:underline"
                    >
                      Details
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

OrdersTable.displayName = "OrdersTable";

const ResultsSummary = React.memo(({ 
  ordersCount, 
  searchTerm, 
  statusFilter, 
  sortBy 
}: {
  ordersCount: number;
  searchTerm: string;
  statusFilter: string;
  sortBy: string;
}) => {
  return (
    <div className="mb-6">
      <p className="text-muted-foreground">
        {ordersCount} orders
        {searchTerm && ` matching "${searchTerm}"`}
        {statusFilter && statusFilter !== "all" && ` with status "${statusFilter}"`}
        {sortBy && ` sorted by ${sortBy.replace('_', ' ')}`}
      </p>
    </div>
  );
});

ResultsSummary.displayName = "ResultsSummary";

const EmptyState = React.memo(({ 
  searchTerm, 
  statusFilter 
}: {
  searchTerm: string;
  statusFilter: string;
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-muted-foreground text-lg">
        {searchTerm || (statusFilter && statusFilter !== "all") ? "No orders match your filters" : "No orders found"}
      </div>
      <p className="text-muted-foreground/70 mt-2">
        {searchTerm || (statusFilter && statusFilter !== "all")
          ? "Try adjusting your search terms or filters." 
          : "Orders will appear here once they are created."}
      </p>
    </div>
  );
});

EmptyState.displayName = "EmptyState";

const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [lineItemFilter] = useState(searchParams.get("lineItem") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: orders, isLoading, error } = useFetchOrders(debouncedSearchTerm, statusFilter, sortBy, lineItemFilter);

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

  const handleViewOrder = useCallback((order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  }, []);

  const searchBarProps = useMemo(() => ({
    searchTerm,
    onSearchChange: setSearchTerm,
    statusFilter,
    onStatusFilterChange: setStatusFilter,
    sortBy,
    onSortChange: setSortBy,
  }), [searchTerm, statusFilter, sortBy]);

  const resultsSummaryProps = useMemo(() => ({
    ordersCount: orders?.length || 0,
    searchTerm: debouncedSearchTerm,
    statusFilter,
    sortBy,
  }), [orders?.length, debouncedSearchTerm, statusFilter, sortBy]);

  const emptyStateProps = useMemo(() => ({
    searchTerm: debouncedSearchTerm,
    statusFilter,
  }), [debouncedSearchTerm, statusFilter]);

  if (error) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-destructive">Error: {error.message}</div>
    </div>
  );

  if (isLoading) {
    return <OrdersPageSkeleton />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all your store orders
        </p>
      </div>

      {orders && (
        <OrdersSearchBar {...searchBarProps} />
      )}

      {orders && (
        <ResultsSummary {...resultsSummaryProps} />
      )}

      {orders && orders.length > 0 ? (
        <OrdersTable 
          orders={orders} 
          onViewOrder={handleViewOrder}
        />
      ) : orders ? (
        <EmptyState {...emptyStateProps} />
      ) : null}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default OrdersPage;