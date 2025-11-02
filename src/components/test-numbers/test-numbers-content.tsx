"use client";

import { TestTube2, Phone, Play, Info, Copy, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface TestNumber {
  id: string;
  number: string;
  country: string;
  description: string;
  testType: "voice" | "sms" | "both";
}

const testNumbers: TestNumber[] = [
  {
    id: "1",
    number: "+1 (555) 000-TEST",
    country: "US",
    description: "General testing number for voice agents",
    testType: "voice",
  },
  {
    id: "2",
    number: "+1 (555) 111-TEST",
    country: "US",
    description: "SMS and voice testing",
    testType: "both",
  },
  {
    id: "3",
    number: "+44 20 TEST-NUM",
    country: "UK",
    description: "UK testing number",
    testType: "voice",
  },
];

export function TestNumbersContent() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (number: string, id: string) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <TestTube2 className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Test Numbers</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Use these numbers to test your voice agents safely
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-blue-500/5 border-blue-500/20">
        <div className="flex gap-4">
          <div className="p-2 h-fit rounded-lg bg-blue-500/10">
            <Info className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">How Test Numbers Work</h3>
            <p className="text-sm text-muted-foreground">
              Test numbers are special phone numbers that allow you to test your voice agents without
              using real phone numbers or incurring charges. Calls to test numbers are logged but don&apos;t
              actually place phone calls.
            </p>
          </div>
        </div>
      </Card>

      {/* Test Numbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testNumbers.map((testNum) => (
          <Card key={testNum.id} className="group hover:shadow-lg transition-all duration-300">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                  <Phone className="h-5 w-5 text-purple-500" />
                </div>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                  {testNum.country}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-mono font-bold text-lg">{testNum.number}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(testNum.number, testNum.id)}
                  >
                    {copiedId === testNum.id ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{testNum.description}</p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t">
                <Badge variant="outline" className="text-xs">
                  {testNum.testType}
                </Badge>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2">
                <Play className="h-4 w-4" />
                Start Test Call
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Test Calls */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Test Calls</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Phone className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Sales Qualifier Agent</p>
                <p className="text-xs text-muted-foreground">Called +1 (555) 000-TEST</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                Success
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">2 min ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Phone className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Customer Support Agent</p>
                <p className="text-xs text-muted-foreground">Called +1 (555) 111-TEST</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                Success
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">15 min ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Phone className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Lead Follow-up Agent</p>
                <p className="text-xs text-muted-foreground">Called +44 20 TEST-NUM</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                Timeout
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
