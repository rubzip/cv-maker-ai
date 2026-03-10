import React, { useState } from "react"
import { useCvStore } from "../../store/useCvStore"
import { Plus, X, Code2, GripVertical, Trash2 } from "lucide-react"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
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
    horizontalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";
import { FormCard } from "./FormCard"
import type { Skills } from "../../types/cv";

export function SkillsForm() {
    const { cv, reorderSkillGroups } = useCvStore()
    const addSkillGroup = useCvStore(state => state.addSkillGroup)
    const skills = cv.skills ?? []

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = skills.findIndex(s => s.id === active.id);
            const newIndex = skills.findIndex(s => s.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                reorderSkillGroups(oldIndex, newIndex);
            }
        }
    }

    return (
        <FormCard
            title="Technical Skills"
            icon={Code2}
            description="Group your skills by category (e.g. Languages, Frontend, Tools)."
        >
            <div className="space-y-10">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={skills.map(s => s.id || s.skill_group)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-8">
                            {(cv.skills || []).map((skillGroup, groupIndex) => (
                                <SortableGroup key={groupIndex} skillGroup={skillGroup} groupIndex={groupIndex} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {(!cv.skills || cv.skills.length === 0) && (
                    <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed border-border flex flex-col items-center gap-4">
                        <div className="p-3 bg-muted/40 rounded-xl">
                            <Plus className="w-6 h-6 text-muted-foreground/30" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold">No skill groups added</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Organize your expertise into categories</p>
                        </div>
                    </div>
                )}

                <Button
                    variant="outline"
                    className="w-full h-12 border-dashed border-border hover:border-primary hover:bg-primary/5 hover:text-primary transition-all font-bold flex items-center justify-center gap-2 group"
                    onClick={addSkillGroup}
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Add Skill Group
                </Button>
            </div>
        </FormCard>
    )
}

function SortableGroup({ skillGroup, groupIndex }: { skillGroup: Skills; groupIndex: number }) {
    const { updateSkillGroup, removeSkillGroup, reorderSkills } = useCvStore()
    const [newSkill, setNewSkill] = useState("")

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: skillGroup.id || skillGroup.skill_group })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleAddSkill = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSkill.trim()) return
        const updatedSkills = [...skillGroup.skills, newSkill.trim()]
        updateSkillGroup(groupIndex, { skills: updatedSkills })
        setNewSkill("")
    }

    const removeSkill = (skillIndex: number) => {
        const updatedSkills = skillGroup.skills.filter((_, i) => i !== skillIndex)
        updateSkillGroup(groupIndex, { skills: updatedSkills })
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const onDragEndChild = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const oldIndex = skillGroup.skills.indexOf(active.id as string)
            const newIndex = skillGroup.skills.indexOf(over.id as string)
            if (oldIndex !== -1 && newIndex !== -1) {
                reorderSkills(groupIndex, oldIndex, newIndex)
            }
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group/card p-6 bg-muted/30 border border-border/50 rounded-2xl relative transition-all",
                isDragging && "opacity-50 scale-95 shadow-2xl z-50 bg-card border-primary/30"
            )}
        >
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/card:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 bg-white dark:bg-neutral-800 border border-border shadow-sm rounded-lg" {...attributes} {...listeners}>
                <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="flex items-start justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Skill Category (e.g. Languages)"
                    className="flex-1 bg-transparent border-none focus:ring-0 text-md font-bold text-foreground p-0 placeholder:text-muted-foreground/40"
                    value={skillGroup.skill_group}
                    onChange={(e) => updateSkillGroup(groupIndex, { skill_group: e.target.value })}
                />
                <Button variant="ghost" size="icon" onClick={() => removeSkillGroup(groupIndex)} className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEndChild}>
                    <SortableContext items={skillGroup.skills} strategy={horizontalListSortingStrategy}>
                        {skillGroup.skills.map((skill, si) => (
                            <SortableSkill key={si} skill={skill} onRemove={() => removeSkill(si)} />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            <form onSubmit={handleAddSkill} className="relative">
                <input
                    type="text"
                    placeholder="Type a skill and press Enter..."
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all pr-20"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                />
                <Button type="submit" size="sm" variant="ghost" className="absolute right-1 top-1 bottom-1 h-auto px-3 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5">
                    Add skill
                </Button>
            </form>
        </div>
    )
}

function SortableSkill({ skill, onRemove }: { skill: string; onRemove: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: skill })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Badge
            ref={setNodeRef}
            style={style}
            className={cn(
                "gap-1 pl-2.5 pr-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors cursor-grab active:cursor-grabbing",
                isDragging && "opacity-50 scale-95 shadow-lg z-50 bg-primary/20 border-primary/30"
            )}
            {...attributes}
            {...listeners}
        >
            {skill}
            <button
                type="button"
                onClick={onRemove}
                className="rounded-full outline-none hover:bg-primary/20 p-0.5"
            >
                <X className="w-3 h-3" />
            </button>
        </Badge>
    )
}
