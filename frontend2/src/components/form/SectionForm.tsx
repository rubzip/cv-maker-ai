import * as React from "react"
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react"
import { useCvStore } from "../../store/useCvStore"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { DatePicker } from "../ui/DatePicker"
import type { Experience } from "../../types/cv"
import { DragHandle } from "../ui/SortableItem"

interface SectionFormProps {
    index: number
}

export function SectionForm({ index }: SectionFormProps) {
    const { cv, updateSection, removeSection, addExperience, updateExperience, removeExperience } = useCvStore()
    const section = cv.sections[index]
    const [isExpanded, setIsExpanded] = React.useState(true)

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSection(index, e.target.value)
    }

    const handleExperienceChange = (expIndex: number, field: keyof Experience, value: any) => {
        updateExperience(index, expIndex, { [field]: value })
    }


    return (
        <Card className="overflow-hidden border-transparent hover:border-border bg-transparent hover:bg-card/50 transition-all duration-300">
            <div className="flex items-center justify-between p-4 bg-transparent group/header">
                <div className="flex items-center gap-3 flex-1">
                    <DragHandle className="opacity-0 group-hover/header:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4 text-muted-foreground/30" />
                    </DragHandle>
                    <Input
                        value={section.title}
                        onChange={handleTitleChange}
                        placeholder="Section Title (e.g. Experience)"
                        className="max-w-[400px] font-bold text-lg border-none bg-transparent focus-visible:ring-0 px-0 h-auto placeholder:opacity-50 hover:placeholder:opacity-100 transition-all shadow-none"
                    />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeSection(index)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="p-6 pt-0 space-y-6">
                    {section.content.map((exp, expIndex) => (
                        <div key={expIndex} className="space-y-4 pt-4 first:pt-0 border-t first:border-0 border-neutral-100 dark:border-neutral-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Role / Position <span className="text-destructive">*</span>
                                    </label>
                                    <Input
                                        value={exp.name}
                                        onChange={(e) => handleExperienceChange(expIndex, 'name', e.target.value)}
                                        placeholder="Software Engineer"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Institution / Company <span className="text-destructive">*</span>
                                    </label>
                                    <Input
                                        value={exp.institution ?? ""}
                                        onChange={(e) => handleExperienceChange(expIndex, 'institution', e.target.value)}
                                        placeholder="Tech Corp"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</label>
                                    <Input
                                        value={exp.location ?? ""}
                                        onChange={(e) => handleExperienceChange(expIndex, 'location', e.target.value)}
                                        placeholder="Remote / City, State"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">URL</label>
                                    <Input
                                        value={exp.url ?? ""}
                                        onChange={(e) => handleExperienceChange(expIndex, 'url', e.target.value)}
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Start Date</label>
                                    <DatePicker
                                        value={exp.interval?.start_date ?? null}
                                        onChange={(date) => handleExperienceChange(expIndex, 'interval', {
                                            ...(exp.interval ?? { start_date: null, end_date: null }),
                                            start_date: date
                                        })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">End Date (Leave empty for Present)</label>
                                    <DatePicker
                                        value={exp.interval?.end_date ?? null}
                                        onChange={(date) => handleExperienceChange(expIndex, 'interval', {
                                            ...(exp.interval ?? { start_date: null, end_date: null }),
                                            end_date: date
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description (Bullet Points)</label>
                                <textarea
                                    value={exp.description.join('\n')}
                                    onChange={(e) => handleExperienceChange(expIndex, 'description', e.target.value.split('\n'))}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="• Developed new features...
• Optimized performance..."
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button variant="ghost" size="sm" onClick={() => removeExperience(index, expIndex)} className="text-destructive h-7 px-2">
                                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove Entry
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button variant="outline" size="sm" className="w-full border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/10 transition-all" onClick={() => addExperience(index)}>
                        <Plus className="w-4 h-4 mr-2" /> Add Entry
                    </Button>
                </div>
            )}
        </Card>
    )
}
