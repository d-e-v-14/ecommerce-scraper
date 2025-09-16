import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Download, 
  FileText, 
  Calendar,
  Filter,
  Eye,
  Share,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  TrendingUp
} from "lucide-react";

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days");
  const [selectedType, setSelectedType] = useState("all");

  const reportTypes = [
    {
      id: "compliance",
      name: "Compliance Report",
      description: "Overall compliance scores and violation summaries",
      icon: CheckCircle,
      generated: "2 hours ago",
      size: "2.4 MB",
      status: "ready"
    },
    {
      id: "violations",
      name: "Violations Report", 
      description: "Details of all regulatory violations and their status",
      icon: AlertTriangle,
      generated: "1 day ago",
      size: "1.8 MB",
      status: "ready"
    },
    {
      id: "category",
      name: "Category Analysis",
      description: "Product compliance breakdown by category",
      icon: PieChart,
      generated: "3 days ago", 
      size: "3.2 MB",
      status: "ready"
    },
    {
      id: "trends",
      name: "Trend Analysis",
      description: "Compliance trends and performance over time",
      icon: TrendingUp,
      generated: "1 week ago",
      size: "1.5 MB",
      status: "ready"
    },
    {
      id: "manufacturer",
      name: "Manufacturer Report",
      description: "Compliance performance by manufacturer",
      icon: BarChart3,
      generated: "Generating...",
      size: "-",
      status: "processing"
    },
    {
      id: "geo",
      name: "Geographic Report",
      description: "Regional compliance mapping and heatmaps",
      icon: FileText,
      generated: "Queue",
      size: "-",
      status: "queued"
    }
  ];

  const recentReports = [
    { name: "Weekly Compliance Summary", date: "Dec 10, 2024", type: "PDF", downloads: 45 },
    { name: "November Violations Report", date: "Dec 1, 2024", type: "Excel", downloads: 23 },
    { name: "Q4 Category Analysis", date: "Nov 28, 2024", type: "PDF", downloads: 67 },
    { name: "Manufacturer Performance Q3", date: "Nov 15, 2024", type: "Excel", downloads: 34 },
  ];

  const scheduledReports = [
    { name: "Daily Compliance Summary", frequency: "Daily at 9 AM", nextRun: "Tomorrow 9:00 AM", active: true },
    { name: "Weekly Violations Report", frequency: "Weekly on Monday", nextRun: "Dec 16, 9:00 AM", active: true },
    { name: "Monthly Category Analysis", frequency: "Monthly on 1st", nextRun: "Jan 1, 2025", active: false },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'queued': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadReportAsJson = (report: any) => {
    // Create report data
    const reportData = {
      id: report.id,
      name: report.name,
      description: report.description,
      generated: report.generated,
      size: report.size,
      status: report.status
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(reportData, null, 2);
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl">Reports & Analytics</h2>
          <p className="text-muted-foreground text-sm">
            Generate, schedule, and manage compliance reports and analytics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
          <Button size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48 bg-input-background border-0">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7-days">Last 7 days</SelectItem>
            <SelectItem value="last-30-days">Last 30 days</SelectItem>
            <SelectItem value="last-90-days">Last 90 days</SelectItem>
            <SelectItem value="last-year">Last year</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48 bg-input-background border-0">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
            <SelectItem value="violations">Violations</SelectItem>
            <SelectItem value="analytics">Analytics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="available">Available Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent Downloads</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => {
              const IconComponent = report.icon;
              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                        <h3 className="text-sm">{report.name}</h3>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                        {report.status}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                      {report.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>Generated: {report.generated}</span>
                      <span>Size: {report.size}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        disabled={report.status !== 'ready'}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        disabled={report.status !== 'ready'}
                        onClick={() => downloadReportAsJson(report)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs">{report.name}</p>
                        <p className="text-xs text-muted-foreground">{report.date} • {report.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-muted-foreground">{report.downloads} downloads</span>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs">{report.name}</p>
                        <p className="text-xs text-muted-foreground">{report.frequency}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-muted-foreground">Next: {report.nextRun}</span>
                      <Badge className={report.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {report.active ? 'Active' : 'Paused'}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Custom Report Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Build custom reports with your specific data requirements
                </p>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Start Building Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}