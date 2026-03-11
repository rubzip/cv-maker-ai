export interface Date {
    month: number;
    year: number;
}

export interface Interval {
    start_date: Date | null;
    end_date: Date | null;
}

export interface SocialNetwork {
    network: string;
    username: string;
}

export interface PersonalInfo {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    website: string | null;
    social_networks: SocialNetwork[];
    about: string | null;
}

export interface Experience {
    id?: string;
    name: string;
    institution: string | null;
    location: string | null;
    interval: Interval | null;
    description: string[];
    url: string | null;
}

export interface Section {
    id?: string;
    title: string;
    content: Experience[];
}

export interface Skills {
    id?: string;
    skill_group: string;
    skills: string[];
}

export interface CV {
    id?: number;
    name: string;
    personal_info: PersonalInfo;
    sections: Section[];
    skills: Skills[] | null;
    created_at?: string;
}

export interface JobPosition {
    id?: number;
    title: string;
    company: string;
    url?: string;
    full_description: string;
    created_at?: string;
}

export interface CVRecord {
    id: number;
    name: string;
    created_at: string;
    optimization_reasoning?: string;
    data: CV;
}

export interface JobPositionRecord {
    id: number;
    title: string;
    company: string;
    created_at: string;
    data: JobPosition;
}

export const emptyCV: CV = {
    name: "Untitled CV",
    personal_info: {
        name: "",
        email: "",
        phone: null,
        address: null,
        website: null,
        social_networks: [],
        about: null,
    },
    sections: [],
    skills: [],
};
