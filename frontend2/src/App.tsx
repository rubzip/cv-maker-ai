import { CvForm } from "./components/form/CvForm"
import { CvPreview } from "./components/preview/CvPreview"
import { ThemeToggle } from "./components/ui/ThemeToggle"
import { Button } from "./components/ui/Button"
import { Download, Share2, Sparkles } from "lucide-react"

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white dark:text-neutral-900" />
            </div>
            <span className="font-bold tracking-tight text-lg">CV Maker AI</span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-2" />
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" /> Export PDF
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 min-h-[calc(100vh-64px)]">
        {/* Form Container */}
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-160px)] pr-4 scrollbar-thin">
          <div className="space-y-1 mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Builder</h1>
            <p className="text-sm text-neutral-500">Fill in your professional details to build your precision CV.</p>
          </div>
          <CvForm />
        </div>

        {/* Preview Container */}
        <div className="hidden lg:block bg-neutral-100 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 overflow-y-auto max-h-[calc(100vh-160px)] shadow-inner">
          <div className="mb-4 flex items-center justify-between text-xs font-medium text-neutral-500 uppercase tracking-widest">
            <span>Real-time Preview</span>
            <span>A4 Format</span>
          </div>
          <CvPreview />
        </div>
      </main>
    </div>
  )
}

export default App
