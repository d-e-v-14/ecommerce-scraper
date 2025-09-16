import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";

type Product = {
  id?: string;
  name: string;
  platform?: string;
  seller?: string;
  price?: string;
  mrp?: string;
  status?: "Compliant" | "Warning" | "Violation";
  violations?: string[];
  image_urls?: string[];
};

export function ProductListings() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setItems([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl">Product Listings</h2>
        <p className="text-sm text-muted-foreground">Review and analyze product listing compliance status</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Product Listings Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 text-xs text-muted-foreground border-b py-2">
            <div className="col-span-5">Product</div>
            <div className="col-span-1">Platform</div>
            <div className="col-span-2">Seller</div>
            <div className="col-span-1">Price/MRP</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Violations</div>
          </div>
          <div className="divide-y">
            {items.slice(0, 7).map((p, i) => (
              <div key={i} className="grid grid-cols-12 items-center py-3 gap-2">
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                    {p.image_urls?.[0] && (
                      <img src={p.image_urls[0]} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium line-clamp-1">{p.name || "Unnamed"}</div>
                    <div className="text-xs text-muted-foreground">Origin: {p.country_of_origin || "India"}</div>
                  </div>
                </div>
                <div className="col-span-1">
                  <Badge variant="secondary">{p.platform || "Amazon"}</Badge>
                </div>
                <div className="col-span-2 text-xs">{p.seller || "Official Store"}</div>
                <div className="col-span-1 text-xs">{p.mrp || p.price || "—"}</div>
                <div className="col-span-1">
                  {p.status === "Violation" ? (
                    <Badge variant="destructive">Violation</Badge>
                  ) : p.status === "Warning" ? (
                    <Badge>Warning</Badge>
                  ) : (
                    <Badge className="bg-green-600 hover:bg-green-600">Compliant</Badge>
                  )}
                </div>
                <div className="col-span-2 flex flex-wrap gap-1">
                  {(p.violations || []).slice(0, 3).map((v, idx) => (
                    <Badge key={idx} variant="destructive" className="text-[10px]">{v}</Badge>
                  ))}
                  <Button variant="outline" size="sm" className="ml-auto">View</Button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-sm text-muted-foreground py-10 text-center">No products yet</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


