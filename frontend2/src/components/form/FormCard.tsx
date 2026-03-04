import * as React from "react"
import { Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react"
import { Card } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { DragHandle } from "../ui/SortableItem"

interface FormCardProps {
    title: string
    onTitleChange: (value: string) => void
    onRemove: () => void
    children: React.ReactNode
    placeholder?: string
}

export function FormCard({ title, onTitleChange, onRemove, children, placeholder }: FormCardProps) {
    const [isExpanded, setIsExpanded] = React.useState(true)

    return (
        <Card className="overflow-hidden border-transparent hover:border-border bg-transparent hover:bg-card/50 transition-all duration-300">
            <div className="flex items-center justify-between p-4 bg-transparent group/header">
                <div className="flex items-center gap-3 flex-1">
                    <DragHandle className="opacity-0 group-hover/header:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4 text-muted-foreground/30" />
                    </DragHandle>
                    <Input
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder={placeholder}
                        className="max-w-[400px] font-bold text-lg border-none bg-transparent focus-visible:ring-0 px-0 h-auto placeholder:text-muted-foreground/60 hover:placeholder:text-muted-foreground/80 transition-all shadow-none"
                    />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onRemove} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                    </Button>
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
