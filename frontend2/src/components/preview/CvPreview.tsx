import { useCvStore } from "../../store/useCvStore"
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react"

export function CvPreview() {
    const { cv } = useCvStore()
    const { personal_info, sections, skills } = cv

    const formatDate = (date: { month: number; year: number } | null) => {
        if (!date) return ""
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return `${months[date.month - 1]} ${date.year}`
    }

    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-lg overflow-hidden min-h-[1100px] w-full max-w-[800px] mx-auto p-12 text-neutral-900 dark:text-neutral-100 font-sans">
            {/* Header */}
            <header className="space-y-4 border-b border-neutral-100 dark:border-neutral-800 pb-8">
                <h1 className="text-4xl font-bold tracking-tight">{personal_info.name || "Your Name"}</h1>
                <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-neutral-500 dark:text-neutral-400">
                    {personal_info.email && (
                        <div className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4" />
                            <span>{personal_info.email}</span>
                        </div>
                    )}
                    {personal_info.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4" />
                            <span>{personal_info.phone}</span>
                        </div>
                    )}
                    {personal_info.address && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{personal_info.address}</span>
                        </div>
                    )}
                    {personal_info.website && (
                        <div className="flex items-center gap-1.5">
                            <Globe className="w-4 h-4" />
                            <span>{personal_info.website.replace(/^https?:\/\//, "")}</span>
                        </div>
                    )}
                </div>
                {personal_info.about && (
                    <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-2xl">
                        {personal_info.about}
                    </p>
                )}
            </header>

            {/* Sections */}
            <div className="mt-8 space-y-10">
                {sections.map((section, sIndex) => (
                    <section key={sIndex} className="space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800 pb-1">
                            {section.title}
                        </h2>
                        <div className="space-y-8">
                            {section.content.map((exp, eIndex) => (
                                <div key={eIndex} className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg">{exp.name}</h3>
                                            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 font-medium">
                                                <span>{exp.institution}</span>
                                                {exp.location && (
                                                    <>
                                                        <span className="text-neutral-300">•</span>
                                                        <span>{exp.location}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 tabular-nums">
                                            {formatDate(exp.interval?.start_date ?? null)} — {exp.interval?.end_date ? formatDate(exp.interval.end_date) : "Present"}
                                        </div>
                                    </div>
                                    {exp.url && (
                                        <a href={exp.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                                            <ExternalLink className="w-3 h-3" />
                                            {exp.url.replace(/^https?:\/\//, "")}
                                        </a>
                                    )}
                                    {exp.description.length > 0 && (
                                        <ul className="list-disc list-outside ml-4 space-y-1.5">
                                            {exp.description.map((bullet, bIndex) => bullet.trim() && (
                                                <li key={bIndex} className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed pl-1">
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800 pb-1">
                            Skills
                        </h2>
                        <div className="grid grid-cols-1 gap-y-4">
                            {skills.map((group, index) => (
                                <div key={index} className="flex gap-4">
                                    <span className="text-sm font-semibold w-32 shrink-0">{group.skill_group}:</span>
                                    <span className="text-sm text-neutral-600 dark:text-neutral-300">{group.skills.join(", ")}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
