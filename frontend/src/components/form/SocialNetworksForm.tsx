import { useCvStore } from "../../store/useCvStore"
import { FormCard } from "./FormCard"
import { Button } from "../ui/Button"
import { Trash2, Plus, Globe } from "lucide-react"

export function SocialNetworksForm() {
    const {
        cv,
        addSocialNetwork,
        updateSocialNetwork,
        removeSocialNetwork
    } = useCvStore()

    return (
        <FormCard
            title="Social Networks"
            icon={Globe}
            description="Link your LinkedIn, GitHub, or Twitter profiles."
        >
            <div className="space-y-4">
                {cv.personal_info.social_networks.map((network, index) => (
                    <div key={index} className="flex gap-3 group">
                        <div className="grid grid-cols-2 gap-3 flex-1">
                            <input
                                type="text"
                                placeholder="Network (e.g. LinkedIn)"
                                className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                value={network.network}
                                onChange={(e) => updateSocialNetwork(index, { network: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Username / URL"
                                className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                value={network.username}
                                onChange={(e) => updateSocialNetwork(index, { username: e.target.value })}
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSocialNetwork(index)}
                            className="h-10 w-10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}

                {cv.personal_info.social_networks.length === 0 && (
                    <div className="text-center py-6 bg-muted/20 rounded-2xl border border-dashed border-border">
                        <p className="text-xs text-muted-foreground">No social networks added yet.</p>
                    </div>
                )}

                <Button
                    variant="outline"
                    className="w-full h-10 border-dashed hover:border-primary hover:bg-primary/5 hover:text-primary transition-all font-bold group"
                    onClick={addSocialNetwork}
                >
                    <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                    Add Social Network
                </Button>
            </div>
        </FormCard>
    )
}
