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
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight">Resume Library</h1>
                    <p className="text-muted-foreground text-sm">Manage all your resume versions in one place.</p>
                </div>
                <Link to="/editor/new">
                    <Button className="font-bold shadow-lg shadow-primary/10">
                        <Plus className="w-4 h-4 mr-2" /> Create New Resume
                    </Button>
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="w-full pl-10 pr-4 py-2 bg-card border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-muted/20 animate-pulse rounded-2xl border border-border/50"></div>
                    ))}
                </div>
            ) : filteredCvs.length === 0 ? (
                <div className="py-20 text-center bg-muted/10 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-muted/40 rounded-full">
                        <FileText className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold text-lg">No results found</p>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">Try a different search term or create a new resume.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCvs.map((cv) => {
                        return (
                            <div
                                key={cv.id}
                                className="group relative flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className="p-6 space-y-4 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="p-2.5 rounded-xl bg-muted text-muted-foreground">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors truncate">
                                            {cv.name || "Untitled Resume"}
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                            Last edited {new Date(cv.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors" onClick={() => handleDelete(cv.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" onClick={() => duplicateCv(cv.id)}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <Link to={`/editor/${cv.id}`}>
                                        <Button size="sm" variant="secondary" className="h-8 px-4 font-bold text-[10px] uppercase tracking-widest border border-border/50">
                                            Edit <ArrowUpRight className="ml-1 w-3 h-3" />
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
