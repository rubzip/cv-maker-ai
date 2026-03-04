import * as React from "react"
import { useCvStore } from "../../store/useCvStore"
import { PersonalInfoForm } from "./PersonalInfoForm"
import { SkillsForm } from "./SkillsForm"
import { CvSectionsList } from "./CvSectionsList"
import { Button } from "../ui/Button"
import { Plus, User, ListTree, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

type Tab = "personal" | "sections" | "skills"

export function CvForm() {
    const { addSection } = useCvStore()
    const [activeTab, setActiveTab] = React.useState<Tab>("personal")

    const tabs = [
        { id: "personal", label: "PERSONAL", icon: User },
        { id: "sections", label: "SECTIONS", icon: ListTree },
        { id: "skills", label: "SKILLS", icon: Award },
    ] as const

    return (
        <div className="space-y-8 pb-20 max-w-4xl mx-auto">
            {/* Tab Switcher */}
            <div className="flex justify-center p-1 bg-muted/20 backdrop-blur-sm rounded-xl border border-border/50">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all relative",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-background shadow-sm border border-border/50 rounded-lg -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    )
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {activeTab === "personal" && <PersonalInfoForm />}

                    {activeTab === "sections" && (
                        <div className="space-y-6">
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
                        </div>
                    )}

                    {activeTab === "skills" && <SkillsForm />}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
