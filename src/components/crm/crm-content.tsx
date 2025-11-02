"use client";

import { useState } from "react";
import { Users, Plus, Search, MoreVertical, Mail, Phone, Edit, Trash2, Star, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "lead" | "prospect" | "customer" | "churned";
  score: number;
  lastContact: string;
  totalValue: number;
  initials: string;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc.",
    status: "customer",
    score: 95,
    lastContact: "2 days ago",
    totalValue: 50000,
    initials: "JD",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@startup.io",
    phone: "+1 (555) 234-5678",
    company: "Startup.io",
    status: "prospect",
    score: 78,
    lastContact: "1 week ago",
    totalValue: 25000,
    initials: "JS",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mjohnson@enterprise.com",
    phone: "+1 (555) 345-6789",
    company: "Enterprise Co",
    status: "lead",
    score: 65,
    lastContact: "3 days ago",
    totalValue: 0,
    initials: "MJ",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.w@business.com",
    phone: "+1 (555) 456-7890",
    company: "Business LLC",
    status: "customer",
    score: 88,
    lastContact: "1 day ago",
    totalValue: 75000,
    initials: "SW",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@corp.com",
    phone: "+1 (555) 567-8901",
    company: "Corp Industries",
    status: "churned",
    score: 42,
    lastContact: "3 months ago",
    totalValue: 30000,
    initials: "DB",
  },
];

export function CRMContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = mockContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "customer":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "prospect":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "lead":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "churned":
        return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Users className="h-6 w-6 text-cyan-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  Manage your customer relationships
                </p>
                <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20">
                  523 Contacts
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-semibold">
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-500/10">
                <Users className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">Customers</p>
            </div>
            <p className="text-2xl font-bold">287</p>
            <p className="text-xs text-green-500">+12% this month</p>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-sm text-muted-foreground">Prospects</p>
            </div>
            <p className="text-2xl font-bold">156</p>
            <p className="text-xs text-blue-500">+8% this month</p>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-yellow-500/10">
                <Users className="h-4 w-4 text-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">Leads</p>
            </div>
            <p className="text-2xl font-bold">62</p>
            <p className="text-xs text-yellow-500">+23% this month</p>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10">
                <Star className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </div>
            <p className="text-2xl font-bold">$2.4M</p>
            <p className="text-xs text-purple-500">+15% this month</p>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Contacts Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="text-muted-foreground">
                    No contacts found. Add your first contact to get started.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-accent/50 group transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-blue-500/20">
                        <AvatarFallback className="bg-blue-500/10 text-blue-500 font-semibold text-sm">
                          {contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{contact.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{contact.email}</p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contact.company}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Star className={`h-4 w-4 ${getScoreColor(contact.score)} fill-current`} />
                      <span className={`font-semibold ${getScoreColor(contact.score)}`}>
                        {contact.score}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    ${(contact.totalValue / 1000).toFixed(0)}K
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {contact.lastContact}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                        <Phone className="h-4 w-4" />
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
                            Edit Contact
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="mr-2 h-4 w-4" />
                            Add to Favorites
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500 focus:text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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
