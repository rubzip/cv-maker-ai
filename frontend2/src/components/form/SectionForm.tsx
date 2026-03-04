import { useCvStore } from "../../store/useCvStore"
import { Plus } from "lucide-react"
import { Button } from "../ui/Button"
import { FormCard } from "./FormCard"
import { SectionItem } from "./SectionItem"
import type { Experience } from "../../types/cv"

interface SectionFormProps {
    index: number
}

export function SectionForm({ index }: SectionFormProps) {
    const { cv, updateSection, removeSection, addExperience, updateExperience, removeExperience } = useCvStore()
    const section = cv.sections[index]

    return (
        <FormCard
            title={section.title}
            onTitleChange={(value) => updateSection(index, value)}
            onRemove={() => removeSection(index)}
            placeholder="New Section"
        >
            <div className="space-y-6">
                {section.content.map((exp: Experience, expIndex: number) => (
                    <SectionItem
                        key={expIndex}
                        experience={exp}
                        onUpdate={(field, value) => updateExperience(index, expIndex, { [field]: value })}
                        onRemove={() => removeExperience(index, expIndex)}
                    />
                ))}

                <Button variant="outline" size="sm" className="w-full border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/10 transition-all font-medium" onClick={() => addExperience(index)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Entry
                </Button>
            </div>
        </FormCard>
    )
}
