"use client";

import { useState } from "react";
import { Database, TrendingUp, Users, Phone, MessageSquare, BarChart3, PieChart, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const callsData = [
  { name: "Mon", calls: 420 },
  { name: "Tue", calls: 385 },
  { name: "Wed", calls: 510 },
  { name: "Thu", calls: 445 },
  { name: "Fri", calls: 620 },
  { name: "Sat", calls: 280 },
  { name: "Sun", calls: 195 },
];

const agentPerformanceData = [
  { name: "Voice", value: 45 },
  { name: "SMS", value: 30 },
  { name: "Email", value: 25 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

const conversionData = [
  { name: "Jan", rate: 12 },
  { name: "Feb", rate: 15 },
  { name: "Mar", rate: 18 },
  { name: "Apr", rate: 21 },
  { name: "May", rate: 24 },
  { name: "Jun", rate: 28 },
];

export function DataStudioContent() {
  const [dateRange] = useState("Last 30 days");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Database className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Data Studio</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Analyze and visualize your automation performance
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Phone className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Calls</p>
              <p className="text-2xl font-bold">18,247</p>
              <p className="text-xs text-green-500">+15% vs last month</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <MessageSquare className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Messages</p>
              <p className="text-2xl font-bold">42,890</p>
              <p className="text-xs text-green-500">+22% vs last month</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contacts</p>
              <p className="text-2xl font-bold">8,925</p>
              <p className="text-xs text-blue-500">+8% vs last month</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion</p>
              <p className="text-2xl font-bold">28.5%</p>
              <p className="text-xs text-green-500">+5.2% vs last month</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calls by Day */}
        <Card className="lg:col-span-2 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Calls by Day</h3>
                <p className="text-sm text-muted-foreground">{dateRange}</p>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15%
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callsData}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="calls" fill="url(#colorCalls)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Agent Distribution */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Agent Distribution</h3>
              <p className="text-sm text-muted-foreground">By channel type</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <RechartsPieChart>
                <Pie
                  data={agentPerformanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {agentPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="space-y-2 pt-4 border-t">
              {agentPerformanceData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Conversion Rate Trend */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Conversion Rate Trend</h3>
            <p className="text-sm text-muted-foreground">Monthly conversion performance</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={conversionData}>
              <defs>
                <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" opacity={0.3} />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: number) => [`${value}%`, "Conversion Rate"]}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Response Time</p>
              <p className="text-2xl font-bold">2.3s</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <BarChart3 className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="text-xs text-green-500 mt-2">-12% faster</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Agents</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10">
              <PieChart className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <p className="text-xs text-blue-500 mt-2">3 pending</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Customer Satisfaction</p>
              <p className="text-2xl font-bold">4.8/5</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <p className="text-xs text-green-500 mt-2">+0.3 vs last month</p>
        </Card>
      </div>
    </div>
  );
}
