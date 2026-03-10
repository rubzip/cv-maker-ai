import * as React from "react"
import { useCvStore } from "../../store/useCvStore"
import { PersonalInfoForm } from "./PersonalInfoForm"
import { SocialNetworksForm } from "./SocialNetworksForm"
import { SkillsForm } from "./SkillsForm"
import { CvSectionsList } from "./CvSectionsList"
import { Plus, User, ListTree, Award, Briefcase, GraduationCap, Rocket } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

const SECTIONS = [
    { id: "experience", label: "Work Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Key Projects", icon: Rocket },
]

type Tab = "personal" | "sections" | "skills"

export function CvForm() {
    const { cv, addSection } = useCvStore()
    const [activeTab, setActiveTab] = React.useState<Tab>("personal")

    const handleAddSection = (title: string) => {
        addSection(title)
    }

    const tabs = [
        { id: "personal", label: "PERSONAL", icon: User },
        { id: "sections", label: "SECTIONS", icon: ListTree },
        { id: "skills", label: "SKILLS", icon: Award },
    ] as const

    const renderTabContent = () => {
        switch (activeTab) {
            case "personal": return (
                <div className="space-y-6">
                    <PersonalInfoForm />
                    <SocialNetworksForm />
                </div>
            )
            case "sections": return (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-8 px-2 overflow-x-auto pb-4 scrollbar-hide">
                        {SECTIONS.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => handleAddSection(s.label)}
                                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                            >
                                <s.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="text-xs font-bold whitespace-nowrap">{s.label}</span>
                                <Plus className="w-3 h-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                            </button>
                        ))}
                    </div>

                    {cv.sections.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-3xl border border-dashed border-border gap-4">
                            <div className="p-4 bg-muted/40 rounded-full">
                                <Plus className="w-8 h-8 text-muted-foreground/40" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold">Add your first section</p>
                                <p className="text-sm text-muted-foreground max-w-xs">Choose a category above to start building your resume layout.</p>
                            </div>
                        </div>
                    ) : (
                        <CvSectionsList />
                    )}
                </div>
            )
            case "skills": return <SkillsForm />
        }
    }

    return (
        <div className="space-y-8 pb-20 max-w-4xl mx-auto">
            <div className="flex justify-center p-1 bg-muted/20 backdrop-blur-sm rounded-xl border border-border/50">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all relative",
                            activeTab === id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                        {activeTab === id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-background shadow-sm border border-border/50 rounded-lg -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {renderTabContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
