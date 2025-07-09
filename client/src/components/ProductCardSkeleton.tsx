import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ProductCardSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-6 bg-muted rounded mb-2"></div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-muted rounded"></div>
              <div className="h-4 w-24 bg-muted rounded"></div>
            </div>
          </div>
          <div className="h-5 w-12 bg-muted rounded ml-2"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-muted rounded-md"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="h-6 w-20 bg-muted rounded"></div>
              <div className="h-5 w-16 bg-muted rounded"></div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              <div className="h-4 w-16 bg-muted rounded"></div>
              <div className="h-4 w-20 bg-muted rounded"></div>
            </div>
            
            <div className="space-y-1">
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton; 