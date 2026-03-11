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
        <div className="max-w-6xl mx-auto space-y-8 pb-12 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight">Job Tracker</h1>
                    <p className="text-muted-foreground text-sm">Manage tracked opportunities and create AI adaptations.</p>
                </div>
                {!isAddingJob && (
                    <Button
                        onClick={() => setIsAddingJob(true)}
                        className="font-semibold shadow-sm bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Job Manually
                    </Button>
                )}
            </div>

            {/* Add Job Form */}
            {isAddingJob && (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 shadow-sm md:shadow-md animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800">
                                <Plus className="w-4 h-4 text-neutral-900 dark:text-neutral-50" />
                            </div>
                            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">New Job Position</h2>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsAddingJob(false)} className="rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            <X className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 px-0.5">Job Title</label>
                            <Input
                                placeholder="e.g. Senior Frontend Developer"
                                value={newJob.title}
                                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                className="bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 h-10 text-sm rounded-md focus:ring-neutral-400 focus:border-neutral-400"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 px-0.5">Company</label>
                            <Input
                                placeholder="e.g. Google"
                                value={newJob.company}
                                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                                className="bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 h-10 text-sm rounded-md focus:ring-neutral-400 focus:border-neutral-400"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 px-0.5">URL (Optional)</label>
                            <Input
                                placeholder="https://linkedin.com/jobs/..."
                                value={newJob.url}
                                onChange={(e) => setNewJob({ ...newJob, url: e.target.value })}
                                className="bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 h-10 text-sm rounded-md focus:ring-neutral-400 focus:border-neutral-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 mb-8">
                        <label className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 px-0.5">Job Description</label>
                        <textarea
                            placeholder="Paste the full job description here..."
                            value={newJob.full_description}
                            onChange={(e) => setNewJob({ ...newJob, full_description: e.target.value })}
                            className="w-full h-40 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md resize-none text-sm focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 focus:outline-none transition-colors placeholder:text-neutral-400"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                        <Button variant="ghost" onClick={() => setIsAddingJob(false)} className="font-medium rounded-md h-9 px-4">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveJob}
                            disabled={!newJob.title || !newJob.company || !newJob.full_description}
                            className="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 text-white font-medium px-6 h-9 rounded-md shadow-sm disabled:opacity-50 transition-colors"
                        >
                            Save Position
                        </Button>
                    </div>
                </div>
            )}

            {/* Search */}
            {!isAddingJob && (
                <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-100 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search jobs by title or company..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-700 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            )}

            {/* List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-lg border border-neutral-200 dark:border-neutral-800"></div>
                    ))}
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="py-20 text-center bg-neutral-50 dark:bg-neutral-950/50 rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-md text-neutral-400">
                        <Briefcase className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-neutral-100">No positions found</p>
                        <p className="text-sm text-neutral-500 max-w-xs mx-auto">Add your first job manually or use our extension to auto-capture details.</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setIsAddingJob(true)}
                        className="rounded-md font-medium border-neutral-200 dark:border-neutral-800 transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5 mr-2" /> Start now
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-150"
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="space-y-1 flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-neutral-100">
                                            {job.title}
                                        </h3>
                                        <span className="text-neutral-300 dark:text-neutral-700 font-medium">/</span>
                                        <span className="font-medium text-sm text-neutral-600 dark:text-neutral-400">{job.company}</span>
                                    </div>
                                    {job.data.url && (
                                        <a
                                            href={job.data.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
                                        >
                                            <LinkIcon className="w-3 h-3 mr-1" />
                                            View Source
                                        </a>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-red-950/20 transition-all rounded-md shrink-0 focus:ring-red-500"
                                    onClick={() => job.id !== undefined && handleDelete(job.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2 mb-4 min-h-[2.5rem]">
                                {job.data.full_description}
                            </p>

                            <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto text-primary font-bold text-xs uppercase tracking-tighter hover:no-underline mb-6"
                                onClick={() => handleViewDetails(job)}
                            >
                                Read Full Description →
                            </Button>

                            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800/50">
                                <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                                    Added {new Date(job.created_at).toLocaleDateString()}
                                </span>
                                <Button
                                    className="h-9 px-5 rounded-md font-semibold bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white shadow-sm transition-all focus:ring-2 focus:ring-neutral-400"
                                    onClick={() => handleAdaptStart(job)}
                                >
                                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                                    Adapt Resume
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
