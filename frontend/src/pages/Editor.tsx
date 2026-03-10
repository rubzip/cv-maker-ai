import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
    Eye,
    EyeOff,
    Loader2,
    ArrowLeft
} from "lucide-react"
import { useCvStore } from "../store/useCvStore"
import { getCv } from "../lib/api"
import { CvForm } from "../components/form/CvForm"
import { CvPreview } from "../components/preview/CvPreview"
import { Button } from "../components/ui/Button"
import { ExportActions } from "../components/layout/ExportActions"
import { cn } from "../lib/utils"

export default function Editor() {
    const { cvId } = useParams()
    const navigate = useNavigate()
    const { cv, setCv, setCvName, setCvId, syncToDb, isLoading: isSyncing } = useCvStore()
    const [isLoading, setIsLoading] = useState(true)
    const [showPreview, setShowPreview] = useState(true)

    useEffect(() => {
        const loadCv = async () => {
            if (cvId && cvId !== "new") {
                setIsLoading(true)
                try {
                    const loadedRecord = await getCv(parseInt(cvId))
                    setCv(loadedRecord.data)
                    setCvId(loadedRecord.id)
                } catch (err) {
                    console.error("Failed to load CV:", err)
                    alert("Failed to load resume")
                    navigate("/cvs")
                } finally {
                    setIsLoading(false)
                }
            } else {
                setCvId(null)
                setIsLoading(false)
            }
        }
        loadCv()
    }, [cvId, setCv, setCvId, navigate])

    useEffect(() => {
        const interval = setInterval(() => {
            if (cvId && cvId !== "new") {
                syncToDb()
            }
        }, 30000) // Auto-save every 30 seconds
        return () => clearInterval(interval)
    }, [cvId, syncToDb])

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Initializing Studio...</p>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-background">
            {/* Header / Top Bar */}
            <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
                <div className="flex items-center gap-4 flex-1">
                    <Link to="/cvs">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="h-6 w-px bg-border mx-1" />
                    <div className="flex-1 max-w-md">
                        <input
                            type="text"
                            value={cv.name}
                            onChange={(e) => setCvName(e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 font-bold text-sm h-8 p-0 placeholder:text-muted-foreground/50"
                            placeholder="Resume Name (e.g. Senior Frontend Developer)"
                        />
                        <div className="flex items-center gap-2">
                            {isSyncing && (
                                <span className="flex items-center gap-1 text-[9px] text-muted-foreground animate-pulse">
                                    <Loader2 className="w-2.5 h-2.5 animate-spin" /> Saving...
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn("h-9 px-4 font-bold border-dashed", !showPreview && "bg-primary/5 border-primary/30")}
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showPreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                    <div className="h-4 w-px bg-border mx-2" />
                    <ExportActions />
                </div>
            </header>

            {/* Split Screen Workspace */}
            <main className="flex-1 flex overflow-hidden">
                {/* Form Editor Column */}
                <div className={cn(
                    "flex-1 overflow-y-auto scrollbar-thin p-8 transition-all duration-500 ease-in-out",
                    showPreview ? "max-w-3xl border-r border-border/50" : "max-w-5xl mx-auto"
                )}>
                    <div className="space-y-10 pb-20">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tighter">Studio Layout</h1>
                            <p className="text-muted-foreground text-sm max-w-lg">
                                Refine every detail of your profile.
                            </p>
                        </div>
                        <CvForm />
                    </div>
                </div>

                {/* Preview Column */}
                {showPreview && (
                    <div className="flex-1 bg-muted/20 dark:bg-black/20 overflow-y-auto scrollbar-thin p-8 shadow-inner">
                        <div className="max-w-3xl mx-auto">
                            <div className="mb-6 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                <span className="flex items-center gap-2">
                                    <span className="w-1 h-3 bg-primary/40 rounded-full" />
                                    Render Engine
                                </span>
                                <span className="flex items-center gap-1.5 opacity-60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    Live
                                </span>
                            </div>
                            <div className="shadow-2xl shadow-primary/5 rounded-xl border border-border/50 bg-white dark:bg-neutral-900 min-h-[1100px] overflow-hidden">
                                <CvPreview />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
