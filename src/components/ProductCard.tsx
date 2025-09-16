import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Package, Phone, Star } from "lucide-react";

interface ProductData {
  id?: string;
  name?: string;
  manufacturer?: {
    name?: string;
    address?: string;
  };
  netQuantity?: string;
  mrp?: number;
  consumerCare?: string;
  manufactureDate?: string;
  countryOfOrigin?: string;
  complianceScore?: number;
  category?: string;
  image?: string;
}

interface ProductCardProps {
  product: ProductData;
}

export function ProductCard({ product }: ProductCardProps) {
  const safe = {
    name: product?.name ?? "Untitled Product",
    category: product?.category ?? "Uncategorized",
    manufacturerName: product?.manufacturer?.name ?? "Unknown Manufacturer",
    manufacturerAddress: product?.manufacturer?.address ?? "—",
    netQuantity: product?.netQuantity ?? "—",
    mrp: typeof product?.mrp === "number" ? product.mrp : 0,
    consumerCare: product?.consumerCare ?? "—",
    manufactureDate: product?.manufactureDate ?? "—",
    countryOfOrigin: product?.countryOfOrigin ?? "—",
    complianceScore: typeof product?.complianceScore === "number" ? product.complianceScore : 0,
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-sm mb-1 line-clamp-2">{safe.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {safe.category}
            </Badge>
          </div>
          <Badge className={`text-xs ${getComplianceColor(safe.complianceScore)}`}>
            <Star className="w-3 h-3 mr-1" />
            {safe.complianceScore}%
          </Badge>
        </div>

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-start space-x-2">
            <Package className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-foreground text-xs">{safe.manufacturerName}</p>
              <p className="line-clamp-2">{safe.manufacturerAddress}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs">Net Qty:</span>
            <span className="text-foreground text-xs">{safe.netQuantity}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs">MRP:</span>
            <span className="text-foreground text-xs">₹{safe.mrp.toLocaleString()}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Phone className="w-3 h-3" />
            <span className="text-xs truncate">{safe.consumerCare}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3" />
            <span className="text-xs">{safe.manufactureDate}</span>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="w-3 h-3" />
            <span className="text-xs">{safe.countryOfOrigin}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}