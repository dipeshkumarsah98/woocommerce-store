import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AddressCardSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 w-32 bg-muted rounded"></div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 w-40 bg-muted rounded"></div>
        <div className="h-4 w-32 bg-muted rounded"></div>
        <div className="h-4 w-48 bg-muted rounded"></div>
        <div className="h-4 w-36 bg-muted rounded"></div>
        <div className="h-4 w-24 bg-muted rounded"></div>
        <div className="h-4 w-20 bg-muted rounded"></div>
      </CardContent>
    </Card>
  );
};

export default AddressCardSkeleton; 