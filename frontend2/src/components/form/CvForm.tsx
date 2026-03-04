import { useCvStore } from "../../store/useCvStore"
import { PersonalInfoForm } from "./PersonalInfoForm"
import { SectionForm } from "./SectionForm"
import { SkillsForm } from "./SkillsForm"
import { Button } from "../ui/Button"
import { Plus } from "lucide-react"
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

export function CvForm() {
    const { cv, addSection, reorderSections } = useCvStore()

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
        <div className="space-y-8 pb-20">
            <PersonalInfoForm />

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

            <div className="flex justify-center">
                <Button
                    variant="outline"
                    className="border-dashed border-2 border-muted-foreground/20 bg-muted/5 hover:bg-muted/20 hover:border-muted-foreground/40 transition-all px-8"
                    onClick={() => addSection("New Section")}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add New Section
                </Button>
            </div>

            <SkillsForm />
        </div>
    )
}
