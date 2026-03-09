import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { emptyCV } from "../types/cv";
import type { CV, Experience, Skills } from "../types/cv";

interface CvState {
    cv: CV;
    setPersonalInfo: (info: Partial<CV["personal_info"]>) => void;
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
    resetCv: () => void;
    setCv: (cv: CV) => void;
}

export const useCvStore = create<CvState>()(
    immer((set) => ({
        cv: emptyCV,

        setPersonalInfo: (info) =>
            set((state) => {
                state.cv.personal_info = { ...state.cv.personal_info, ...info };
            }),

        addSection: (title) =>
            set((state) => {
                state.cv.sections.push({ title, content: [] });
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
                state.cv.skills.push({ skill_group: "", skills: [] });
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

        resetCv: () =>
            set((state) => {
                state.cv = emptyCV;
            }),

        setCv: (cv) =>
            set((state) => {
                state.cv = cv;
            }),
    }))
);
