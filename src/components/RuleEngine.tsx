import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Plus, Pencil, Trash } from "lucide-react";

type Rule = {
  id: string;
  name: string;
  priority: "High" | "Medium" | "Low";
  description: string;
  active: boolean;
  metric?: string;
  detected?: number;
};

const initial: Rule[] = [
  { id: "mrp", name: "MRP Mandatory Check", priority: "High", description: "Ensures Maximum Retail Price is clearly displayed", active: true, metric: "Pricing", detected: 342 },
  { id: "origin", name: "Country of Origin Validation", priority: "High", description: "Verifies country of origin is mentioned as per FDI guidelines", active: true, metric: "Origin", detected: 189 },
  { id: "mfg", name: "Manufacturer Details Check", priority: "High", description: "Validates manufacturer name and address are present", active: true, metric: "Manufacturing", detected: 122 },
];

export function RuleEngine() {
  const [rules, setRules] = useState<Rule[]>(initial);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl">Rule Engine</h2>
        <p className="text-sm text-muted-foreground">Configure and manage Legal Metrology compliance rules</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div>
          <p className="text-xs text-muted-foreground">Total Rules</p>
          <p className="text-lg font-medium">{rules.length}</p>
        </div></CardContent></Card>
        <Card><CardContent className="p-4"><div>
          <p className="text-xs text-muted-foreground">High Priority</p>
          <p className="text-lg font-medium">{rules.filter(r=>r.priority==="High").length}</p>
        </div></CardContent></Card>
        <Card><CardContent className="p-4"><div>
          <p className="text-xs text-muted-foreground">Violations Detected</p>
          <p className="text-lg font-medium">{rules.reduce((a,b)=>a+(b.detected||0),0)}</p>
        </div></CardContent></Card>
        <Card><CardContent className="p-4"><div>
          <p className="text-xs text-muted-foreground">Rule Efficiency</p>
          <p className="text-lg font-medium">94.2%</p>
        </div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Compliance Rules Configuration</CardTitle>
          <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Rule</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {rules.map((r)=> (
            <div key={r.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch checked={r.active} onCheckedChange={(v)=>setRules(rs=>rs.map(x=>x.id===r.id?{...x,active:v}:x))} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{r.name}</span>
                      <Badge>{r.priority}</Badge>
                      {r.metric && <Badge variant="secondary">{r.metric}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                    {typeof r.detected === 'number' && (
                      <p className="text-[11px] text-muted-foreground mt-1">Violations detected: {r.detected}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Pencil className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm"><Trash className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


