"use client";

import { useState } from "react";
import { Search, MoreVertical, Edit, Trash2, Settings, PhoneForwarded } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PhoneNumber {
  id: string;
  number: string;
  name: string;
  country: string;
  type: "local" | "toll-free" | "mobile";
  status: "active" | "inactive";
  assignedTo: string | null;
  monthlyCost: number;
  totalCalls: number;
  addedDate: string;
}

const mockPhoneNumbers: PhoneNumber[] = [
  {
    id: "1",
    number: "+1 (555) 123-4567",
    name: "Main Sales Line",
    country: "US",
    type: "local",
    status: "active",
    assignedTo: "Sales Qualifier",
    monthlyCost: 5.00,
    totalCalls: 1247,
    addedDate: "2024-01-15",
  },
  {
    id: "2",
    number: "+1 (800) 555-0123",
    name: "Support Hotline",
    country: "US",
    type: "toll-free",
    status: "active",
    assignedTo: "Customer Support",
    monthlyCost: 15.00,
    totalCalls: 3421,
    addedDate: "2024-01-10",
  },
  {
    id: "3",
    number: "+1 (555) 987-6543",
    name: "Marketing Campaign",
    country: "US",
    type: "local",
    status: "active",
    assignedTo: null,
    monthlyCost: 5.00,
    totalCalls: 892,
    addedDate: "2024-02-05",
  },
  {
    id: "4",
    number: "+1 (888) 555-7890",
    name: "Enterprise Line",
    country: "US",
    type: "toll-free",
    status: "inactive",
    assignedTo: null,
    monthlyCost: 15.00,
    totalCalls: 0,
    addedDate: "2024-03-01",
  },
  {
    id: "5",
    number: "+1 (555) 246-8024",
    name: "Lead Gen Line",
    country: "US",
    type: "local",
    status: "active",
    assignedTo: "Lead Follow-up",
    monthlyCost: 5.00,
    totalCalls: 567,
    addedDate: "2024-02-20",
  },
];

export function PhoneNumbersTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNumbers = mockPhoneNumbers.filter((phone) =>
    phone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    phone.number.includes(searchQuery)
  );

  const getTypeColor = (type: PhoneNumber["type"]) => {
    switch (type) {
      case "toll-free":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "local":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "mobile":
        return "bg-green-500/10 text-green-500 border-green-500/20";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search phone numbers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phone Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Total Calls</TableHead>
              <TableHead>Monthly Cost</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNumbers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="text-muted-foreground">
                    No phone numbers found. Add your first number to get started.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredNumbers.map((phone) => (
                <TableRow key={phone.id} className="hover:bg-accent/50 group transition-colors">
                  <TableCell className="font-mono font-semibold">{phone.number}</TableCell>
                  <TableCell className="font-medium">{phone.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(phone.type)}>
                      {phone.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {phone.status === "active" ? (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20 font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-500 mr-1.5" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {phone.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <PhoneForwarded className="h-4 w-4 text-blue-500" />
                        <span className="text-muted-foreground">{phone.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">{phone.totalCalls.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    ${phone.monthlyCost.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-accent"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Number
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PhoneForwarded className="mr-2 h-4 w-4" />
                            Reassign
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500 focus:text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Release Number
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
