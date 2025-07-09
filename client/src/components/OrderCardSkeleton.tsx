import { Card, CardContent, CardHeader } from "@/components/ui/card";

const OrderCardSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-muted rounded"></div>
          <div className="h-6 w-32 bg-muted rounded"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div className="h-4 w-24 bg-muted rounded"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-28 bg-muted rounded"></div>
          <div className="h-4 w-16 bg-muted rounded"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-28 bg-muted rounded"></div>
          <div className="h-6 w-20 bg-muted rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCardSkeleton; 