import { useEffect, useState } from "react"
import {
    Briefcase,
    Plus,
    Search,
    Trash2,
    Sparkles,
    ExternalLink,
    X,
    Link as LinkIcon
} from "lucide-react"
import { listJobs, deleteJob, saveJob, getCv, refineCv, saveCv } from "../lib/api"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { CvSelectionModal } from "../components/ui/CvSelectionModal"
import { JobDetailsModal } from "../components/ui/JobDetailsModal"
import { useNavigate } from "react-router-dom"

import type { JobPositionRecord, JobPosition } from "../types/cv"

export default function JobTracker() {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState<JobPositionRecord[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOptimizing, setIsOptimizing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddingJob, setIsAddingJob] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [selectedJob, setSelectedJob] = useState<JobPositionRecord | null>(null)
    const [jobToView, setJobToView] = useState<JobPositionRecord | null>(null)
    const [newJob, setNewJob] = useState<JobPosition>({
        title: "",
        company: "",
        url: "",
        full_description: ""
    })

    const fetchJobs = async () => {
        setIsLoading(true)
        try {
            const data = await listJobs()
            setJobs(data)
        } catch (err) {
            console.error("Failed to fetch jobs:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    const handleDelete = async (id: number | undefined) => {
        if (id !== undefined && confirm("Are you sure you want to delete this job offer?")) {
            try {
                await deleteJob(id)
                fetchJobs()
            } catch (err: unknown) {
                console.error("Delete failed:", err)
                alert("Failed to delete the offer")
            }
        }
    }

    const handleSaveJob = async () => {
        if (!newJob.title || !newJob.company || !newJob.full_description) {
            alert("Title, Company and Description are required")
            return
        }

        try {
            await saveJob(newJob)
            setIsAddingJob(false)
            setNewJob({ title: "", company: "", url: "", full_description: "" })
            fetchJobs()
        } catch (err) {
            console.error("Failed to save job:", err)
            alert("Failed to save job")
        }
    }

    const handleAdaptStart = (job: JobPositionRecord) => {
        setSelectedJob(job)
        setIsModalOpen(true)
    }

    const handleViewDetails = (job: JobPositionRecord) => {
        setJobToView(job)
        setIsDetailsOpen(true)
    }

    const handleSelectCv = async (cvId: number) => {
        if (!selectedJob) return

        setIsOptimizing(true)
        try {
            // 1. Get the base CV
            const baseCvRecord = await getCv(cvId)

            // 2. Call refinement API
            const { cv: refinedCv, reasoning: _reasoning } = await refineCv(baseCvRecord.data, selectedJob.data)

            // 3. Save as new CV with reasoning
            const savedCv = await saveCv({
                ...refinedCv,
                name: `Optimized: ${selectedJob.data.company} - ${selectedJob.data.title}`
            }, _reasoning)

            // 4. Redirect to editor
            navigate(`/editor/${savedCv.id}`)
        } catch (err) {
            console.error("Adaptation failed:", err)
            alert("Failed to optimize resume. Please try again.")
        } finally {
            setIsOptimizing(false)
            setIsModalOpen(false)
        }
    }

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                    <h1 className="text-3xl font-black tracking-tighter">Job Tracker</h1>
                    <p className="text-muted-foreground text-sm font-medium">Coordinate your applications and generate AI-tailored iterations.</p>
                </div>
                {!isAddingJob && (
                    <Button
                        onClick={() => setIsAddingJob(true)}
                        className="font-bold shadow-xl shadow-primary/10 bg-primary text-primary-foreground h-11 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Position
                    </Button>
                )}
            </div>

            {/* Add Job Form */}
            {isAddingJob && (
                <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm md:shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-secondary text-foreground border border-border/50">
                                <Plus className="w-4 h-4" />
                            </div>
                            <h2 className="text-xl font-black tracking-tighter">New Opportunity</h2>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsAddingJob(false)} className="rounded-xl hover:bg-secondary">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Job Title</label>
                            <Input
                                placeholder="e.g. Lead Designer"
                                value={newJob.title}
                                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                className="bg-secondary/50 border-border/50 h-12 text-base rounded-xl focus:ring-primary focus:border-primary font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Company</label>
                            <Input
                                placeholder="e.g. OpenAI"
                                value={newJob.company}
                                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                                className="bg-secondary/50 border-border/50 h-12 text-base rounded-xl focus:ring-primary focus:border-primary font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">URL (Optional)</label>
                            <Input
                                placeholder="https://..."
                                value={newJob.url}
                                onChange={(e) => setNewJob({ ...newJob, url: e.target.value })}
                                className="bg-secondary/50 border-border/50 h-12 text-base rounded-xl focus:ring-primary focus:border-primary font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 mb-10">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Job Description</label>
                        <textarea
                            placeholder="Paste the full job details..."
                            value={newJob.full_description}
                            onChange={(e) => setNewJob({ ...newJob, full_description: e.target.value })}
                            className="w-full h-48 p-5 bg-secondary/50 border border-border/50 rounded-2xl resize-none text-base font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-muted-foreground/40"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
                        <Button variant="ghost" onClick={() => setIsAddingJob(false)} className="font-bold rounded-xl h-11 px-6 hover:bg-secondary">
                            Discard
                        </Button>
                        <Button
                            onClick={handleSaveJob}
                            disabled={!newJob.title || !newJob.company || !newJob.full_description}
                            className="bg-primary text-primary-foreground font-bold px-8 h-11 rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Save Opportunity
                        </Button>
                    </div>
                </div>
            )}

            {/* Search */}
            {!isAddingJob && (
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search positions or companies..."
                        className="w-full pl-12 pr-6 py-4 bg-card border border-border/50 rounded-2xl text-base font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            )}

            {/* List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-56 bg-secondary/30 animate-pulse rounded-3xl border border-border/50"></div>
                    ))}
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="py-24 text-center bg-secondary/20 rounded-3xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center space-y-6">
                    <div className="p-5 bg-card rounded-2xl border border-border/50 text-muted-foreground/30 shadow-sm">
                        <Briefcase className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                        <p className="font-black text-xl tracking-tighter">No Tracking Activity</p>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">Add a position manually or sync via our browser extension to start optimizing.</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsAddingJob(true)}
                        className="rounded-xl font-bold border-border/60 h-10 px-6 transition-all hover:bg-background"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Start Tracking
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            className="group relative bg-card border border-border/50 rounded-3xl p-7 hover:bg-secondary/40 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-6 mb-6">
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="font-black text-xl tracking-tighter truncate">
                                            {job.title}
                                        </h3>
                                        <div className="h-1.5 w-1.5 rounded-full bg-border/50" />
                                        <span className="font-bold text-sm text-muted-foreground/60 tracking-tight">{job.company}</span>
                                    </div>
                                    {job.data.url && (
                                        <a
                                            href={job.data.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary transition-colors"
                                        >
                                            <LinkIcon className="w-3 h-3 mr-1.5" />
                                            Source Details
                                        </a>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl shrink-0"
                                    onClick={() => job.id !== undefined && handleDelete(job.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2 mb-6 min-h-[3rem]">
                                {job.data.full_description}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-border/30">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto text-primary font-black text-[10px] uppercase tracking-[0.25em] hover:bg-transparent hover:translate-x-1 transition-transform"
                                    onClick={() => handleViewDetails(job)}
                                >
                                    Review Specs →
                                </Button>
                                <Button
                                    className="h-10 px-6 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={() => handleAdaptStart(job)}
                                >
                                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                                    Adapt
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CvSelectionModal
                isOpen={isModalOpen}
                isOptimizing={isOptimizing}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectCv}
            />

            <JobDetailsModal
                job={jobToView}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
            />

            {/* Hint Box */}
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-start gap-4">
                <div className="p-2.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800">
                    <ExternalLink className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-semibold text-base tracking-tight text-neutral-900 dark:text-neutral-100">Level up your workflow</h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl">
                        Stop copying and pasting. Use our browser extension to scrape job details from LinkedIn, Indeed, or Glassdoor. All data syncs instantly here.
                    </p>
                </div>
            </div>
        </div>
    )
}
