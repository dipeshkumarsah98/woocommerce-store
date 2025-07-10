import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import SearchBar from "@/components/SearchBar";
import { useDebounce } from "@/lib/utils";
import useFetchProducts from "@/hooks/useFetchProducts";
import ErrorState from "@/components/ErrorState";

const ProductsGrid = React.memo(({ 
  products, 
  isLoading 
}: { 
  products: any[] | null; 
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products && products.length > 0) {
    return (
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
    );
  }

  return null;
});

ProductsGrid.displayName = "ProductsGrid";

const ResultsSummary = React.memo(({ 
  productsCount, 
  searchTerm, 
  sortBy 
}: {
  productsCount: number;
  searchTerm: string;
  sortBy: string;
}) => {
  return (
    <div className="mb-6">
      <p className="text-muted-foreground">
        {productsCount} products
        {searchTerm && ` matching "${searchTerm}"`}
        {sortBy && ` sorted by ${sortBy.replace('_', ' ')}`}
      </p>
    </div>
  );
});

ResultsSummary.displayName = "ResultsSummary";

const EmptyState = React.memo(({ 
  searchTerm 
}: {
  searchTerm: string;
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-muted-foreground text-lg">
        {searchTerm ? "No products found" : "No products found"}
      </div>
      <p className="text-muted-foreground/70 mt-2">
        {searchTerm 
          ? "Try adjusting your search criteria."
          : "Products will appear here once they are added to your store."
        }
      </p>
    </div>
  );
});

EmptyState.displayName = "EmptyState";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: products, isLoading, error, refetch } = useFetchProducts(debouncedSearchTerm, sortBy);

  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
      if (sortBy) params.set("sort", sortBy);
      return params;
    });
  }, [debouncedSearchTerm, sortBy, setSearchParams]);

  const searchBarProps = useMemo(() => ({
    searchTerm,
    onSearchChange: setSearchTerm,
    sortBy,
    onSortChange: setSortBy,
  }), [searchTerm, sortBy]);

  const resultsSummaryProps = useMemo(() => ({
    productsCount: products?.length || 0,
    searchTerm: debouncedSearchTerm,
    sortBy,
  }), [products?.length, debouncedSearchTerm, sortBy]);

  const emptyStateProps = useMemo(() => ({
    searchTerm: debouncedSearchTerm,
  }), [debouncedSearchTerm]);

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage all your store products
          </p>
        </div>
        <ErrorState 
          variant="server"
          error={error}
          title="Failed to load products"
          description="We couldn't load your products. Please try again."
          onRetry={refetch}
          showHome={false}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground mt-2">
          Browse and manage all your store products
        </p>
      </div>

      {!isLoading && products && (
        <SearchBar {...searchBarProps} />
      )}

      {!isLoading && products && (
        <ResultsSummary {...resultsSummaryProps} />
      )}

      <ProductsGrid products={products} isLoading={isLoading} />

      {!isLoading && products && products.length === 0 && (
        <EmptyState {...emptyStateProps} />
      )}
    </div>
  );
};

export default ProductsPage;