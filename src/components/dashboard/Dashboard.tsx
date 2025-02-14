import { Card } from "@/components/ui/card";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Confetti } from "../confetti/Confetti";

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) => (
  <Card className="p-6 flex items-center justify-between">
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
      <Icon className="h-6 w-6 text-primary" />
    </div>
  </Card>
);

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="relative">
        <Confetti />
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Revenue"
              value="$45,231"
              icon={DollarSign}
            />
            <StatCard
              title="Active Users"
              value="2,453"
              icon={Users}
            />
            <StatCard
              title="Sales"
              value="432"
              icon={ShoppingCart}
            />
            <StatCard
              title="Growth"
              value="+12.5%"
              icon={TrendingUp}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted/50 rounded-md animate-pulse" />
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Performance</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted/50 rounded-md animate-pulse" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};