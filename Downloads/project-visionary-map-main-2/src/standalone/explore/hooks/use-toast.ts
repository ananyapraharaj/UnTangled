
import * as React from "react";

type ToastVariant = "default" | "destructive";

type ToastActionElement = React.ReactElement | null;

export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  action?: ToastActionElement;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

// Simple toast context
const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    // For the standalone component, we'll create a simple implementation
    const [toasts, setToasts] = React.useState<Toast[]>([]);
    
    const toast = (params: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { ...params, id };
      
      setToasts((prev) => [...prev, newToast]);
      
      // Auto dismiss
      setTimeout(() => {
        dismiss(id);
      }, params.duration || 5000);
      
      return { id };
    };
    
    const dismiss = (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };
    
    return { toasts, toast, dismiss };
  }
  
  return context;
};
