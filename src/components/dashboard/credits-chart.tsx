"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CreditsChart() {
  const dateRange = "Last 30 days";
  const creditsUsed = 6420;
  const creditsTotal = 10000;
  const percentageUsed = Math.round((creditsUsed / creditsTotal) * 100);
  const trend = "+18%";

  // Generate data for the past 30 days with realistic usage
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    let cumulativeCredits = 0;

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Simulate realistic credit usage with some variation
      const dailyUsage = Math.floor(Math.random() * 300) + 100;
      cumulativeCredits += dailyUsage;

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        credits: cumulativeCredits > creditsUsed ? creditsUsed : cumulativeCredits,
      });
    }

    return data;
  }, [creditsUsed]);

  return (
    <Card className="p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight">Credit Usage</h3>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Track your monthly credit consumption</p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">{dateRange}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold tracking-tight">
                {creditsUsed.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                of {creditsTotal.toLocaleString()} credits
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-500">{percentageUsed}%</p>
              <p className="text-xs text-muted-foreground">used</p>
            </div>
          </div>

          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${percentageUsed}%` }}
            />
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" opacity={0.3} />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              formatter={(value: number) => [`${value.toLocaleString()} credits`, "Used"]}
            />
            <Area
              type="monotone"
              dataKey="credits"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCredits)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
