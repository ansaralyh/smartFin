import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

/** Compact action bar — page title lives in the main header */
export function PageHeader({ actionLabel, onAction, children }: PageHeaderProps) {
  if (!actionLabel && !children) return null;

  return (
    <div className="mb-6 flex items-center justify-end gap-3">
      {children}
      {actionLabel && (
        <Button className="shadow-md shadow-brand/20" onClick={onAction}>
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
