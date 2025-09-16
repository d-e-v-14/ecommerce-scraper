import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ProductGrid } from "./ProductGrid";
import { 
  Plus, 
  Upload, 
  Download, 
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  Package,
  AlertCircle
} from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "./ui/dialog";

export function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  // New state for URL extraction
  const [productUrl, setProductUrl] = useState("");
  const [extracted, setExtracted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [extractDialogOpen, setExtractDialogOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [products, setProducts] = useState([]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const productStats = [
    { label: "Total Products", value: "12,847", change: "+204", trend: "up" },
    { label: "Compliant Products", value: "11,378", change: "+156", trend: "up" },
    { label: "Pending Review", value: "847", change: "-23", trend: "down" },
    { label: "Violations", value: "622", change: "-45", trend: "down" }
  ];

  const recentActivities = [
    { action: "New product added", product: "iPhone 15 Pro Max", time: "2 mins ago", status: "pending" },
    { action: "Compliance updated", product: "Samsung Galaxy Watch", time: "15 mins ago", status: "approved" },
    { action: "Violation resolved", product: "Nike Air Jordan", time: "1 hour ago", status: "resolved" },
    { action: "Product flagged", product: "Organic Face Cream", time: "2 hours ago", status: "flagged" }
  ];

  // New: handle extract
  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setExtracted(null);
    try {
      const res = await fetch("http://localhost:5000/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl })
      });
      if (!res.ok) throw new Error("Failed to extract product data");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setExtracted(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Add handler for adding to database
  const handleAddToDatabase = async () => {
    if (!extracted) return;
    setAddLoading(true);
    setAddSuccess(false);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extracted)
      });
      if (!res.ok) throw new Error("Failed to add product to database");
      setAddSuccess(true);
      setExtracted(null);
      setProductUrl("");
      fetchProducts(); // Refresh product list
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl">Product Management</h2>
          <p className="text-muted-foreground text-sm">
            Manage product listings, compliance data, and regulatory information
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {productStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg">{stat.value}</p>
                </div>
                <div className={`flex items-center ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 mr-1 ${
                    stat.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  <span className="text-xs">{stat.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="database">Product Database</TabsTrigger>
          <TabsTrigger value="bulk-actions">Bulk Actions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Import Products
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Compliance Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="w-4 h-4 mr-2" />
                  Review Flagged Products
                </Button>
                <Dialog open={extractDialogOpen} onOpenChange={setExtractDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Extract Product Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="h-[90vh] max-h-[90vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Extract Product Data from URL</DialogTitle>
                      <DialogDescription>Paste an Amazon or Flipkart product URL below to extract product details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleExtract} className="flex flex-col gap-3">
                      <Input
                        type="url"
                        placeholder="Paste Amazon or Flipkart product URL..."
                        value={productUrl}
                        onChange={e => setProductUrl(e.target.value)}
                        required
                      />
                      <div className="flex gap-2">
                        <Button type="submit" disabled={loading || !productUrl}>
                          {loading ? "Extracting..." : "Extract"}
                        </Button>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Close</Button>
                        </DialogClose>
                      </div>
                    </form>
                    {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
                    {extracted && (
                      <Card className="mt-4 bg-muted/50 flex-1 min-h-0 flex flex-col">
                        <CardHeader>
                          <CardTitle className="text-base">Extracted Product Data</CardTitle>
                        </CardHeader>
                        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 text-sm font-normal space-y-2">
                          <div><b>Name:</b> <span className="font-light">{extracted.name || <span className="text-muted-foreground">N/A</span>}</span></div>
                          <div><b>Manufacturer Address:</b> <span className="font-light">{extracted.manufacturer_address || <span className="text-muted-foreground">N/A</span>}</span></div>
                          <div><b>Net Quantity:</b> <span className="font-light">{extracted.net_quantity || <span className="text-muted-foreground">N/A</span>}</span></div>
                          <div><b>MRP:</b> <span className="font-light">{extracted.mrp || <span className="text-muted-foreground">N/A</span>}</span></div>
                          <div><b>Consumer Care:</b> <span className="font-light">{extracted.consumer_care || <span className="text-muted-foreground">N/A</span>}</span></div>
                          <div><b>Date of Manufacture/Import:</b> <span className="font-light">{extracted.date_of_manufacture || <span className="text-muted-foreground">N/A</span>}</span></div>
                          <div><b>Country of Origin:</b> <span className="font-light">{extracted.country_of_origin || <span className="text-muted-foreground">N/A</span>}</span></div>
                          {extracted.image_urls && extracted.image_urls.length > 0 && (
                            <div>
                              <b>Product Images:</b>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {extracted.image_urls.map((url: string, idx: number) => (
                                  <img
                                    key={idx}
                                    src={url}
                                    alt="Product"
                                    className="w-20 h-20 object-cover rounded border shadow-sm bg-white"
                                    style={{ maxWidth: '80px', maxHeight: '80px' }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {extracted.ocr_text && extracted.ocr_text.filter((text: string) => text && text.trim()).length > 0 && (
                            <div>
                              <b>OCR Text from Images:</b>
                              <ul className="list-disc ml-6 text-xs text-muted-foreground font-light max-h-40 overflow-y-auto">
                                {extracted.ocr_text.map((text: string, idx: number) => (
                                  text && text.trim() ? <li key={idx}>{text}</li> : null
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="px-6 pb-6">
                          <Button onClick={handleAddToDatabase} disabled={addLoading} className="w-full mt-2">
                            {addLoading ? "Adding..." : "Add to Database"}
                          </Button>
                        </div>
                      </Card>
                    )}
                    {addSuccess && (
                      <div className="text-green-600 text-sm mt-4">Product added to database!</div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded-full ${
                          activity.status === 'approved' ? 'bg-green-100' :
                          activity.status === 'resolved' ? 'bg-blue-100' :
                          activity.status === 'flagged' ? 'bg-red-100' :
                          'bg-yellow-100'
                        }`}>
                          {activity.status === 'approved' ? 
                            <Package className="w-3 h-3 text-green-600" /> :
                            activity.status === 'flagged' ?
                            <AlertCircle className="w-3 h-3 text-red-600" /> :
                            <Package className="w-3 h-3 text-yellow-600" />
                          }
                        </div>
                        <div>
                          <p className="text-xs">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.product}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products by name, SKU, manufacturer, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input-background border-0"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <ProductGrid products={products} />
        </TabsContent>

        <TabsContent value="bulk-actions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Bulk Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Upload className="w-6 h-6 mb-2" />
                  <span className="text-xs">Bulk Import</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="w-6 h-6 mb-2" />
                  <span className="text-xs">Export All</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <span className="text-xs">Update Compliance</span>
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="text-xs mb-2">Bulk Update Status</h4>
                <p className="text-xs text-muted-foreground">
                  No bulk operations currently running. Upload a CSV file or select products to perform bulk actions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Product Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Advanced analytics dashboard coming soon</p>
                <Button variant="outline" className="mt-4">
                  Request Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}