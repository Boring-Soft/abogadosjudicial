import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Start building your application from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
          <p className="text-sm text-muted-foreground">
            This is a clean template ready for your project. Start by customizing this dashboard.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-2">Authentication</h3>
          <p className="text-sm text-muted-foreground">
            User authentication with Supabase is already configured and ready to use.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-2">Database</h3>
          <p className="text-sm text-muted-foreground">
            Prisma ORM is set up and connected. Add your models in the schema file.
          </p>
        </Card>
      </div>
    </div>
  );
} 