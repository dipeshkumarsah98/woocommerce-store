import { Search, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  onSortChange
}: SearchBarProps) => {
  const getSortLabel = (sort: string) => {
    switch (sort) {
      case "name_asc":
        return "Name (A-Z)";
      case "name_desc":
        return "Name (Z-A)";
      case "price_asc":
        return "Price (Low to High)";
      case "price_desc":
        return "Price (High to Low)";
      default:
        return "Sort by";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          className="pl-10"
        />
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
            <DropdownMenuItem onClick={() => onSortChange("")}>
              Default
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("name_asc")}>
              Name (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("name_desc")}>
              Name (Z-A)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("price_asc")}>
              Price (Low to High)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("price_desc")}>
              Price (High to Low)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SearchBar; 