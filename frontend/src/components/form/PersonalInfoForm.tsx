import type { ChangeEvent } from "react"
import { useCvStore } from "../../store/useCvStore"
import { Input } from "../ui/Input"
import { FormCard } from "./FormCard"

export function PersonalInfoForm() {
    const {
        cv,
        setPersonalInfo
    } = useCvStore()
    const { personal_info } = cv

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setPersonalInfo({ [name]: value })
    }

    return (
        <FormCard title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                        Full Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                        name="name"
                        value={personal_info.name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                        Email Address <span className="text-destructive">*</span>
                    </label>
                    <Input
                        name="email"
                        type="email"
                        value={personal_info.email}
                        onChange={handleChange}
                        placeholder="jane.doe@example.com"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Phone Number</label>
                    <Input
                        name="phone"
                        value={personal_info.phone ?? ""}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Location</label>
                    <Input
                        name="address"
                        value={personal_info.address ?? ""}
                        onChange={handleChange}
                        placeholder="San Francisco, CA"
                    />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Website / Portfolio</label>
                    <Input
                        name="website"
                        value={personal_info.website ?? ""}
                        onChange={handleChange}
                        placeholder="https://janedoe.com"
                    />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">About / Summary</label>
                    <textarea
                        name="about"
                        value={personal_info.about ?? ""}
                        onChange={handleChange}
                        rows={4}
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                        placeholder="Brief professional summary..."
                    />
                </div>
            </div>
        </FormCard>
    )
}
