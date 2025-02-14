import { useState } from "react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

Modal.setAppElement("#root");

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

export const CreateWidgetModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

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

              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="widgetName">Widget Name</Label>
                  <Input
                    id="widgetName"
                    placeholder="Enter widget name"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="widgetType">Widget Type</Label>
                  <select
                    id="widgetType"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="chart">Chart</option>
                    <option value="stats">Statistics</option>
                    <option value="table">Table</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    placeholder="Enter widget description"
                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background resize-none"
                  />
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
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle form submission here
                      closeModal();
                    }}
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