"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardButton() {
  return (
    <Button asChild>
      <Link href="/dashboard">Dashboard</Link>
    </Button>
  );
}
