import { useEffect } from "react"
import { FileText, Trash2, Plus, Clock, Loader2, Database } from "lucide-react"
import { useCvStore } from "../../store/useCvStore"
import { Button } from "../ui/Button"
import { cn } from "../../lib/utils"
import { deleteCv } from "../../lib/api"

export function CvSidebar() {
    const { cvs, cvId, isLoading, fetchCvs, setCv, setCvId, resetCv } = useCvStore()

    useEffect(() => {
        fetchCvs()
    }, [fetchCvs])

    const handleLoad = (item: any) => {
        setCv(item.data)
        setCvId(item.id)
    }

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation()
        if (confirm("Are you sure you want to delete this CV?")) {
            try {
                await deleteCv(id)
                if (cvId === id) resetCv()
                fetchCvs()
            } catch (error) {
                console.error("Failed to delete CV:", error)
                alert("Failed to delete CV")
            }
        }
    }

    return (
        <aside className="w-80 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col h-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    <h2 className="font-bold tracking-tight text-sm uppercase">My Library</h2>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => resetCv()}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
                {isLoading && cvs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs font-medium">Loading library...</span>
                    </div>
                ) : cvs.length === 0 ? (
                    <div className="text-center py-10 px-4">
                        <p className="text-xs text-muted-foreground">No CVs found in your library. Create your first one!</p>
                    </div>
                ) : (
                    cvs.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleLoad(item)}
                            className={cn(
                                "group relative flex flex-col gap-1 p-3 rounded-xl border transition-all cursor-pointer",
                                cvId === item.id
                                    ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20"
                                    : "bg-transparent border-transparent hover:bg-muted/30 hover:border-border"
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <FileText className={cn(
                                        "w-4 h-4 shrink-0",
                                        cvId === item.id ? "text-primary" : "text-muted-foreground"
                                    )} />
                                    <span className="font-semibold text-sm truncate">
                                        {item.name || "Untitled CV"}
                                    </span>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={(e) => handleDelete(e, item.id)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                <span className="text-[8px] opacity-30">•</span>
                                <span className="uppercase tracking-wider">v1.0</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t border-border bg-muted/20">
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Local Identity</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                        All data is stored in your private PostgreSQL instance.
                    </p>
                </div>
            </div>
        </aside>
    )
}
