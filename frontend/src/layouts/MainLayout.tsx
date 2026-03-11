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
                    "flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out z-50",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                {/* Logo Section */}
                <div className="p-6 flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    {!isCollapsed && (
                        <span className="font-black tracking-tighter text-xl">Studio</span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1.5 mt-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group overflow-hidden",
                                location.pathname === item.path
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", location.pathname === item.path ? "text-primary-foreground" : "text-muted-foreground")} />
                            {!isCollapsed && (
                                <span className="font-bold text-sm truncate tracking-tight">{item.label}</span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Footer Actions */}
                <div className="p-3 border-t border-border space-y-1 bg-secondary/30">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all overflow-hidden"
                    >
                        {theme === "light" ? <Moon className="w-5 h-5 shrink-0" /> : <Sun className="w-5 h-5 shrink-0" />}
                        {!isCollapsed && <span className="text-sm font-bold tracking-tight">Switch Theme</span>}
                    </button>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all overflow-hidden"
                    >
                        <ChevronLeft className={cn("w-5 h-5 transition-transform shrink-0", isCollapsed && "rotate-180")} />
                        {!isCollapsed && <span className="text-sm font-bold tracking-tight">Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden flex flex-col min-w-0">
                <header className="h-20 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-none mb-1">
                                {navItems.find(n => n.path === location.pathname)?.label || "Studio"}
                            </h2>
                            <p className="text-xl font-black tracking-tighter">
                                {location.pathname === "/" ? "Overview" :
                                    location.pathname === "/cvs" ? "Library" :
                                        location.pathname === "/jobs" ? "Tracker" : "Editor"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl font-bold border-border/50 hover:bg-secondary">
                            <Plus className="w-4 h-4 mr-2" /> New Job
                        </Button>
                        <Link to="/editor/new">
                            <Button size="sm" className="h-10 px-5 rounded-xl font-bold shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
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
