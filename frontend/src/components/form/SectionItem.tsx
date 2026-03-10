import { Trash2, GripVertical, Building2, MapPin, Link as LinkIcon, Calendar, Plus } from "lucide-react"
import { Button } from "../ui/Button"
import type { Experience } from "../../types/cv"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "../../lib/utils"
import { useCvStore } from "../../store/useCvStore"
import { DatePicker } from "../ui/DatePicker"

interface SectionItemProps {
    item: Experience
    sectionIndex: number
    itemIndex: number
}

export function SectionItem({ item, sectionIndex, itemIndex }: SectionItemProps) {
    const { updateExperience, removeExperience } = useCvStore()

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id || item.name })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group/item p-6 bg-card border border-border/50 rounded-2xl relative transition-all",
                isDragging && "opacity-50 scale-95 shadow-2xl z-50 ring-1 ring-primary/30"
            )}
        >
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 bg-white dark:bg-neutral-800 border border-border shadow-sm rounded-lg" {...attributes} {...listeners}>
                <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="flex items-start justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Role / Degree / Project Title"
                    className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-bold text-foreground p-0 placeholder:text-muted-foreground/30"
                    value={item.name}
                    onChange={(e) => updateExperience(sectionIndex, itemIndex, { name: e.target.value })}
                />
                <Button variant="ghost" size="icon" onClick={() => removeExperience(sectionIndex, itemIndex)} className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Building2 className="w-3 h-3" /> Company / Institution
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Google, Stanford..."
                            className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={item.institution || ""}
                            onChange={(e) => updateExperience(sectionIndex, itemIndex, { institution: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Location
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. San Francisco, CA"
                            className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={item.location || ""}
                            onChange={(e) => updateExperience(sectionIndex, itemIndex, { location: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <LinkIcon className="w-3 h-3" /> Website / URL
                        </label>
                        <input
                            type="text"
                            placeholder="https://..."
                            className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={item.url || ""}
                            onChange={(e) => updateExperience(sectionIndex, itemIndex, { url: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Time Interval
                        </label>
                        <div className="flex items-end gap-3">
                            <DatePicker
                                label="Start"
                                value={item.interval?.start_date || null}
                                onChange={(date) => updateExperience(sectionIndex, itemIndex, {
                                    interval: {
                                        ...item.interval!,
                                        start_date: date
                                    }
                                })}
                            />
                            <DatePicker
                                label="End"
                                value={item.interval?.end_date || null}
                                onChange={(date) => updateExperience(sectionIndex, itemIndex, {
                                    interval: {
                                        ...item.interval!,
                                        end_date: date
                                    }
                                })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    Description & Key Accomplishments
                </label>
                {(item.description || []).map((desc, di) => (
                    <div key={di} className="relative group/desc">
                        <div className="absolute left-3 top-[18px] w-1.5 h-1.5 rounded-full bg-primary/30" />
                        <textarea
                            placeholder="Briefly describe your responsibilities or achievements..."
                            className="w-full bg-muted/20 border border-border/30 rounded-xl pl-8 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium min-h-[60px] resize-none overflow-hidden"
                            value={desc}
                            onChange={(e) => {
                                const newDesc = [...item.description]
                                newDesc[di] = e.target.value
                                updateExperience(sectionIndex, itemIndex, { description: newDesc })
                            }}
                        />
                        <button
                            onClick={() => {
                                const newDesc = item.description.filter((_, i) => i !== di)
                                updateExperience(sectionIndex, itemIndex, { description: newDesc })
                            }}
                            className="absolute right-3 top-3 p-1 rounded-md text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/desc:opacity-100 transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}

                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-10 border border-dashed border-border/50 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all font-bold text-[10px] uppercase tracking-widest"
                    onClick={() => {
                        const newDesc = [...(item.description || []), ""]
                        updateExperience(sectionIndex, itemIndex, { description: newDesc })
                    }}
                >
                    <Plus className="w-3 h-3 mr-2" /> Add Achievement
                </Button>
            </div>
        </div>
    )
}
