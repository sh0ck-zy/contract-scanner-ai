import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SystemConfig() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <Input
                id="openai-key"
                type="password"
                placeholder="sk-..."
                defaultValue={process.env.OPENAI_API_KEY}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clerk-key">Clerk Secret Key</Label>
              <Input
                id="clerk-key"
                type="password"
                placeholder="sk_test_..."
                defaultValue={process.env.CLERK_SECRET_KEY}
              />
            </div>
            <Button>Save API Keys</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="max-file-size">Maximum File Size (MB)</Label>
              <Input
                id="max-file-size"
                type="number"
                defaultValue="10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="allowed-file-types">Allowed File Types</Label>
              <Input
                id="allowed-file-types"
                defaultValue=".pdf,.doc,.docx"
              />
            </div>
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 