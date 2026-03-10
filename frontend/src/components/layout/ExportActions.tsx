import { useState, useRef } from "react"
import { Download, FileCode, Loader2, FileJson, Upload, Cloud } from "lucide-react"
import { Button } from "../ui/Button"
import { useCvStore } from "../../store/useCvStore"
import { generatePdf, generateTex, generateYaml, parseYaml, downloadBlob } from "../../lib/api"

export function ExportActions() {
    const [actionType, setActionType] = useState<"pdf" | "latex" | "yaml" | "import" | null>(null)
    const { cv, setCv, syncToDb, isLoading } = useCvStore()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSync = async () => {
        try {
            await syncToDb()
        } catch (error) {
            console.error("Sync failed:", error)
            alert("Failed to save to database")
        }
    }

    const handleExport = async (type: "pdf" | "latex" | "yaml") => {
        try {
            setActionType(type)
            const filenameBase = cv.personal_info.name.replace(/\s+/g, "_") || "CV"

            if (type === "pdf") {
                const blob = await generatePdf(cv)
                downloadBlob(blob, `${filenameBase}_CV.pdf`)
            } else if (type === "latex") {
                const blob = await generateTex(cv)
                downloadBlob(blob, `${filenameBase}_CV.tex`)
            } else {
                const blob = await generateYaml(cv)
                downloadBlob(blob, `${filenameBase}_CV.yaml`)
            }
        } catch (error) {
            console.error(`${type} export failed:`, error)
            alert(`Failed to export ${type.toUpperCase()}. Please try again.`)
        } finally {
            setActionType(null)
        }
    }

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            setActionType("import")
            const reader = new FileReader()
            reader.onload = async (e) => {
                const content = e.target?.result as string
                try {
                    let parsedCv
                    if (file.name.endsWith(".json")) {
                        parsedCv = JSON.parse(content)
                    } else {
                        parsedCv = await parseYaml(content)
                    }
                    setCv(parsedCv)
                } catch (err) {
                    console.error("Import failed:", err)
                    alert("Failed to import CV. Please check the file format.")
                } finally {
                    setActionType(null)
                }
            }
            reader.readAsText(file)
        } catch (error) {
            console.error("File reading failed:", error)
            alert("Failed to read file.")
            setActionType(null)
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    return (
        <div className="flex items-center gap-3">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".yaml,.yml,.json"
                className="hidden"
            />
            <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={actionType !== null}
            >
                {actionType === "import" ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Importing...
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4 mr-2" />
                        Import CV
                    </>
                )}
            </Button>

            <div className="h-4 w-px bg-border mx-2" />

            <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport("yaml")}
                disabled={actionType !== null}
            >
                {actionType === "yaml" ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Exporting...
                    </>
                ) : (
                    <>
                        <FileJson className="w-4 h-4 mr-2" />
                        YAML
                    </>
                )}
            </Button>

            <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport("latex")}
                disabled={actionType !== null}
            >
                {actionType === "latex" ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Exporting...
                    </>
                ) : (
                    <>
                        <FileCode className="w-4 h-4 mr-2" />
                        LaTeX
                    </>
                )}
            </Button>

            <Button
                size="sm"
                onClick={() => handleExport("pdf")}
                disabled={actionType !== null}
                className="bg-primary hover:bg-primary/90"
            >
                {actionType === "pdf" ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Exporting...
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                    </>
                )}
            </Button>

            <div className="h-4 w-px bg-border mx-2" />

            <Button
                size="sm"
                variant="default"
                onClick={handleSync}
                disabled={isLoading || actionType !== null}
                className="bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white shadow-sm px-6 font-semibold tracking-tight rounded-md"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Cloud className="w-4 h-4 mr-2" />
                        Save to DB
                    </>
                )}
            </Button>
        </div>
    )
}
