import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
    FileText,
    Plus,
    Search,
    Copy,
    Trash2,
    ArrowUpRight,
} from "lucide-react"
import { useCvStore } from "../store/useCvStore"
import { Button } from "../components/ui/Button"
import { deleteCv } from "../lib/api"

export default function CvManager() {
    const { cvs, fetchCvs, duplicateCv, isLoading } = useCvStore()
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchCvs()
    }, [fetchCvs])

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this resume?")) {
            try {
                await deleteCv(id)
                fetchCvs()
            } catch (err) {
                console.error("Delete failed:", err)
                alert("Failed to delete the resume")
            }
        }
    }

    const filteredCvs = cvs.filter(cv =>
        cv.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                    <h1 className="text-3xl font-black tracking-tighter">Resume Library</h1>
                    <p className="text-muted-foreground text-sm font-medium">Architect and oversee your collection of professional identities.</p>
                </div>
                <Link to="/editor/new">
                    <Button className="font-bold shadow-xl shadow-primary/10 bg-primary text-primary-foreground h-11 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Plus className="w-4 h-4 mr-2" /> New Resume
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search by resume name..."
                    className="w-full pl-12 pr-6 py-4 bg-card border border-border/50 rounded-2xl text-base font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-secondary/30 animate-pulse rounded-3xl border border-border/50"></div>
                    ))}
                </div>
            ) : filteredCvs.length === 0 ? (
                <div className="py-24 text-center bg-secondary/20 rounded-3xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center space-y-6">
                    <div className="p-5 bg-card rounded-2xl border border-border/50 text-muted-foreground/30 shadow-sm">
                        <FileText className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                        <p className="font-black text-xl tracking-tighter">Library Empty</p>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">Create your first resume or refine an existing one with AI.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCvs.map((cv) => {
                        return (
                            <div
                                key={cv.id}
                                className="group relative flex flex-col bg-card border border-border/50 rounded-3xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-2"
                            >
                                <div className="p-7 space-y-6 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="p-3.5 rounded-2xl bg-secondary text-foreground border border-border/50">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-black text-xl tracking-tighter leading-tight group-hover:text-primary transition-colors truncate">
                                            {cv.name || "Untitled Resume"}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-border" />
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                                                {new Date(cv.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-7 py-5 bg-secondary/30 border-t border-border/30 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl" onClick={() => handleDelete(cv.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-all rounded-xl" onClick={() => duplicateCv(cv.id)}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <Link to={`/editor/${cv.id}`}>
                                        <Button size="sm" variant="secondary" className="h-9 px-5 font-black text-[10px] uppercase tracking-[0.2em] border border-border/60 hover:bg-card transition-all rounded-xl">
                                            Open <ArrowUpRight className="ml-2 w-3.5 h-3.5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
