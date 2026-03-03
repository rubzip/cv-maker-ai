import { useCvStore } from "../../store/useCvStore"
import { PersonalInfoForm } from "./PersonalInfoForm"
import { SectionForm } from "./SectionForm"
import { SkillsForm } from "./SkillsForm"
import { Button } from "../ui/Button"
import { Plus } from "lucide-react"

export function CvForm() {
    const { cv, addSection } = useCvStore()

    return (
        <div className="space-y-8 pb-20">
            <PersonalInfoForm />

            {cv.sections.map((_, index) => (
                <SectionForm key={index} index={index} />
            ))}

            <div className="flex justify-center">
                <Button variant="outline" className="border-dashed" onClick={() => addSection("New Section")}>
                    <Plus className="w-4 h-4 mr-2" /> Add New Section
                </Button>
            </div>

            <SkillsForm />
        </div>
    )
}
