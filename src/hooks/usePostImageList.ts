import { useState, useCallback } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { ImageItem } from "@/components/post/SortableImage";

export interface UsePostImageListOptions {
  maxImages: number;
  accept: Record<string, string[]>;
  maxSizeBytes: number;
}

function buildAcceptString(accept: Record<string, string[]>): string {
  return Object.keys(accept).join(",");
}

export function usePostImageList(options: UsePostImageListOptions) {
  const { maxImages, accept, maxSizeBytes } = options;
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);

  const addFiles = useCallback(
    (files: File[]) => {
      const acceptedTypes = Object.keys(accept);
      const allowed = (file: File) => {
        if (!acceptedTypes.includes(file.type)) return false;
        if (file.size > maxSizeBytes) return false;
        return true;
      };
      setImageItems((prev) => {
        const next = [...prev];
        for (const file of files) {
          if (next.length >= maxImages) break;
          if (allowed(file)) next.push({ id: crypto.randomUUID(), file });
        }
        return next;
      });
    },
    [maxImages, accept, maxSizeBytes]
  );

  const removeImage = useCallback((id: string) => {
    setImageItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImageItems((prev) => {
        const a = prev.findIndex((i) => i.id === active.id);
        const b = prev.findIndex((i) => i.id === over.id);
        if (a === -1 || b === -1) return prev;
        return arrayMove(prev, a, b);
      });
    }
  }, []);

  const imageFiles = imageItems.map((i) => i.file);

  return {
    imageItems,
    imageFiles,
    addFiles,
    acceptString: buildAcceptString(accept),
    removeImage,
    sensors,
    handleDragEnd,
  };
}
