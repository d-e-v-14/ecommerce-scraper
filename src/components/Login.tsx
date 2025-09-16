import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface LoginProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Placeholder auth. Integrate with backend later.
      await new Promise((r) => setTimeout(r, 600));
      if (!email || !password) throw new Error("Enter credentials");
      onLogin({ name: email.split("@")[0], email });
    } catch (e: any) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Legal Metrology - Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button className="w-full" disabled={loading} type="submit">{loading?"Signing in...":"Sign in"}</Button>
            <p className="text-xs text-muted-foreground text-center">By signing in you agree to our Terms and Privacy Policy.</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


