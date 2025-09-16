import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Download, Filter } from "lucide-react";
import { motion } from "framer-motion";

const complianceData = [
  { month: 'Jan', score: 85 },
  { month: 'Feb', score: 87 },
  { month: 'Mar', score: 83 },
  { month: 'Apr', score: 89 },
  { month: 'May', score: 91 },
  { month: 'Jun', score: 88 },
];

const categoryData = [
  { category: 'Electronics', compliance: 92, violations: 3 },
  { category: 'Food & Beverages', compliance: 85, violations: 8 },
  { category: 'Cosmetics', compliance: 88, violations: 5 },
  { category: 'Textiles', compliance: 90, violations: 4 },
  { category: 'Pharmaceuticals', compliance: 95, violations: 1 },
];

const violationData = [
  { name: 'Missing MRP', value: 35, color: 'var(--chart-4)' },
  { name: 'Incorrect Origin', value: 25, color: 'var(--chart-3)' },
  { name: 'Missing Manufacturing Date', value: 20, color: 'var(--chart-5)' },
  { name: 'Incomplete Address', value: 20, color: 'var(--chart-2)' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl">Regulatory Dashboard</h2>
          <p className="text-muted-foreground text-sm">Real-time compliance monitoring and analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, delay: .05 }}>
        <Card className="shadow-elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Overall Compliance</p>
                <p className="text-lg font-medium">88.5%</p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-xs">+2.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, delay: .1 }}>
        <Card className="shadow-elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Violations</p>
                <p className="text-lg font-medium">247</p>
              </div>
              <div className="flex items-center text-red-600">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span className="text-xs">-15</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, delay: .15 }}>
        <Card className="shadow-elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Products Scanned</p>
                <p className="text-lg font-medium">12,847</p>
              </div>
              <div className="flex items-center text-[color:var(--primary)]">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-xs">+1,204</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, delay: .2 }}>
        <Card className="shadow-elevated">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg. Response Time</p>
                <p className="text-lg font-medium">2.3 hrs</p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span className="text-xs">-0.5hrs</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Trends */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .35 }}>
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-sm">Compliance Score Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        </motion.div>

        {/* Category Compliance */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .35, delay: .05 }}>
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-sm">Compliance by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="category" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="compliance" fill="var(--primary)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        </motion.div>

        {/* Violation Breakdown */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .35, delay: .1 }}>
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-sm">Violation Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={violationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {violationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {violationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-sm mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span>{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Recent Violations */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .35, delay: .15 }}>
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-sm">Recent Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { product: "Samsung Galaxy S23", issue: "Missing MRP", severity: "High", time: "2 hrs ago" },
                { product: "Nike Air Max", issue: "Incorrect Origin", severity: "Medium", time: "4 hrs ago" },
                { product: "Organic Honey", issue: "Missing Date", severity: "Low", time: "6 hrs ago" },
                { product: "Face Cream", issue: "Incomplete Address", severity: "Medium", time: "8 hrs ago" },
              ].map((violation, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-xs truncate">{violation.product}</p>
                    <p className="text-xs text-muted-foreground">{violation.issue}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={violation.severity === 'High' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {violation.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{violation.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </div>
  );
}