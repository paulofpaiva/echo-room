import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ImageItem {
  id: string;
  file: File;
}

interface SortableImageProps {
  item: ImageItem;
  onRemove: () => void;
}

export function SortableImage({ item, onRemove }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative flex shrink-0 items-center gap-2 rounded border border-border bg-muted/30 p-2",
        isDragging && "opacity-50"
      )}
    >
      <button
        type="button"
        className="touch-none cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <div className="relative">
        <img
          src={URL.createObjectURL(item.file)}
          alt=""
          className="h-20 w-20 rounded object-cover"
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute -right-1 -top-1 h-6 w-6 rounded-full p-0 shadow"
          onClick={onRemove}
          aria-label="Remove image"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
