import * as React from "react"
import { Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"

interface FormCardProps {
    title: string
    description?: string
    icon?: React.ComponentType<{ className?: string }>
    onTitleChange?: (value: string) => void
    onRemove?: () => void
    children: React.ReactNode
    placeholder?: string
}

export function FormCard({ title, description, icon: Icon, onTitleChange, onRemove, children, placeholder }: FormCardProps) {
    const [isExpanded, setIsExpanded] = React.useState(true)

    return (
        <Card className="overflow-hidden border-transparent hover:border-border bg-transparent hover:bg-card/50 transition-all duration-300">
            <div className="flex items-center justify-between p-4 bg-transparent group/header">
                <div className="flex items-center gap-3 flex-1">
                    {Icon && (
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="w-4 h-4 text-primary" />
                        </div>
                    )}
                    <div className="flex flex-col flex-1">
                        {onTitleChange ? (
                            <Input
                                value={title}
                                onChange={(e) => onTitleChange?.(e.target.value)}
                                placeholder={placeholder}
                                className="font-bold text-lg border-none bg-transparent focus-visible:ring-0 px-0 h-auto placeholder:text-muted-foreground/60 hover:placeholder:text-muted-foreground/80 transition-all shadow-none"
                            />
                        ) : (
                            <h3 className="font-bold text-lg text-foreground">{title}</h3>
                        )}
                        {description && <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">{description}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    {onRemove && (
                        <Button variant="ghost" size="icon" onClick={onRemove} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="p-6 pt-0 space-y-6">
                    {children}
                </div>
            )}
        </Card>
    )
}
