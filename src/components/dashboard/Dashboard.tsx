import { Card } from "@/components/ui/card";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Confetti } from "../confetti/Confetti";
import { motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Card className="p-6 flex items-center justify-between hover:shadow-lg transition-shadow duration-300 hover:bg-accent/10 cursor-pointer">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mt-1"
        >
          {value}
        </motion.h3>
      </div>
      <motion.div 
        whileHover={{ rotate: 5 }}
        className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-primary/20"
      >
        <Icon className="h-6 w-6 text-primary" />
      </motion.div>
    </Card>
  </motion.div>
);

const ActivityCard = ({ title }: { title: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:bg-accent/5">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01, x: 5 }}
            className="h-12 bg-muted/50 rounded-md hover:bg-muted/70 transition-colors duration-200 cursor-pointer"
          />
        ))}
      </div>
    </Card>
  </motion.div>
);

export const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background p-8"
    >
      <div className="relative">
        <Confetti />
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-8 hover:text-primary transition-colors duration-300"
          >
            Dashboard Overview
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
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
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <ActivityCard title="Recent Activity" />
            <ActivityCard title="Performance" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};