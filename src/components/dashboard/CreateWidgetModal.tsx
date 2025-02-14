import { useState, useEffect } from "react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

Modal.setAppElement("#root");

// Define the data structure for each widget type
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

export interface Widget {
  id: number;
  widgetName: string;
  widgetType: string;
  description: string;
  createdAt: string;
  data: ChartData | StatsData | TableData;
}

interface CreateWidgetModalProps {
  onWidgetCreated: (widget: Widget) => void;
}

const STORAGE_KEY = "widget_form_draft";

const defaultChartData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar'],
  values: [30, 50, 70],
  chartType: 'bar',
  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1']
};

const defaultStatsData: StatsData = {
  mainValue: '1,234',
  trend: 12.5,
  previousValue: '1,100',
  timeFrame: 'This Month'
};

const defaultTableData: TableData = {
  headers: ['Name', 'Value', 'Change'],
  rows: [
    ['Item 1', '$100', '+10%'],
    ['Item 2', '$200', '-5%'],
    ['Item 3', '$300', '+15%']
  ]
};

const ChartForm = ({ data, onChange }: { 
  data: ChartData; 
  onChange: (data: ChartData) => void;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Chart Type</Label>
        <select
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
          value={data.chartType}
          onChange={(e) => onChange({ ...data, chartType: e.target.value as 'bar' | 'line' | 'pie' })}
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      
      <div>
        <Label>Labels (comma-separated)</Label>
        <Input
          value={data.labels.join(', ')}
          onChange={(e) => onChange({ 
            ...data, 
            labels: e.target.value.split(',').map(s => s.trim()) 
          })}
          placeholder="Jan, Feb, Mar"
        />
      </div>
      
      <div>
        <Label>Values (comma-separated)</Label>
        <Input
          value={data.values.join(', ')}
          onChange={(e) => onChange({ 
            ...data, 
            values: e.target.value.split(',').map(s => parseFloat(s.trim()) || 0) 
          })}
          placeholder="30, 50, 70"
        />
      </div>
    </div>
  );
};

const StatsForm = ({ data, onChange }: { 
  data: StatsData; 
  onChange: (data: StatsData) => void;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Main Value</Label>
        <Input
          value={data.mainValue}
          onChange={(e) => onChange({ ...data, mainValue: e.target.value })}
          placeholder="1,234"
        />
      </div>
      
      <div>
        <Label>Trend (%)</Label>
        <Input
          type="number"
          value={data.trend}
          onChange={(e) => onChange({ ...data, trend: parseFloat(e.target.value) })}
          placeholder="12.5"
        />
      </div>
      
      <div>
        <Label>Previous Value</Label>
        <Input
          value={data.previousValue}
          onChange={(e) => onChange({ ...data, previousValue: e.target.value })}
          placeholder="1,100"
        />
      </div>
      
      <div>
        <Label>Time Frame</Label>
        <Input
          value={data.timeFrame}
          onChange={(e) => onChange({ ...data, timeFrame: e.target.value })}
          placeholder="This Month"
        />
      </div>
    </div>
  );
};

const TableForm = ({ data, onChange }: { 
  data: TableData; 
  onChange: (data: TableData) => void;
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Headers (comma-separated)</Label>
        <Input
          value={data.headers.join(', ')}
          onChange={(e) => onChange({ 
            ...data, 
            headers: e.target.value.split(',').map(s => s.trim()) 
          })}
          placeholder="Name, Value, Change"
        />
      </div>
      
      <div>
        <Label>Rows (one per line, values comma-separated)</Label>
        <textarea
          className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background resize-none"
          value={data.rows.map(row => row.join(', ')).join('\n')}
          onChange={(e) => onChange({ 
            ...data, 
            rows: e.target.value.split('\n').map(row => row.split(',').map(cell => cell.trim())) 
          })}
          placeholder="Item 1, $100, +10%&#10;Item 2, $200, -5%&#10;Item 3, $300, +15%"
        />
      </div>
    </div>
  );
};

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    width: "90%",
    padding: "0",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "transparent",
  },
};

export const CreateWidgetModal = ({ onWidgetCreated }: CreateWidgetModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [widgetName, setWidgetName] = useState("");
  const [widgetType, setWidgetType] = useState("chart");
  const [description, setDescription] = useState("");
  const [widgetData, setWidgetData] = useState<ChartData | StatsData | TableData>(defaultChartData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Set default data based on widget type
    switch (widgetType) {
      case 'chart':
        setWidgetData(defaultChartData);
        break;
      case 'stats':
        setWidgetData(defaultStatsData);
        break;
      case 'table':
        setWidgetData(defaultTableData);
        break;
    }
  }, [widgetType]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!widgetName.trim()) {
      newErrors.widgetName = "Widget name is required";
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newWidget: Widget = {
        id: Date.now(),
        widgetName,
        widgetType,
        description,
        createdAt: new Date().toISOString(),
        data: widgetData
      };
      
      const existingWidgets = JSON.parse(localStorage.getItem("completed_widgets") || "[]");
      const updatedWidgets = [...existingWidgets, newWidget];
      
      localStorage.setItem("completed_widgets", JSON.stringify(updatedWidgets));
      onWidgetCreated(newWidget);
      
      toast({
        title: "Success!",
        description: "Widget has been created successfully.",
      });
      
      closeModal();
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  const openModal = () => setIsOpen(true);
  
  const closeModal = () => {
    setIsOpen(false);
    setErrors({});
    setWidgetName("");
    setDescription("");
    setWidgetType("chart");
    setWidgetData(defaultChartData);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          onClick={openModal}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Create a new widget
        </Button>
      </motion.div>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Create Widget Modal"
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-background rounded-lg shadow-lg"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Create New Widget</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeModal}
                  className="hover:bg-accent/50 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="widgetName">
                    Widget Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="widgetName"
                    value={widgetName}
                    onChange={(e) => setWidgetName(e.target.value)}
                    placeholder="Enter widget name"
                    className={errors.widgetName ? 'border-red-500' : ''}
                  />
                  {errors.widgetName && (
                    <p className="text-sm text-red-500">{errors.widgetName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="widgetType">Widget Type</Label>
                  <select
                    id="widgetType"
                    value={widgetType}
                    onChange={(e) => setWidgetType(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="chart">Chart</option>
                    <option value="stats">Statistics</option>
                    <option value="table">Table</option>
                  </select>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={widgetType}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    {widgetType === 'chart' && (
                      <ChartForm 
                        data={widgetData as ChartData} 
                        onChange={setWidgetData} 
                      />
                    )}
                    {widgetType === 'stats' && (
                      <StatsForm 
                        data={widgetData as StatsData} 
                        onChange={setWidgetData} 
                      />
                    )}
                    {widgetType === 'table' && (
                      <TableForm 
                        data={widgetData as TableData} 
                        onChange={setWidgetData} 
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter widget description"
                    className={`w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background resize-none ${
                      errors.description ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                  >
                    Create Widget
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      </Modal>
    </>
  );
};