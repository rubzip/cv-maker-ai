import { Trash2 } from "lucide-react"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { DatePicker } from "../ui/DatePicker"
import type { Experience } from "../../types/cv"

interface SectionItemProps {
    experience: Experience
    onUpdate: (field: keyof Experience, value: any) => void
    onRemove: () => void
}

export function SectionItem({ experience, onUpdate, onRemove }: SectionItemProps) {
    return (
        <div className="space-y-4 pt-4 first:pt-0 border-t first:border-0 border-neutral-100 dark:border-neutral-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground tracking-wider">
                        Role / Position <span className="text-destructive">*</span>
                    </label>
                    <Input
                        value={experience.name}
                        onChange={(e) => onUpdate('name', e.target.value)}
                        placeholder="Software Engineer"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground tracking-wider">
                        Institution / Company <span className="text-destructive">*</span>
                    </label>
                    <Input
                        value={experience.institution ?? ""}
                        onChange={(e) => onUpdate('institution', e.target.value)}
                        placeholder="Tech Corp"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground tracking-wider">Location</label>
                    <Input
                        value={experience.location ?? ""}
                        onChange={(e) => onUpdate('location', e.target.value)}
                        placeholder="Remote / City, State"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground tracking-wider">URL</label>
                    <Input
                        value={experience.url ?? ""}
                        onChange={(e) => onUpdate('url', e.target.value)}
                        placeholder="https://example.com"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground tracking-wider">Start Date</label>
                    <DatePicker
                        value={experience.interval?.start_date ?? null}
                        onChange={(date) => onUpdate('interval', {
                            ...(experience.interval ?? { start_date: null, end_date: null }),
                            start_date: date
                        })}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground tracking-wider">End Date (Leave empty for Present)</label>
                    <DatePicker
                        value={experience.interval?.end_date ?? null}
                        onChange={(date) => onUpdate('interval', {
                            ...(experience.interval ?? { start_date: null, end_date: null }),
                            end_date: date
                        })}
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground tracking-wider">Description (Bullet Points)</label>
                <textarea
                    value={experience.description.join('\n')}
                    onChange={(e) => onUpdate('description', e.target.value.split('\n'))}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="• Developed new features...
• Optimized performance..."
                />
            </div>

            <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={onRemove} className="text-destructive h-7 px-2">
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove Entry
                </Button>
            </div>
        </div>
    )
}
