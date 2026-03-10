import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { emptyCV } from "../types/cv";
import type { CVRecord, CV, PersonalInfo, Experience, Skills } from "../types/cv";
import { listCvs, saveCv, updateCv } from "../lib/api";

interface CvState {
    cv: CV;
    cvId: number | null;
    cvs: CVRecord[];
    isLoading: boolean;
    setPersonalInfo: (info: Partial<PersonalInfo>) => void;
    addSection: (title: string) => void;
    removeSection: (index: number) => void;
    updateSection: (index: number, title: string) => void;
    reorderSections: (oldIndex: number, newIndex: number) => void;
    addExperience: (sectionIndex: number) => void;
    updateExperience: (sectionIndex: number, experienceIndex: number, experience: Partial<Experience>) => void;
    removeExperience: (sectionIndex: number, experienceIndex: number) => void;
    addSkillGroup: () => void;
    updateSkillGroup: (index: number, skillGroup: Partial<Skills>) => void;
    removeSkillGroup: (index: number) => void;
    reorderSkillGroups: (oldIndex: number, newIndex: number) => void;
    reorderSkills: (groupIndex: number, oldIndex: number, newIndex: number) => void;
    addSocialNetwork: () => void;
    updateSocialNetwork: (index: number, network: Partial<CV["personal_info"]["social_networks"][0]>) => void;
    removeSocialNetwork: (index: number) => void;
    resetCv: () => void;
    setCv: (cv: CV) => void;
    setCvName: (name: string) => void;
    setCvId: (id: number | null) => void;
    fetchCvs: () => Promise<void>;
    syncToDb: () => Promise<void>;
}

export const useCvStore = create<CvState>()(
    immer((set, get) => ({
        cv: emptyCV,
        cvId: null,
        cvs: [],
        isLoading: false,

        setPersonalInfo: (info) =>
            set((state) => {
                state.cv.personal_info = { ...state.cv.personal_info, ...info };
            }),

        addSection: (title) =>
            set((state) => {
                state.cv.sections.push({ id: crypto.randomUUID(), title, content: [] });
            }),

        removeSection: (index) =>
            set((state) => {
                state.cv.sections.splice(index, 1);
            }),

        updateSection: (index, title) =>
            set((state) => {
                state.cv.sections[index].title = title;
            }),

        reorderSections: (oldIndex, newIndex) =>
            set((state) => {
                const [movedItem] = state.cv.sections.splice(oldIndex, 1);
                state.cv.sections.splice(newIndex, 0, movedItem);
            }),

        addExperience: (sectionIndex) =>
            set((state) => {
                state.cv.sections[sectionIndex].content.push({
                    id: crypto.randomUUID(),
                    name: "",
                    institution: null,
                    location: null,
                    interval: { start_date: null, end_date: null },
                    description: [],
                    url: null,
                });
            }),

        updateExperience: (sectionIndex, experienceIndex, experience) =>
            set((state) => {
                state.cv.sections[sectionIndex].content[experienceIndex] = {
                    ...state.cv.sections[sectionIndex].content[experienceIndex],
                    ...experience,
                };
            }),

        removeExperience: (sectionIndex, experienceIndex) =>
            set((state) => {
                state.cv.sections[sectionIndex].content.splice(experienceIndex, 1);
            }),

        addSkillGroup: () =>
            set((state) => {
                if (!state.cv.skills) state.cv.skills = [];
                state.cv.skills.push({ id: crypto.randomUUID(), skill_group: "", skills: [] });
            }),

        updateSkillGroup: (index, skillGroup) =>
            set((state) => {
                if (!state.cv.skills) return;
                state.cv.skills[index] = { ...state.cv.skills[index], ...skillGroup };
            }),

        removeSkillGroup: (index) =>
            set((state) => {
                if (!state.cv.skills) return;
                state.cv.skills.splice(index, 1);
            }),

        reorderSkillGroups: (oldIndex, newIndex) =>
            set((state) => {
                if (!state.cv.skills) return;
                const [movedItem] = state.cv.skills.splice(oldIndex, 1);
                state.cv.skills.splice(newIndex, 0, movedItem);
            }),

        reorderSkills: (groupIndex, oldIndex, newIndex) =>
            set((state) => {
                if (!state.cv.skills || !state.cv.skills[groupIndex]) return;
                const [movedItem] = state.cv.skills[groupIndex].skills.splice(oldIndex, 1);
                state.cv.skills[groupIndex].skills.splice(newIndex, 0, movedItem);
            }),

        addSocialNetwork: () =>
            set((state) => {
                state.cv.personal_info.social_networks.push({ network: "", username: "" });
            }),

        updateSocialNetwork: (index, network) =>
            set((state) => {
                state.cv.personal_info.social_networks[index] = {
                    ...state.cv.personal_info.social_networks[index],
                    ...network,
                };
            }),

        removeSocialNetwork: (index) =>
            set((state) => {
                state.cv.personal_info.social_networks.splice(index, 1);
            }),

        resetCv: () =>
            set((state) => {
                state.cv = emptyCV;
                state.cvId = null;
            }),

        setCv: (cv) =>
            set((state) => {
                state.cv = cv;
            }),

        setCvName: (name) =>
            set((state) => {
                state.cv.name = name;
            }),

        setCvId: (id) =>
            set((state) => {
                state.cvId = id;
            }),

        fetchCvs: async () => {
            set((state) => { state.isLoading = true; });
            try {
                const cvs = await listCvs();
                set((state) => { state.cvs = cvs; });
            } finally {
                set((state) => { state.isLoading = false; });
            }
        },

        syncToDb: async () => {
            const { cv, cvId } = get();
            set((state) => { state.isLoading = true; });
            try {
                if (cvId) {
                    await updateCv(cvId, cv);
                } else {
                    const saved = await saveCv(cv);
                    set((state) => { state.cvId = saved.id; });
                }
                // Refresh list after sync
                const cvs = await listCvs();
                set((state) => { state.cvs = cvs; });
            } finally {
                set((state) => { state.isLoading = false; });
            }
        },
    }))
);
