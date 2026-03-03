import * as React from "react"
import { useCvStore } from "../../store/useCvStore"
import { Plus, Trash2, X } from "lucide-react"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { Badge } from "../ui/Badge"

export function SkillsForm() {
    const { cv, addSkillGroup, updateSkillGroup, removeSkillGroup } = useCvStore()
    const skills = cv.skills ?? []

    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Skills
                </h2>
                <Button variant="outline" size="sm" onClick={addSkillGroup}>
                    <Plus className="w-4 h-4 mr-2" /> Add Skill Group
                </Button>
            </div>

            <div className="space-y-6">
                {skills.map((group, groupIndex) => (
                    <SkillGroupItem
                        key={groupIndex}
                        group={group}
                        onUpdate={(data) => updateSkillGroup(groupIndex, data)}
                        onRemove={() => removeSkillGroup(groupIndex)}
                    />
                ))}
            </div>
        </Card>
    )
}

interface SkillGroupItemProps {
    group: any
    onUpdate: (data: any) => void
    onRemove: () => void
}

function SkillGroupItem({ group, onUpdate, onRemove }: SkillGroupItemProps) {
    const [inputValue, setInputValue] = React.useState("")

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
        <div className="space-y-4 pt-4 first:pt-0 border-t first:border-0 border-border">
            <div className="flex gap-4 items-start">
                <div className="flex-1 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Skill Group Title <span className="text-destructive">*</span>
                        </label>
                        <Input
                            value={group.skill_group}
                            onChange={(e) => onUpdate({ skill_group: e.target.value })}
                            placeholder="Programming Languages"
                        />
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Skills <span className="text-destructive">*</span>
                        </label>

                        <div className="flex flex-wrap gap-2 p-2 min-h-[44px] rounded-md border border-input bg-background/50 focus-within:ring-1 focus-within:ring-ring transition-all">
                            {group.skills.map((skill: string) => (
                                <Badge key={skill} className="gap-1 pl-2.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
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
                <Button variant="ghost" size="icon" onClick={onRemove} className="text-destructive mt-7">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
