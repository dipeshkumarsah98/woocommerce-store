import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OrdersPageSkeleton = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all your store orders
        </p>
      </div>

      <div className="mb-6 animate-pulse">
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border">
          <div className="flex-1">
            <div className="h-10 bg-muted rounded-md"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-muted rounded-md"></div>
            <div className="h-10 w-32 bg-muted rounded-md"></div>
          </div>
        </div>
      </div>

      <div className="mb-6 animate-pulse">
        <div className="h-4 w-48 bg-muted rounded"></div>
      </div>

      <div className="bg-card rounded-lg shadow border animate-pulse">
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
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="h-4 w-16 bg-muted rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-3 w-40 bg-muted rounded"></div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted rounded"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 w-20 bg-muted rounded"></div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-4 w-16 bg-muted rounded ml-auto"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 w-20 bg-muted rounded"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersPageSkeleton;