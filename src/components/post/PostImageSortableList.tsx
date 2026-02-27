import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { SensorDescriptor, SensorOptions } from "@dnd-kit/core";
import type { ImageItem } from "./SortableImage";
import { SortableImage } from "./SortableImage";

interface PostImageSortableListProps {
  imageItems: ImageItem[];
  onRemove: (id: string) => void;
  sensors: SensorDescriptor<SensorOptions>[];
  onDragEnd: (event: DragEndEvent) => void;
}

export function PostImageSortableList({
  imageItems,
  onRemove,
  sensors,
  onDragEnd,
}: PostImageSortableListProps) {
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={imageItems.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="mt-2 flex flex-wrap gap-2">
          {imageItems.map((item) => (
            <li key={item.id}>
              <SortableImage item={item} onRemove={() => onRemove(item.id)} />
            </li>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
