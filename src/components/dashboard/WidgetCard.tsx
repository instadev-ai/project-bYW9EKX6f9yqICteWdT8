import { Card } from "@/components/ui/card";
import {
  BarChart3,
  Table as TableIcon,
  LineChart,
  Settings,
  Trash2,
  PieChart,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import type { Widget } from "./CreateWidgetModal";
import {
  Bar,
  Line,
  Pie
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface WidgetCardProps {
  widget: Widget;
  onDelete: (id: number) => void;
}

const ChartWidget = ({ data }: { data: any }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: data.backgroundColor,
        borderColor: data.backgroundColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: data.chartType === 'pie' ? undefined : {
      y: {
        beginAtZero: true,
      },
    },
  };

  switch (data.chartType) {
    case 'bar':
      return <Bar data={chartData} options={options} />;
    case 'line':
      return <Line data={chartData} options={options} />;
    case 'pie':
      return <Pie data={chartData} options={options} />;
    default:
      return null;
  }
};

const StatsWidget = ({ data }: { data: any }) => {
  const trend = parseFloat(data.trend);
  const isPositive = trend >= 0;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-3xl font-bold">{data.mainValue}</h3>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span className="font-medium">{trend}%</span>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Previous: {data.previousValue}
      </div>
      <div className="text-sm text-muted-foreground">
        {data.timeFrame}
      </div>
    </div>
  );
};

const TableWidget = ({ data }: { data: any }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {data.headers.map((header: string, index: number) => (
              <th key={index} className="text-left py-2 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row: string[], rowIndex: number) => (
            <tr key={rowIndex} className="border-b last:border-0">
              {row.map((cell: string, cellIndex: number) => (
                <td key={cellIndex} className="py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const WidgetCard = ({ widget, onDelete }: WidgetCardProps) => {
  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'chart':
        return BarChart3;
      case 'table':
        return TableIcon;
      case 'stats':
        return LineChart;
      default:
        return Settings;
    }
  };

  const Icon = getWidgetIcon(widget.widgetType);
  const formattedDate = new Date(widget.createdAt).toLocaleDateString();

  const renderWidgetContent = () => {
    switch (widget.widgetType) {
      case 'chart':
        return <ChartWidget data={widget.data} />;
      case 'stats':
        return <StatsWidget data={widget.data} />;
      case 'table':
        return <TableWidget data={widget.data} />;
      default:
        return null;
    }
  };

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
        
        <div className="mb-4">
          {renderWidgetContent()}
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">{widget.description}</p>
        <div className="mt-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {widget.widgetType}
          </span>
        </div>
      </Card>
    </motion.div>
  );
};