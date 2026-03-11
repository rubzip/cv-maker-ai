import { Sparkles, Info, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { cn } from "../../lib/utils"

interface AiInsightsProps {
    reasoning: string | undefined
}

export function AiInsights({ reasoning }: AiInsightsProps) {
    const [isExpanded, setIsExpanded] = useState(true)

    if (!reasoning) return null

    return (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className={cn(
                "group relative overflow-hidden rounded-2xl border transition-all duration-300",
                "bg-gradient-to-br from-primary/[0.03] to-primary/[0.01] border-primary/20 shadow-sm",
                "hover:shadow-md hover:border-primary/30"
            )}>
                {/* Decorative background sparkle */}
                <div className="absolute -right-4 -top-4 text-primary/5 rotate-12 transition-transform group-hover:scale-110">
                    <Sparkles size={120} />
                </div>

                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Sparkles size={18} className="animate-pulse" />
                            </div>
                            <h3 className="font-black tracking-tight text-foreground flex items-center gap-2">
                                AI Optimization Strategy
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[10px] text-primary uppercase tracking-widest font-bold">
                                    Strategic
                                </span>
                            </h3>
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1.5 rounded-full hover:bg-primary/10 text-muted-foreground transition-colors"
                        >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>

                    <div className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                    )}>
                        <div className="overflow-hidden">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-card/50 border border-border/50 text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap italic">
                                    <Info size={16} className="shrink-0 mt-0.5 text-primary/60" />
                                    {reasoning}
                                </div>
                            </div>
                            <p className="mt-4 text-[10px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                Review these insights to understand the tailoring logic
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
