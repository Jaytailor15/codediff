"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { createId } from "@/utils/id";

interface Toast {
  id: string;
  title: string;
  description?: string;
  open: boolean;
}

interface ToastContextValue {
  toast: (toast: Omit<Toast, "id" | "open">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within Toaster");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((nextToast: Omit<Toast, "id" | "open">) => {
    const id = createId("toast");
    setToasts((current) => [...current, { ...nextToast, id, open: true }]);
    
    // Auto-close after 3 seconds
    window.setTimeout(() => {
      setToasts((current) =>
        current.map((item) => (item.id === id ? { ...item, open: false } : item))
      );
      // Clean up item from state after exit animation finishes
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
      }, 350);
    }, 3000);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((item) => (
          <ToastPrimitive.Root
            key={item.id}
            open={item.open}
            onOpenChange={(open) => {
              setToasts((current) =>
                current.map((t) => (t.id === item.id ? { ...t, open } : t))
              );
              if (!open) {
                window.setTimeout(() => {
                  setToasts((current) => current.filter((t) => t.id !== item.id));
                }, 350);
              }
            }}
            className={cn(
              "grid grid-cols-[1fr_auto] items-start gap-3 rounded-md border border-border bg-card p-4 text-card-foreground shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-5"
            )}
          >
            <div>
              <ToastPrimitive.Title className="text-sm font-semibold">
                {item.title}
              </ToastPrimitive.Title>
              {item.description ? (
                <ToastPrimitive.Description className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </ToastPrimitive.Description>
              ) : null}
            </div>
            <ToastPrimitive.Close aria-label="Close notification">
              <X className="h-4 w-4 text-muted-foreground" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed right-4 top-4 z-[100] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
