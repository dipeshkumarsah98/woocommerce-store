import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import SearchBar from "@/components/SearchBar";
import { useDebounce } from "@/lib/utils";
import useFetchProducts from "@/hooks/useFetchProducts";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: products, isLoading, error } = useFetchProducts(debouncedSearchTerm, sortBy);

  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
      if (sortBy) params.set("sort", sortBy);
      return params;
    });
  }, [debouncedSearchTerm, sortBy, setSearchParams]);


  if (error) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-destructive">Error: {error.message}</div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground mt-2">
          Browse and manage all your store products
        </p>
      </div>

      {!isLoading && products && (
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      {!isLoading && products && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            {products.length} products
            {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
            {sortBy && ` sorted by ${sortBy.replace('_', ' ')}`}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product: any) => (
            <ProductCard 
              key={product._id} 
              product={product}
              showQuantity={false}
              showOrders={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">
            {debouncedSearchTerm ? "No products found" : "No products found"}
          </div>
          <p className="text-muted-foreground/70 mt-2">
            {debouncedSearchTerm 
              ? "Try adjusting your search criteria."
              : "Products will appear here once they are added to your store."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;