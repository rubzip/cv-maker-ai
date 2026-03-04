import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button, cn } from "./Button"

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>(
        () => (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
    )

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
            <Button
                variant={theme === 'light' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setTheme('light')}
                title="Light Mode"
            >
                <Sun className={cn("h-4 w-4", theme === 'light' ? "text-primary" : "text-muted-foreground")} />
            </Button>
            <Button
                variant={theme === 'dark' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setTheme('dark')}
                title="Dark Mode"
            >
                <Moon className={cn("h-4 w-4", theme === 'dark' ? "text-primary" : "text-muted-foreground")} />
            </Button>
        </div>
    )
}
