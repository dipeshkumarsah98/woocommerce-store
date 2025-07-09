import { Card, CardContent, CardHeader } from "../ui/card";
import OrderCardSkeleton from "./OrderCardSkeleton";

const ProductDetailsSkeleton = () => {
  return (
    <div className="container mx-auto py-4 px-4">
      {/* Back Button Skeleton */}
      <div className="mb-6">
        <div className="h-10 w-40 bg-muted rounded-md animate-pulse"></div>
      </div>

      {/* Product Details Card Skeleton */}
      <Card className="mb-8 animate-pulse">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="h-8 w-64 bg-muted rounded mb-2"></div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-muted rounded"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </div>
            </div>
            <div className="h-6 w-20 bg-muted rounded"></div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Image Skeleton */}
            <div className="flex justify-center">
              <div className="w-full max-w-md h-64 bg-muted rounded-lg"></div>
            </div>

            {/* Product Information Skeleton */}
            <div className="space-y-6">
              {/* Price Skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-muted rounded"></div>
                <div className="h-8 w-32 bg-muted rounded"></div>
              </div>

              {/* Categories Skeleton */}
              <div>
                <div className="h-5 w-20 bg-muted rounded mb-2"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 bg-muted rounded"></div>
                  <div className="h-6 w-20 bg-muted rounded"></div>
                  <div className="h-6 w-14 bg-muted rounded"></div>
                </div>
              </div>

              {/* Description Skeleton */}
              <div>
                <div className="h-5 w-24 bg-muted rounded mb-2"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-1/2 bg-muted rounded"></div>
                </div>
              </div>

              {/* Product Details Skeleton */}
              <div>
                <div className="h-5 w-28 bg-muted rounded mb-2"></div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-muted rounded"></div>
                    <div className="h-4 w-16 bg-muted rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-8 bg-muted rounded"></div>
                    <div className="h-4 w-24 bg-muted rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-6 w-16 bg-muted rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-28 bg-muted rounded"></div>
                    <div className="h-4 w-8 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Orders Section Skeleton */}
      <Card className="animate-pulse">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-muted rounded"></div>
            <div className="h-6 w-32 bg-muted rounded"></div>
          </div>
          <div className="h-4 w-48 bg-muted rounded mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <OrderCardSkeleton key={index} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailsSkeleton;