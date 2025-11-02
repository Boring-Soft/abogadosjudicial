"use client";

import { FileText, PlayCircle, BookOpen, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "video" | "doc" | "guide";
  duration?: string;
  isNew?: boolean;
}

const resources: Resource[] = [
  {
    id: "1",
    title: "Getting Started with Boring Automation",
    description: "Learn the basics of setting up your first AI agent",
    type: "video",
    duration: "8:30",
    isNew: true,
  },
  {
    id: "2",
    title: "Voice Agent Best Practices",
    description: "Tips for creating effective voice conversations",
    type: "guide",
    duration: "5 min read",
  },
  {
    id: "3",
    title: "API Documentation",
    description: "Complete reference for our API endpoints",
    type: "doc",
  },
  {
    id: "4",
    title: "Campaign Optimization Guide",
    description: "Maximize your campaign success rates",
    type: "video",
    duration: "12:45",
  },
  {
    id: "5",
    title: "CRM Integration Tutorial",
    description: "Connect your favorite CRM platforms",
    type: "video",
    duration: "10:20",
    isNew: true,
  },
  {
    id: "6",
    title: "Flow Studio Advanced Features",
    description: "Build complex workflows with ease",
    type: "guide",
    duration: "8 min read",
  },
];

export function DaptaAcademy() {
  const getIcon = (type: Resource["type"]) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "doc":
        return <FileText className="h-5 w-5" />;
      case "guide":
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: Resource["type"]) => {
    switch (type) {
      case "video":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "doc":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "guide":
        return "bg-green-500/10 text-green-500 border-green-500/20";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Learning Center</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Guides, tutorials, and documentation to help you succeed
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          View All Resources
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <Card key={resource.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-500">
                  {getIcon(resource.type)}
                </div>
                <div className="flex gap-2">
                  {resource.isNew && (
                    <Badge className="bg-blue-500 text-white border-0 text-xs">New</Badge>
                  )}
                  <Badge variant="outline" className={getTypeColor(resource.type)}>
                    {resource.type}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm leading-tight group-hover:text-blue-500 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {resource.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                {resource.duration && (
                  <span className="text-xs text-muted-foreground font-medium">
                    {resource.duration}
                  </span>
                )}
                <Button variant="ghost" size="sm" className="ml-auto gap-1 text-xs group-hover:text-blue-500">
                  <PlayCircle className="h-3 w-3" />
                  {resource.type === "video" ? "Watch" : "Read"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
