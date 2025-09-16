import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { UploadCloud, Link2, Download } from "lucide-react";

export function OcrAnalyzer() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productUrl, setProductUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", imageFile);
      const res = await fetch("http://localhost:5000/ocr", { method: "POST", body: form });
      if (!res.ok) throw new Error("OCR failed");
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    if (!productUrl) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl })
      });
      if (!res.ok) throw new Error("Scrape failed");
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl">OCR Text Extraction & Analysis</h2>
        <p className="text-sm text-muted-foreground">Extract and validate text from product images using AI</p>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">Upload Product Image</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 gap-3">
          <UploadCloud className="w-8 h-8 text-muted-foreground" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
          <Button onClick={handleImageUpload} disabled={!imageFile || loading}>
            {loading ? "Analyzing..." : "Analyze Image"}
          </Button>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">Compliant Product</Badge>
            <Badge variant="destructive">Non-Compliant Product</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Scrape E-commerce Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="https://www.amazon.in/product-name/dp/..."
                className="pl-9"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleScrape} disabled={!productUrl || loading}>Analyze URL</Button>
          </div>
          <p className="text-xs text-muted-foreground">Supported platforms: Amazon, Flipkart, Myntra, Snapdeal</p>
        </CardContent>
      </Card>

      {error && <div className="text-sm text-red-600">{error}</div>}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.image_urls && result.image_urls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.image_urls.map((u: string, i: number) => (
                  <img key={i} src={u} className="w-24 h-24 object-cover rounded border" />
                ))}
              </div>
            )}
            {Array.isArray(result.ocr_text) && result.ocr_text.length > 0 && (
              <div>
                <h4 className="text-xs mb-2">OCR Text</h4>
                <ul className="list-disc ml-6 text-xs text-muted-foreground max-h-48 overflow-auto">
                  {result.ocr_text.map((t: string, i: number) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


