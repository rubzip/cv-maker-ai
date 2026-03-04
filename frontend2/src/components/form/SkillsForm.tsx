import * as React from "react"
import { useCvStore } from "../../store/useCvStore"
import { Plus, Trash2, X, GripVertical, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
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
} from '@dnd-kit/sortable';
import { SortableItem, DragHandle } from "../ui/SortableItem";

export function SkillsForm() {
    const { cv, addSkillGroup, updateSkillGroup, removeSkillGroup, reorderSkillGroups } = useCvStore()
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
            const oldIndex = skills.findIndex((_, i) => `group-${i}` === active.id);
            const newIndex = skills.findIndex((_, i) => `group-${i}` === over.id);
            reorderSkillGroups(oldIndex, newIndex);
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Skills
            </h2>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={skills.map((_, i) => `group-${i}`)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {skills.map((group, groupIndex) => (
                            <SortableItem key={`group-${groupIndex}`} id={`group-${groupIndex}`}>
                                <SkillGroupItem
                                    group={group}
                                    onUpdate={(data) => updateSkillGroup(groupIndex, data)}
                                    onRemove={() => removeSkillGroup(groupIndex)}
                                />
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <div className="flex justify-center">
                <Button
                    variant="outline"
                    className="border-dashed border-2 border-muted-foreground/20 bg-muted/5 hover:bg-muted/20 hover:border-muted-foreground/40 transition-all px-8"
                    onClick={addSkillGroup}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Skill Group
                </Button>
            </div>
        </div>
    )
}

interface SkillGroupItemProps {
    group: any
    onUpdate: (data: any) => void
    onRemove: () => void
}

function SkillGroupItem({ group, onUpdate, onRemove }: SkillGroupItemProps) {
    const [inputValue, setInputValue] = React.useState("")
    const [isExpanded, setIsExpanded] = React.useState(true)

    const addSkill = (val: string) => {
        const trimmed = val.replace(/,/g, "").trim()
        if (trimmed && !group.skills.includes(trimmed)) {
            onUpdate({ skills: [...group.skills, trimmed] })
        }
        setInputValue("")
    }

    const removeSkill = (skillToRemove: string) => {
        onUpdate({
            skills: group.skills.filter((s: string) => s !== skillToRemove)
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addSkill(inputValue)
        } else if (e.key === 'Backspace' && !inputValue && group.skills.length > 0) {
            removeSkill(group.skills[group.skills.length - 1])
        }
    }

    return (
        <Card className="overflow-hidden border-transparent hover:border-border bg-transparent hover:bg-card/50 transition-all duration-300">
            <div className="flex items-center justify-between p-4 bg-transparent group/header">
                <div className="flex items-center gap-3 flex-1">
                    <DragHandle className="opacity-0 group-hover/header:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4 text-muted-foreground/30" />
                    </DragHandle>
                    <Input
                        value={group.skill_group}
                        onChange={(e) => onUpdate({ skill_group: e.target.value })}
                        placeholder="Skill Group (e.g. Programming)"
                        className="max-w-[400px] font-bold text-lg border-none bg-transparent focus-visible:ring-0 px-0 h-auto placeholder:opacity-50 hover:placeholder:opacity-100 transition-all shadow-none"
                    />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onRemove} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="p-6 pt-0 space-y-4">
                    <div className="space-y-2.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Skills <span className="text-destructive">*</span>
                        </label>

                        <div className="flex flex-wrap gap-2 p-2 min-h-[44px] rounded-md border border-input bg-background/50 focus-within:ring-1 focus-within:ring-ring transition-all">
                            {group.skills.map((skill: string, idx: number) => (
                                <Badge
                                    key={`${skill}-${idx}`}
                                    className="gap-1 pl-2.5 pr-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className="rounded-full outline-none hover:bg-primary/20 p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={() => addSkill(inputValue)}
                                placeholder={group.skills.length === 0 ? "Type and press Enter..." : "Add skill..."}
                                className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px] h-7"
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground">Press Enter or use commas to separate skills</p>
                    </div>
                </div>
            )}
        </Card>
    )
}
