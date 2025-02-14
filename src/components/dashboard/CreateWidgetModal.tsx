import { useState, useEffect } from "react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

Modal.setAppElement("#root");

interface WidgetFormData {
  widgetName: string;
  widgetType: string;
  description: string;
}

export interface Widget {
  id: number;
  widgetName: string;
  widgetType: string;
  description: string;
  createdAt: string;
}

interface CreateWidgetModalProps {
  onWidgetCreated: (widget: Widget) => void;
}

const STORAGE_KEY = "widget_form_draft";

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

const initialFormData: WidgetFormData = {
  widgetName: "",
  widgetType: "chart",
  description: "",
};

export const CreateWidgetModal = ({ onWidgetCreated }: CreateWidgetModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<WidgetFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<WidgetFormData>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        setFormData(JSON.parse(savedDraft));
        toast({
          title: "Draft Loaded",
          description: "Your previous draft has been restored.",
        });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && Object.values(formData).some(value => value !== "")) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<WidgetFormData> = {};
    
    if (!formData.widgetName.trim()) {
      newErrors.widgetName = "Widget name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name as keyof WidgetFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newWidget = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      
      const existingWidgets = JSON.parse(localStorage.getItem("completed_widgets") || "[]");
      const updatedWidgets = [...existingWidgets, newWidget];
      
      localStorage.setItem("completed_widgets", JSON.stringify(updatedWidgets));
      
      // Call the callback with the new widget
      onWidgetCreated(newWidget);
      
      // Clear the draft
      localStorage.removeItem(STORAGE_KEY);
      setFormData(initialFormData);
      
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
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormData);
    toast({
      title: "Draft Cleared",
      description: "Your draft has been cleared.",
    });
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
                    name="widgetName"
                    value={formData.widgetName}
                    onChange={handleInputChange}
                    placeholder="Enter widget name"
                    className={`w-full ${errors.widgetName ? 'border-red-500' : ''}`}
                  />
                  {errors.widgetName && (
                    <p className="text-sm text-red-500">{errors.widgetName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="widgetType">Widget Type</Label>
                  <select
                    id="widgetType"
                    name="widgetType"
                    value={formData.widgetType}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="chart">Chart</option>
                    <option value="stats">Statistics</option>
                    <option value="table">Table</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter widget description"
                    className={`w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background resize-none ${
                      errors.description ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="flex gap-4 justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearDraft}
                  >
                    Clear Draft
                  </Button>
                  <div className="flex gap-4">
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
                </div>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      </Modal>
    </>
  );
};