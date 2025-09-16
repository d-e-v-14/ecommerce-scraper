import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { motion } from "framer-motion";

export function Profile() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl">Your Profile</h2>
          <p className="text-muted-foreground text-sm">Manage your personal information</p>
        </div>
        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .25 }}>
          <div className="flex items-center gap-3 p-2 pr-3 rounded-full bg-secondary">
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm leading-4">John Doe</p>
              <p className="text-xs text-muted-foreground leading-4">john.doe@example.com</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
      <Card className="shadow-elevated">
        <CardHeader>
          <CardTitle className="text-sm">Basic Information</CardTitle>
        </CardHeader>
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
            <Input id="email" type="email" placeholder="john.doe@example.com" />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button className="bg-[color:var(--primary)] text-[color:var(--primary-foreground)]">Save changes</Button>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}


