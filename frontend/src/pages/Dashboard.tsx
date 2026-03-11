import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
    Briefcase,
    Clock,
    ArrowRight,
    History,
    Sparkles,
    ChevronRight,
    Loader2
} from "lucide-react"
import { useCvStore } from "../store/useCvStore"
import { listJobs } from "../lib/api"
import { Button } from "../components/ui/Button"
import type { JobPositionRecord } from "../types/cv"

export default function Dashboard() {
    const { cvs, fetchCvs, isLoading: cvsLoading } = useCvStore()
    const [jobs, setJobs] = useState<JobPositionRecord[]>([])
    const [jobsLoading, setJobsLoading] = useState(false)

    useEffect(() => {
        fetchCvs()

        const loadJobs = async () => {
            setJobsLoading(true)
            try {
                const data = await listJobs()
                setJobs(data)
            } catch (err) {
                console.error("Failed to load jobs:", err)
            } finally {
                setJobsLoading(false)
            }
        }
        loadJobs()
    }, [fetchCvs])

    const recentCvs = cvs.slice(0, 4)
    const recentJobs = jobs.slice(0, 3)

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Hero Section - General Welcome */}
            <section className="relative group overflow-hidden rounded-3xl border border-border/50 bg-card p-10 shadow-sm transition-all hover:shadow-md">
                <div className="absolute -right-20 -top-20 text-primary/[0.03] rotate-12 transition-transform group-hover:scale-110">
                    <Sparkles size={300} />
                </div>

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-6 text-center md:text-left max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                            <Sparkles className="w-3 h-3" />
                            Command Center
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter leading-[0.9]">
                            Elevate Your <br />
                            <span className="text-muted-foreground/40">Professional Brand.</span>
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                            Manage your portfolio, track opportunities, and harness AI to tailor <br className="hidden lg:block" /> your profile for every milestone.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start pt-4">
                            <Link to="/editor/new">
                                <Button className="h-12 px-8 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                    Create New Resume
                                </Button>
                            </Link>
                            <Link to="/cvs">
                                <Button variant="outline" className="h-12 px-8 rounded-xl font-bold border-border/60 hover:bg-secondary">
                                    Resume Library
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Tracked Opportunities */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-secondary text-foreground border border-border/50">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black tracking-tighter">Opportunities</h2>
                        </div>
                        <Link to="/jobs" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1.5 p-2 bg-primary/5 rounded-lg transition-colors">
                            View Tracker <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {jobsLoading ? (
                            <div className="h-48 flex items-center justify-center bg-secondary/30 rounded-2xl border border-dashed border-border/50">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/40" />
                            </div>
                        ) : recentJobs.length === 0 ? (
                            <div className="p-10 text-center bg-secondary/30 rounded-2xl border border-dashed border-border/50 space-y-4">
                                <p className="text-sm font-medium text-muted-foreground">No tracking activity yet.</p>
                                <Button variant="outline" size="sm" className="text-[10px] font-black h-9 rounded-lg border-border/50">
                                    GET EXTENSION
                                </Button>
                            </div>
                        ) : (
                            recentJobs.map((job) => (
                                <div key={job.id} className="group p-5 bg-card border border-border/50 rounded-2xl hover:bg-secondary transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center justify-between">
                                    <div className="space-y-1.5 overflow-hidden">
                                        <p className="font-bold text-base text-foreground tracking-tight truncate">{job.title}</p>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{job.company}</p>
                                    </div>
                                    <Button size="icon" variant="ghost" className="rounded-xl opacity-0 group-hover:opacity-100 transition-all h-10 w-10 bg-background shadow-sm border border-border/30">
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Recent Resumes */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-primary/5 text-primary border border-primary/10">
                                <History className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black tracking-tighter">Recent Iterations</h2>
                        </div>
                        <Link to="/cvs" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1.5 p-2 bg-primary/5 rounded-lg transition-colors">
                            Full Library <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {cvsLoading ? (
                            <div className="h-48 flex items-center justify-center bg-secondary/30 rounded-2xl border border-dashed border-border/50">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/40" />
                            </div>
                        ) : recentCvs.length === 0 ? (
                            <div className="p-10 text-center bg-secondary/30 rounded-2xl border border-dashed border-border/50 space-y-4">
                                <p className="text-sm font-medium text-muted-foreground">Your library is currently empty.</p>
                                <Link to="/editor/new">
                                    <Button size="sm" className="text-[10px] font-black h-9 rounded-lg">
                                        CREATE FIRST VERSION
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            recentCvs.map((resume) => (
                                <Link key={resume.id} to={`/editor/${resume.id}`} className="block">
                                    <div className="group p-5 bg-card border border-border/50 rounded-2xl hover:bg-secondary transition-all shadow-sm hover:shadow-md flex items-center justify-between">
                                        <div className="space-y-1.5 overflow-hidden">
                                            <p className="font-bold text-base text-foreground tracking-tight truncate">{resume.name}</p>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3 text-muted-foreground/40" />
                                                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em]">
                                                    {new Date(resume.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-10 w-10 bg-background rounded-xl border border-border/30 shadow-sm flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
