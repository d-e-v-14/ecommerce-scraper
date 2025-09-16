import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import logo from "./assets/logo2.png";

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
    <div className="bg-gray-300 min-h-screen grid place-items-center bg-gradient-to-br from-[color:var(--primary)]/20 via-background to-background px-4">
      <Card className="w-full max-w-md shadow-2xl border border-border/40 backdrop-blur-xl bg-card/90 rounded-2xl animate-fade-in">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight font-nunito">
            Welcome Back 
          </CardTitle>
          <p className="text-sm text-muted-foreground font-nunito">
            Sign in to{" "}
            <span className="text-[color:var(--primary)] font-medium">
             <img
              src={logo}
              className="w-22 h-22 object-contain"
            />
            </span>
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-nunito font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl font-nunito focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-nunito text-sm font-medium">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-xs font-nunito text-[color:var(--primary)] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-red-600 text-center font-medium">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              className="w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              disabled={loading}
              type="submit"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Signup CTA */}
            <p className="text-sm text-center font-nunito text-muted-foreground">
              New to{" "}
              <span className="text-[color:var(--primary)] font-nunito font-medium">
                Satya Suchak
              </span>
              ?{" "}
              <button
                type="button"
                className="text-[color:var(--primary)] font-nunito hover:underline font-medium"
              >
                Create an account
              </button>
            </p>

            {/* Legal */}
            <p className="text-xs text-muted-foreground font-nunito text-center leading-relaxed">
              By signing in you agree to our{" "}
              <span className="text-[color:var(--primary)] hover:underline cursor-pointer">
                Terms
              </span>{" "}
              and{" "}
              <span className="text-[color:var(--primary)] hover:underline cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
