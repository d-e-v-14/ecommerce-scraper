import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const [openSection, setOpenSection] = useState<string | null>("basic");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="space-y-10 font-[Nunito]">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Profile</h2>
          <p className="text-muted-foreground text-sm">
            Manage your personal information and account settings
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center gap-3 p-2 pr-4 rounded-full bg-secondary/70 shadow-sm border hover:shadow-md transition">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/profile.jpg" alt="John Doe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold leading-4">John Doe</p>
              <p className="text-xs text-muted-foreground leading-4">
                john.doe@example.com
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profile Overview */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Profile Overview</CardTitle>
            <Button variant="outline" size="sm" className="rounded-lg">
              Change Picture
            </Button>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/profile.jpg" alt="Profile" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-medium text-lg">John Doe</p>
              <p className="text-sm text-muted-foreground">Product Manager</p>
              <p className="text-xs text-muted-foreground">
                Last login: 2 hours ago
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="shadow-md">
          <CardHeader
            className="flex flex-row items-center justify-between cursor-pointer"
            onClick={() => toggleSection("basic")}
          >
            <CardTitle className="text-sm">Basic Information</CardTitle>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                openSection === "basic" ? "rotate-180" : ""
              }`}
            />
          </CardHeader>
          {openSection === "basic" && (
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+1 234 567 890" />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button className="bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg shadow-sm hover:shadow-md transition">
                  Save changes
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Password Update */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-md">
          <CardHeader
            className="flex flex-row items-center justify-between cursor-pointer"
            onClick={() => toggleSection("password")}
          >
            <CardTitle className="text-sm">Update Password</CardTitle>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                openSection === "password" ? "rotate-180" : ""
              }`}
            />
          </CardHeader>
          {openSection === "password" && (
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input id="currentPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button variant="default" className="rounded-lg shadow-sm hover:shadow-md transition">
                  Update Password
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

     
    </div>
  );
}
