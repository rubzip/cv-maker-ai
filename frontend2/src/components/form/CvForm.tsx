import { useCvStore } from "../../store/useCvStore"
import { PersonalInfoForm } from "./PersonalInfoForm"
import { SkillsForm } from "./SkillsForm"
import { CvSectionsList } from "./CvSectionsList"
import { Button } from "../ui/Button"
import { Plus } from "lucide-react"

export function CvForm() {
    const { addSection } = useCvStore()

    return (
        <div className="space-y-8 pb-20">
            <PersonalInfoForm />

            <CvSectionsList />

            <div className="flex justify-center">
                <Button
                    variant="outline"
                    className="border-dashed border-2 border-muted-foreground/20 bg-muted/5 hover:bg-muted/20 hover:border-muted-foreground/40 transition-all px-8"
                    onClick={() => addSection("")}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add New Section
                </Button>
            </div>

            <SkillsForm />
        </div>
    )
}
