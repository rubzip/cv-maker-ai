import { useCvStore } from "../../store/useCvStore"
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react"

export function CvPreview() {
    const { cv } = useCvStore()
    const { personal_info, sections, skills } = cv

    const formatDate = (date: { month: number | null; year: number } | null) => {
        if (!date) return ""
        if (!date.month || date.month === 0) return `${date.year}`
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return `${months[date.month - 1]} ${date.year}`
    }

    return (
        <div className="bg-card text-card-foreground border border-border shadow-xl rounded-lg overflow-hidden min-h-[1100px] w-full max-w-[800px] mx-auto p-12 font-sans transition-all duration-300">
            {/* Header */}
            <header className="space-y-4 pb-8 border-b border-border/50">
                <h1 className="text-4xl font-bold tracking-tight text-primary">{personal_info.name || "Your Name"}</h1>
                <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-muted-foreground">
                    {personal_info.email && (
                        <div className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-primary/70" />
                            <span>{personal_info.email}</span>
                        </div>
                    )}
                    {personal_info.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-primary/70" />
                            <span>{personal_info.phone}</span>
                        </div>
                    )}
                    {personal_info.address && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-primary/70" />
                            <span>{personal_info.address}</span>
                        </div>
                    )}
                    {personal_info.website && (
                        <div className="flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-primary/70" />
                            <span>{personal_info.website.replace(/^https?:\/\//, "")}</span>
                        </div>
                    )}
                    {personal_info.social_networks.map((sn, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            {sn.network.toLowerCase().includes("github") && <ExternalLink className="w-4 h-4 text-primary/70" />}
                            {sn.network.toLowerCase().includes("linkedin") && <ExternalLink className="w-4 h-4 text-primary/70" />}
                            {!sn.network.toLowerCase().includes("github") && !sn.network.toLowerCase().includes("linkedin") && <ExternalLink className="w-4 h-4 text-primary/70" />}
                            <span>{sn.username.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        </div>
                    ))}
                </div>
                {personal_info.about && (
                    <p className="text-sm leading-relaxed text-muted-foreground/90">
                        {personal_info.about}
                    </p>
                )}
            </header>

            {/* Sections */}
            <div className="mt-10 space-y-12">
                {sections.map((section, sIndex) => (
                    <section key={sIndex} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary whitespace-nowrap">
                                {section.title}
                            </h2>
                            <div className="h-px w-full bg-gradient-to-r from-primary/20 to-transparent" />
                        </div>
                        <div className="space-y-8">
                            {section.content.map((exp, eIndex) => (
                                <div key={eIndex} className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg text-card-foreground">{exp.name}</h3>
                                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                <span>{exp.institution}</span>
                                                {exp.location && (
                                                    <>
                                                        <span className="text-muted-foreground/30">•</span>
                                                        <span>{exp.location}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-muted-foreground/70 tabular-nums">
                                            {(() => {
                                                const start = exp.interval?.start_date;
                                                const end = exp.interval?.end_date;
                                                const hasStart = start && start.year !== 0;
                                                const hasEnd = end && end.year !== 0;

                                                if (!hasStart && !hasEnd) return null;

                                                return (
                                                    <>
                                                        {hasStart ? formatDate(start) : ""}
                                                        {hasStart && hasEnd ? " — " : ""}
                                                        {hasEnd ? formatDate(end) : (hasStart ? " — Present" : "")}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    {exp.url && (
                                        <a href={exp.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors">
                                            <ExternalLink className="w-3 h-3" />
                                            {exp.url.replace(/^https?:\/\//, "")}
                                        </a>
                                    )}
                                    {exp.description.length > 0 && (
                                        <ul className="list-disc list-outside ml-4 space-y-1.5">
                                            {exp.description.map((bullet, bIndex) => bullet.trim() && (
                                                <li key={bIndex} className="text-sm text-card-foreground/80 leading-relaxed pl-1">
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
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary whitespace-nowrap">
                                Skills
                            </h2>
                            <div className="h-px w-full bg-gradient-to-r from-primary/20 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 gap-y-4">
                            {skills.map((group, index) => (group.skill_group || group.skills.length > 0) && (
                                <div key={index} className="flex gap-4">
                                    <span className="text-sm font-semibold w-32 shrink-0">{group.skill_group}:</span>
                                    <span className="text-sm text-card-foreground/80">{group.skills.join(", ")}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
