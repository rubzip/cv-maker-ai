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
        <div className="max-w-6xl mx-auto space-y-10 pb-12">
            {/* Hero Section - General Welcome */}
            <section className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-card border border-border/50 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" />
                            Control Center
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">
                            Build Your Professional Future
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                            Organize your resumes, track job opportunities, and adapt your profile for every application with AI.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start pt-2">
                            <Link to="/editor/new">
                                <Button className="h-11 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
                                    Create New Resume
                                </Button>
                            </Link>
                            <Link to="/cvs">
                                <Button variant="outline" className="h-11 px-8 rounded-xl font-bold">
                                    Browse Library
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Jobs */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <h2 className="font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Tracked Opportunities</h2>
                        </div>
                        <Link to="/jobs" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            View all <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {jobsLoading ? (
                            <div className="h-40 flex items-center justify-center bg-muted/20 rounded-xl border border-dashed border-border">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : recentJobs.length === 0 ? (
                            <div className="p-8 text-center bg-muted/20 rounded-xl border border-dashed border-border space-y-3">
                                <p className="text-sm text-muted-foreground">No jobs tracked yet.</p>
                                <Button variant="outline" size="sm" className="text-[10px] font-bold h-8">Capture with Extension</Button>
                            </div>
                        ) : (
                            recentJobs.map((job) => (
                                <div key={job.id} className="group p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors flex items-center justify-between cursor-pointer shadow-sm">
                                    <div className="space-y-1">
                                        <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{job.title}</p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{job.company}</p>
                                    </div>
                                    <Button size="icon" variant="ghost" className="rounded-md opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
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
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <History className="w-5 h-5" />
                            </div>
                            <h2 className="font-bold tracking-tight">Recent Resumes</h2>
                        </div>
                        <Link to="/cvs" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            Library <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {cvsLoading ? (
                            <div className="h-40 flex items-center justify-center bg-muted/20 rounded-xl border border-dashed border-border">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : recentCvs.length === 0 ? (
                            <div className="p-8 text-center bg-muted/20 rounded-xl border border-dashed border-border space-y-3">
                                <p className="text-sm text-muted-foreground">No resumes found.</p>
                                <p className="text-[10px] text-muted-foreground italic uppercase tracking-tighter">Start by creating your first resume.</p>
                            </div>
                        ) : (
                            recentCvs.map((resume) => (
                                <Link key={resume.id} to={`/editor/${resume.id}`} className="block">
                                    <div className="group p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors flex items-center justify-between shadow-sm">
                                        <div className="space-y-1">
                                            <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{resume.name}</p>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3 text-neutral-400" />
                                                <span className="text-[10px] text-neutral-500 dark:text-neutral-500 font-medium uppercase tracking-wider">
                                                    Updated {new Date(resume.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-all" />
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
