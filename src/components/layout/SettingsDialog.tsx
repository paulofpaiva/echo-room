import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import type { HeaderColor } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const HEADER_COLORS: { value: HeaderColor; label: string; bgClass: string }[] = [
  { value: "amber", label: "Amber", bgClass: "bg-amber-700" },
  { value: "violet", label: "Violet", bgClass: "bg-violet-700" },
  { value: "blue", label: "Blue", bgClass: "bg-blue-700" },
  { value: "green", label: "Green", bgClass: "bg-green-700" },
  { value: "rose", label: "Rose", bgClass: "bg-rose-700" },
];

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme, headerColor, setHeaderColor } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={() => onOpenChange(false)}
        className="sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="dark-mode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Dark mode
            </label>
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle dark mode"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Theme color</p>
            <p className="text-xs text-muted-foreground">
              Header and accent color
            </p>
            <div className="flex flex-wrap gap-2">
              {HEADER_COLORS.map(({ value, label, bgClass }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setHeaderColor(value)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-transform hover:scale-110",
                    bgClass,
                    headerColor === value
                      ? "border-foreground ring-2 ring-offset-2 ring-offset-background ring-foreground/20"
                      : "border-transparent"
                  )}
                  title={label}
                  aria-label={`Set theme color to ${label}`}
                  aria-pressed={headerColor === value}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
