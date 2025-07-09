import { Search, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface OrdersSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const OrdersSearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter,
  onStatusFilterChange,
  sortBy, 
  onSortChange
}: OrdersSearchBarProps) => {
  const getSortLabel = (sort: string) => {
    switch (sort) {
      case "date_asc":
        return "Date (Oldest First)";
      case "date_desc":
        return "Date (Newest First)";
      case "total_asc":
        return "Total (Low to High)";
      case "total_desc":
        return "Total (High to Low)";
      case "number_asc":
        return "Order # (Low to High)";
      case "number_desc":
        return "Order # (High to Low)";
      default:
        return "Sort by";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "all":
        return "All Statuses";
      case "completed":
        return "Completed";
      case "processing":
        return "Processing";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      case "refunded":
        return "Refunded";
      default:
        return "Filter by Status";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders by customer name, email, or order number..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-between">
              {getStatusLabel(statusFilter)}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusFilterChange("all")}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilterChange("completed")}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilterChange("processing")}>
              Processing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilterChange("pending")}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilterChange("cancelled")}>
              Cancelled
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilterChange("refunded")}>
              Refunded
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <SortAsc className="h-4 w-4 text-muted-foreground" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between">
              {getSortLabel(sortBy)}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSortChange("")}>
              Default
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("date_desc")}>
              Date (Newest First)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("date_asc")}>
              Date (Oldest First)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("total_desc")}>
              Total (High to Low)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("total_asc")}>
              Total (Low to High)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("number_desc")}>
              Order # (High to Low)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("number_asc")}>
              Order # (Low to High)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default OrdersSearchBar; 