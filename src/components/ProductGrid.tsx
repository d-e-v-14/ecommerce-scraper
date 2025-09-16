import React, { useState } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Search, Filter, SortAsc } from "lucide-react";

export interface ProductData {
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

interface ProductGridProps {
  products?: ProductData[];
}

export function ProductGrid({ products = [] }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const categories = [
    "all",
    ...Array.from(new Set(
      products
        .map((p: ProductData) => (p?.category ?? "").toString().trim())
        .filter(Boolean)
    )),
  ];

  const filteredProducts: ProductData[] = products
    .filter((product: ProductData) =>
      (product?.name ?? "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || (product?.category ?? "") === selectedCategory)
    )
    .sort((a: ProductData, b: ProductData) => {
      const aName = (a?.name ?? "").toString();
      const bName = (b?.name ?? "").toString();
      switch (sortBy) {
        case "compliance":
          return (b?.complianceScore ?? 0) - (a?.complianceScore ?? 0);
        case "price":
          return ((a?.mrp as number) ?? 0) - ((b?.mrp as number) ?? 0);
        default:
          return aName.localeCompare(bName);
      }
    });

  const getComplianceStats = () => {
    const total = filteredProducts.length;
    const highCompliance = filteredProducts.filter((p: ProductData) => (p?.complianceScore ?? 0) >= 90).length;
    const mediumCompliance = filteredProducts.filter((p: ProductData) => {
      const s = p?.complianceScore ?? 0;
      return s >= 70 && s < 90;
    }).length;
    const lowCompliance = filteredProducts.filter((p: ProductData) => (p?.complianceScore ?? 0) < 70).length;
    return { total, highCompliance, mediumCompliance, lowCompliance };
  };

  const stats = getComplianceStats();

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl">Product Compliance Database</h2>
            <p className="text-muted-foreground text-sm">
              {stats.total} products • {stats.highCompliance} high compliance • {stats.mediumCompliance} medium • {stats.lowCompliance} low
            </p>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              High: {stats.highCompliance}
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Medium: {stats.mediumCompliance}
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Low: {stats.lowCompliance}
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products by name, manufacturer, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input-background border-0"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-input-background border-0">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={`cat-${category}`} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-input-background border-0">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="compliance">Compliance Score</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product: ProductData, idx: number) => (
          <ProductCard key={product?.id ?? `${product?.name ?? 'product'}-${idx}`} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}