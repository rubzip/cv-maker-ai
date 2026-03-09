import { useCvStore } from "../../store/useCvStore"
import { Input } from "../ui/Input"
import { FormCard } from "./FormCard"
import { Button } from "../ui/Button"
import { Trash2, Plus, Github, Linkedin, Twitter, Globe, Link } from "lucide-react"

export function SocialNetworksForm() {
    const {
        cv,
        addSocialNetwork,
        updateSocialNetwork,
        removeSocialNetwork
    } = useCvStore()
    const { personal_info } = cv

    const getNetworkIcon = (network: string) => {
        const n = network.toLowerCase()
        if (n.includes("github")) return <Github className="w-3.5 h-3.5" />
        if (n.includes("linkedin")) return <Linkedin className="w-3.5 h-3.5" />
        if (n.includes("twitter") || n.includes(" x ")) return <Twitter className="w-3.5 h-3.5" />
        if (n.includes("portfolio") || n.includes("website") || n.includes("blog")) return <Globe className="w-3.5 h-3.5" />
        return <Link className="w-3.5 h-3.5" />
    }

    return (
        <FormCard title="Social Networks">
            <div className="space-y-6">
                {personal_info.social_networks.map((sn, index) => (
                    <div key={index} className="space-y-4 pt-4 first:pt-0 border-t first:border-0 border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                    <span className="text-neutral-400">{getNetworkIcon(sn.network)}</span>
                                    Platform
                                </label>
                                <Input
                                    value={sn.network}
                                    onChange={(e) => updateSocialNetwork(index, { network: e.target.value })}
                                    placeholder="e.g. LinkedIn"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                    <Link className="w-3.5 h-3.5 text-neutral-400" />
                                    Username or URL
                                </label>
                                <Input
                                    value={sn.username}
                                    onChange={(e) => updateSocialNetwork(index, { username: e.target.value })}
                                    placeholder="e.g. johndoe-dev"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button variant="ghost" size="sm" onClick={() => removeSocialNetwork(index)} className="text-destructive h-7 px-2">
                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove Profile
                            </Button>
                        </div>
                    </div>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/10 transition-all font-medium"
                    onClick={addSocialNetwork}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Network
                </Button>
            </div>
        </FormCard>
    )
}
