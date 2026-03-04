import { useCvStore } from "../../store/useCvStore"
import { SectionForm } from "./SectionForm"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from "../ui/SortableItem"

export function CvSectionsList() {
    const { cv, reorderSections } = useCvStore()

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = cv.sections.findIndex((_, i) => `section-${i}` === active.id);
            const newIndex = cv.sections.findIndex((_, i) => `section-${i}` === over.id);
            reorderSections(oldIndex, newIndex);
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Sections
            </h2>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={cv.sections.map((_, index) => `section-${index}`)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-8">
                        {cv.sections.map((_, index) => (
                            <SortableItem key={`section-${index}`} id={`section-${index}`}>
                                <SectionForm index={index} />
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}
