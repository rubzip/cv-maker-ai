import { useCvStore } from "../../store/useCvStore"
import { Plus, Trash2 } from "lucide-react"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"

export function SkillsForm() {
    const { cv, addSkillGroup, updateSkillGroup, removeSkillGroup } = useCvStore()
    const skills = cv.skills ?? []

    return (
        <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                    Skills
                </h2>
                <Button variant="outline" size="sm" onClick={addSkillGroup}>
                    <Plus className="w-4 h-4 mr-2" /> Add Skill Group
                </Button>
            </div>

            <div className="space-y-6">
                {skills.map((group, index) => (
                    <div key={index} className="space-y-4 pt-4 first:pt-0 border-t first:border-0 border-neutral-100 dark:border-neutral-800">
                        <div className="flex gap-4 items-start">
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Skill Group Title</label>
                                    <Input
                                        value={group.skill_group}
                                        onChange={(e) => updateSkillGroup(index, { skill_group: e.target.value })}
                                        placeholder="Programming Languages"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Skills (Comma separated)</label>
                                    <Input
                                        value={group.skills.join(", ")}
                                        onChange={(e) => updateSkillGroup(index, { skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                                        placeholder="Python, JavaScript, Go"
                                    />
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeSkillGroup(index)} className="text-destructive mt-7">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}
