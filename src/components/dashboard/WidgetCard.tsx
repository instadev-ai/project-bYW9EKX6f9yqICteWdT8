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

interface ChartData {
  labels: string[];
  values: number[];
  chartType: 'bar' | 'line' | 'pie';
  backgroundColor: string[];
}

interface StatsData {
  mainValue: string;
  trend: number;
  previousValue: string;
  timeFrame: string;
}

interface TableData {
  headers: string[];
  rows: string[][];
}

const ChartWidget = ({ data }: { data: ChartData }) => {
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
    maintainAspectRatio: false,
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

  const ChartComponent = () => {
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

  return (
    <div className="w-full h-[300px]">
      <ChartComponent />
    </div>
  );
};

const StatsWidget = ({ data }: { data: StatsData }) => {
  const trend = parseFloat(data.trend.toString());
  const isPositive = trend >= 0;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-4xl font-bold">{data.mainValue}</h3>
        <div className={`flex items-center gap-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
          <span className="text-xl font-medium">{trend}%</span>
        </div>
      </div>
      <div className="text-lg text-muted-foreground">
        Previous: {data.previousValue}
      </div>
      <div className="text-lg text-muted-foreground">
        {data.timeFrame}
      </div>
    </div>
  );
};

const TableWidget = ({ data }: { data: TableData }) => {
  if (!data || !data.headers || !data.rows) {
    return <div className="text-muted-foreground">Invalid table data</div>;
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-base">
        <thead>
          <tr className="border-b">
            {data.headers.map((header: string, index: number) => (
              <th key={index} className="text-left py-3 px-4 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row: string[], rowIndex: number) => (
            <tr key={rowIndex} className="border-b last:border-0 hover:bg-accent/5">
              {row.map((cell: string, cellIndex: number) => (
                <td key={cellIndex} className="py-3 px-4">
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
    if (!widget.data) {
      return <div className="text-muted-foreground">No data available</div>;
    }

    try {
      switch (widget.widgetType) {
        case 'chart':
          return <ChartWidget data={widget.data as ChartData} />;
        case 'stats':
          return <StatsWidget data={widget.data as StatsData} />;
        case 'table':
          return <TableWidget data={widget.data as TableData} />;
        default:
          return <div className="text-muted-foreground">Unknown widget type</div>;
      }
    } catch (error) {
      console.error('Error rendering widget:', error);
      return <div className="text-muted-foreground">Error rendering widget</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
      className="w-full"
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:bg-accent/5">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{widget.widgetName}</h3>
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
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mb-6">
          {renderWidgetContent()}
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-muted-foreground">{widget.description}</p>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
            {widget.widgetType}
          </span>
        </div>
      </Card>
    </motion.div>
  );
};