import { useCvStore } from "../../store/useCvStore"
import { FormCard } from "./FormCard"
import { User, MapPin } from "lucide-react"

export function PersonalInfoForm() {
    const {
        cv,
        setPersonalInfo
    } = useCvStore()

    return (
        <FormCard
            title="Personal Information"
            icon={User}
            description="Basic contact details for your resume."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={cv.personal_info.name}
                        onChange={(e) => setPersonalInfo({ name: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="john.doe@example.com"
                        className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={cv.personal_info.email}
                        onChange={(e) => setPersonalInfo({ email: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                    <input
                        type="tel"
                        placeholder="+34 600 000 000"
                        className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={cv.personal_info.phone || ""}
                        onChange={(e) => setPersonalInfo({ phone: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Website / Portfolio</label>
                    <input
                        type="url"
                        placeholder="https://johndoe.me"
                        className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={cv.personal_info.website || ""}
                        onChange={(e) => setPersonalInfo({ website: e.target.value })}
                    />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Address / Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Madrid, Spain"
                            className="w-full bg-muted/50 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={cv.personal_info.address || ""}
                            onChange={(e) => setPersonalInfo({ address: e.target.value })}
                        />
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">About / Professional Summary</label>
                    <textarea
                        placeholder="Passionate developer with 5+ years of experience building scalable applications..."
                        className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium min-h-[120px] resize-none"
                        value={cv.personal_info.about || ""}
                        onChange={(e) => setPersonalInfo({ about: e.target.value })}
                    />
                </div>
            </div>
        </FormCard>
    )
}
