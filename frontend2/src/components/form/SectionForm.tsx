import * as React from "react"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useCvStore } from "../../store/useCvStore"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import type { Experience } from "../../types/cv"

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

    const handleDateChange = (expIndex: number, field: 'start_date' | 'end_date', subfield: 'month' | 'year', value: string) => {
        const currentExp = section.content[expIndex]
        const currentDate = currentExp.interval?.[field] ?? { month: 1, year: new Date().getFullYear() }

        updateExperience(index, expIndex, {
            interval: {
                ...(currentExp.interval ?? { start_date: null, end_date: null }),
                [field]: { ...currentDate, [subfield]: parseInt(value) || 0 }
            }
        })
    }

    return (
        <Card className="overflow-hidden border-border transition-colors">
            <div className="flex items-center justify-between p-4 bg-muted/30 border-b border-border">
                <Input
                    value={section.title}
                    onChange={handleTitleChange}
                    placeholder="Section Title (e.g. Experience)"
                    className="max-w-[300px] font-medium border-transparent bg-transparent focus-visible:ring-0 px-0 h-7"
                />
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeSection(index)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="p-6 space-y-6">
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
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="MM"
                                            value={exp.interval?.start_date?.month ?? ""}
                                            onChange={(e) => handleDateChange(expIndex, 'start_date', 'month', e.target.value)}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="YYYY"
                                            value={exp.interval?.start_date?.year ?? ""}
                                            onChange={(e) => handleDateChange(expIndex, 'start_date', 'year', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">End Date (Leave empty for Present)</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="MM"
                                            value={exp.interval?.end_date?.month ?? ""}
                                            onChange={(e) => handleDateChange(expIndex, 'end_date', 'month', e.target.value)}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="YYYY"
                                            value={exp.interval?.end_date?.year ?? ""}
                                            onChange={(e) => handleDateChange(expIndex, 'end_date', 'year', e.target.value)}
                                        />
                                    </div>
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

                    <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => addExperience(index)}>
                        <Plus className="w-4 h-4 mr-2" /> Add Entry
                    </Button>
                </div>
            )}
        </Card>
    )
}
