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
    name: string;
    institution: string | null;
    location: string | null;
    interval: Interval | null;
    description: string[];
    url: string | null;
}

export interface Section {
    title: string;
    content: Experience[];
}

export interface Skills {
    skill_group: string;
    skills: string[];
}

export interface CV {
    personal_info: PersonalInfo;
    sections: Section[];
    skills: Skills[] | null;
}

export const emptyCV: CV = {
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
