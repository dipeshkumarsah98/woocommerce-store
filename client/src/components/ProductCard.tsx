import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface ProductCardProps {
  product: {
    _id: string;
    product_id: number;
    name: string;
    description: string;
    sku: string;
    price: string;
    stock_status: string;
    categories?: Array<{ id: number; name: string; slug: string }>;
    images?: Array<{
      id: number;
      src: string;
      name: string;
      alt: string;
    }>;
    orders?: Array<{
      _id: string;
      number: string;
    }>;
  };
  showQuantity?: boolean;
  quantity?: number;
  showOrders?: boolean;
}

const ProductCard = ({
  product,
  showQuantity = false,
  quantity = 1,
  showOrders = false,
}: ProductCardProps) => {
  const mainImage = product.images?.[0]?.src;
  const stockStatusColor =
    product.stock_status === "instock"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";

  return (
    <Link to={`/products/${product.sku}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">
                {product.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Tag className="h-3 w-3" />
                SKU: {product.sku}
              </CardDescription>
            </div>
            {showQuantity && (
              <Badge variant="secondary" className="ml-2">
                Qty: {quantity}
              </Badge>
            )}
            {showOrders && (
              <Link to={`/orders?lineItem=${product._id}`} className="ml-2">
                <Badge variant="secondary" className="ml-2 hover:bg-primary hover:text-primary-foreground">
                  Orders: {product.orders?.length}
                </Badge>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-4">
            {mainImage && (
              <div className="flex-shrink-0">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold">Rs. {product.price}</span>
                <Badge className={stockStatusColor}>
                  {product.stock_status}
                </Badge>
              </div>

              {product.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="text-xs"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}

              {product.description && (
                <div
                  className="text-sm text-muted-foreground line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html:
                      product.description
                        .replace(/<[^>]*>/g, "")
                        .substring(0, 100) + "...",
                  }}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
