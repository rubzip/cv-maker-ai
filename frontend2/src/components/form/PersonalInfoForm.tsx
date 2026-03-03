import * as React from "react"
import { useCvStore } from "../../store/useCvStore"
import { Input } from "../ui/Input"
import { Card } from "../ui/Card"

export function PersonalInfoForm() {
    const { cv, setPersonalInfo } = useCvStore()
    const { personal_info } = cv

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setPersonalInfo({ [name]: value })
    }

    return (
        <Card className="p-6 space-y-4">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-500">
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
                    <label className="text-xs font-medium text-neutral-500">
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
                    <label className="text-xs font-medium text-neutral-500">Phone Number</label>
                    <Input
                        name="phone"
                        value={personal_info.phone ?? ""}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-500">Location</label>
                    <Input
                        name="address"
                        value={personal_info.address ?? ""}
                        onChange={handleChange}
                        placeholder="San Francisco, CA"
                    />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-neutral-500">Website / Portfolio</label>
                    <Input
                        name="website"
                        value={personal_info.website ?? ""}
                        onChange={handleChange}
                        placeholder="https://janedoe.com"
                    />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-neutral-500">About / Summary</label>
                    <textarea
                        name="about"
                        value={personal_info.about ?? ""}
                        onChange={handleChange}
                        rows={3}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Brief professional summary..."
                    />
                </div>
            </div>
        </Card>
    )
}
