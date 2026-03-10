import { useEffect, useState } from "react"
import { FileText, X, Loader2, Sparkles } from "lucide-react"
import { useCvStore } from "../../store/useCvStore"
import { Button } from "./Button"
import { cn } from "../../lib/utils"

interface CvSelectionModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (cvId: number) => void
    isOptimizing?: boolean
}

export function CvSelectionModal({ isOpen, onClose, onSelect, isOptimizing }: CvSelectionModalProps) {
    const { cvs, fetchCvs, isLoading } = useCvStore()
    const [selectedId, setSelectedId] = useState<number | null>(null)

    useEffect(() => {
        if (isOpen) {
            fetchCvs()
        }
    }, [isOpen, fetchCvs])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">Select Base Resume</h2>
                            <p className="text-xs text-muted-foreground font-medium">Choose a resume to optimize for this position.</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} disabled={isOptimizing}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="p-4 max-h-[400px] overflow-y-auto space-y-2 scrollbar-thin">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="text-sm font-bold tracking-wide uppercase">Fetching Library...</span>
                        </div>
                    ) : cvs.length === 0 ? (
                        <div className="text-center py-12 px-6 space-y-3">
                            <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto">
                                <FileText className="w-8 h-8 text-muted-foreground/30" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">No resumes found. Please create one first.</p>
                        </div>
                    ) : (
                        cvs.map((cv) => (
                            <div
                                key={cv.id}
                                onClick={() => !isOptimizing && setSelectedId(cv.id)}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group",
                                    selectedId === cv.id
                                        ? "bg-primary/5 border-primary shadow-sm"
                                        : "bg-transparent border-border/50 hover:bg-muted/50 hover:border-border"
                                )}
                            >
                                <div className={cn(
                                    "p-2.5 rounded-lg transition-colors",
                                    selectedId === cv.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary"
                                )}>
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{cv.name || "Untitled Resume"}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">
                                        Last edited {new Date(cv.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    selectedId === cv.id ? "border-primary bg-primary" : "border-muted-foreground/20"
                                )}>
                                    {selectedId === cv.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-border bg-muted/20 flex gap-3">
                    <Button variant="ghost" onClick={onClose} className="flex-1 font-bold" disabled={isOptimizing}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => selectedId && onSelect(selectedId)}
                        disabled={!selectedId || isOptimizing}
                        className="flex-1 font-bold shadow-lg shadow-primary/20"
                    >
                        {isOptimizing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Optimizing...
                            </>
                        ) : (
                            "Start Optimization"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
