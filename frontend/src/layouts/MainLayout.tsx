import { Outlet, Link, useLocation } from "react-router-dom"
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Sparkles,
    ChevronLeft,
    Plus,
    Moon,
    Sun
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/Button"

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: FileText, label: "My Resumes", path: "/cvs" },
    { icon: Briefcase, label: "My Job Offers", path: "/jobs" },
]

export function MainLayout() {
    const location = useLocation()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("theme")
            return (saved as "light" | "dark") || "dark"
        }
        return "dark"
    })

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark")
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        document.documentElement.classList.toggle("dark", newTheme === "dark")
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 ease-in-out z-50 shadow-sm",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                {/* Logo Section */}
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    {!isCollapsed && (
                        <span className="font-bold tracking-tight text-lg truncate">CV Maker AI</span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group overflow-hidden",
                                location.pathname === item.path
                                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm"
                                    : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100"
                            )}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!isCollapsed && (
                                <span className="font-medium text-sm truncate">{item.label}</span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Footer Actions */}
                <div className="p-3 border-t border-border space-y-1">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all overflow-hidden"
                    >
                        {theme === "light" ? <Moon className="w-5 h-5 shrink-0" /> : <Sun className="w-5 h-5 shrink-0" />}
                        {!isCollapsed && <span className="text-sm font-medium">Switch Theme</span>}
                    </button>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all overflow-hidden"
                    >
                        <ChevronLeft className={cn("w-5 h-5 transition-transform shrink-0", isCollapsed && "rotate-180")} />
                        {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden flex flex-col min-w-0">
                <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-between px-8 shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        <h2 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                            {navItems.find(n => n.path === location.pathname)?.label || "Studio"}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" className="h-9">
                            <Plus className="w-4 h-4 mr-2" /> New Job
                        </Button>
                        <Link to="/editor/new">
                            <Button size="sm" className="h-9">
                                <Plus className="w-4 h-4 mr-2" /> New Resume
                            </Button>
                        </Link>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
