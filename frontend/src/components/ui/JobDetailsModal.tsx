import { X, Briefcase, Building2, Link as LinkIcon } from "lucide-react"
import { Button } from "./Button"
import type { JobPositionRecord } from "../../types/cv"

interface JobDetailsModalProps {
    job: JobPositionRecord | null
    isOpen: boolean
    onClose: () => void
}

export function JobDetailsModal({ job, isOpen, onClose }: JobDetailsModalProps) {
    if (!isOpen || !job) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-border bg-muted/20 flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight text-foreground line-clamp-1">{job.data.title}</h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                <Building2 className="w-4 h-4" />
                                <span>{job.data.company}</span>
                                {job.data.url && (
                                    <>
                                        <span className="opacity-30">•</span>
                                        <a
                                            href={job.data.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-primary hover:underline flex items-center gap-1"
                                        >
                                            <LinkIcon className="w-3 h-3" />
                                            Source
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Job Description</h3>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                    {job.data.full_description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
                    <Button onClick={onClose} variant="secondary" className="font-bold px-8">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}
