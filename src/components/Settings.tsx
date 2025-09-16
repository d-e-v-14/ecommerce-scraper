import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function Settings() {
  const [emails, setEmails] = React.useState<boolean>(() => localStorage.getItem('pref_emails') === '1');
  const [analytics, setAnalytics] = React.useState<boolean>(() => localStorage.getItem('pref_analytics') !== '0');
  const [ocr, setOcr] = React.useState<boolean>(() => localStorage.getItem('pref_ocr') !== '0');
  const [mode, setMode] = React.useState<string>(() => localStorage.getItem('pref_mode') || 'standard');
  const [timeout, setTimeoutVal] = React.useState<number>(() => Number(localStorage.getItem('pref_timeout') || 30));

  React.useEffect(() => { localStorage.setItem('pref_emails', emails ? '1' : '0'); }, [emails]);
  React.useEffect(() => { localStorage.setItem('pref_analytics', analytics ? '1' : '0'); }, [analytics]);
  React.useEffect(() => { localStorage.setItem('pref_ocr', ocr ? '1' : '0'); }, [ocr]);
  React.useEffect(() => { localStorage.setItem('pref_mode', mode); }, [mode]);
  React.useEffect(() => { localStorage.setItem('pref_timeout', String(timeout)); }, [timeout]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl">Settings</h2>
        <p className="text-muted-foreground text-sm">Configure your experience</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="text-sm">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emails" className="block">Email notifications</Label>
              <p className="text-xs text-muted-foreground">Receive important updates and summaries</p>
            </div>
            <Switch id="emails" checked={emails} onCheckedChange={setEmails} className="order-first mr-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analytics" className="block">Usage analytics</Label>
              <p className="text-xs text-muted-foreground">Help us improve with anonymous data</p>
            </div>
            <Switch id="analytics" checked={analytics} onCheckedChange={setAnalytics} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Scraping mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger data-selector="scraping-mode">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (fast)</SelectItem>
                  <SelectItem value="resilient">Resilient (handles blocks)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Request timeout (seconds)</Label>
              <Input type="number" min={5} max={60} value={timeout} onChange={(e) => setTimeoutVal(Number(e.target.value || 0))} data-selector="timeout-input" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Enable OCR</Label>
              <p className="text-xs text-muted-foreground">Extract text from product images when details are missing</p>
              <Switch id="ocr" checked={ocr} onCheckedChange={setOcr} data-selector="ocr-toggle" />
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}


