import { Card } from "@/components/ui/card";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Table,
  LineChart,
  Settings,
  Trash2,
} from "lucide-react";
import { Confetti } from "../confetti/Confetti";
import { motion, AnimatePresence } from "framer-motion";
import { CreateWidgetModal } from "./CreateWidgetModal";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import type { Widget } from "./CreateWidgetModal";

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

const WidgetCard = ({ widget, onDelete }: { widget: Widget; onDelete: (id: number) => void }) => {
  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'chart':
        return BarChart3;
      case 'table':
        return Table;
      case 'stats':
        return LineChart;
      default:
        return Settings;
    }
  };

  const Icon = getWidgetIcon(widget.widgetType);
  const formattedDate = new Date(widget.createdAt).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
      className="col-span-1"
    >
      <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:bg-accent/5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{widget.widgetName}</h3>
              <p className="text-sm text-muted-foreground">
                Created on {formattedDate}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(widget.id)}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{widget.description}</p>
        <div className="mt-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {widget.widgetType}
          </span>
        </div>
      </Card>
    </motion.div>
  );
};

export const Dashboard = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedWidgets = localStorage.getItem("completed_widgets");
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
  }, []);

  const handleWidgetCreated = (newWidget: Widget) => {
    setWidgets(prevWidgets => [...prevWidgets, newWidget]);
  };

  const handleDeleteWidget = (id: number) => {
    setWidgets(prevWidgets => {
      const updatedWidgets = prevWidgets.filter(widget => widget.id !== id);
      localStorage.setItem("completed_widgets", JSON.stringify(updatedWidgets));
      return updatedWidgets;
    });
    
    toast({
      title: "Widget Deleted",
      description: "The widget has been removed successfully.",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background p-8"
    >
      <div className="relative">
        <Confetti />
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold hover:text-primary transition-colors duration-300"
            >
              Dashboard Overview
            </motion.h1>
            <CreateWidgetModal onWidgetCreated={handleWidgetCreated} />
          </div>
          
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

          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Your Widgets</h2>
              <span className="text-sm text-muted-foreground">
                {widgets.length} widget{widgets.length !== 1 ? 's' : ''} created
              </span>
            </div>
            
            <AnimatePresence mode="popLayout">
              {widgets.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>No widgets created yet. Click the "Create a new widget" button to get started!</p>
                </Card>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {widgets.map((widget) => (
                    <WidgetCard 
                      key={widget.id} 
                      widget={widget} 
                      onDelete={handleDeleteWidget}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};