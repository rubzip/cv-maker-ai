import type { CV, CVRecord, JobPosition, JobPositionRecord } from "../types/cv";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// --- Transformation Endpoints ---

export async function generatePdf(cv: CV): Promise<Blob> {
    const response = await fetch(`${API_URL}/cv/generate-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cv),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(errorData.detail || "Failed to generate PDF");
    }

    return await response.blob();
}

export async function generateTex(cv: CV): Promise<Blob> {
    const response = await fetch(`${API_URL}/cv/generate-tex`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cv),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(errorData.detail || "Failed to generate LaTeX");
    }

    return await response.blob();
}

export async function generateYaml(cv: CV): Promise<Blob> {
    const response = await fetch(`${API_URL}/cv/generate-yaml`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cv),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(errorData.detail || "Failed to generate YAML");
    }

    return await response.blob();
}

export async function parseYaml(yamlContent: string): Promise<CV> {
    const response = await fetch(`${API_URL}/cv/parse-yaml`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yaml_content: yamlContent }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(errorData.detail || "Failed to parse YAML");
    }

    return await response.json();
}

// --- CV Repository Endpoints ---

export async function saveCv(cv: CV, optimizationReasoning?: string): Promise<CVRecord> {
    const url = new URL(`${API_URL}/cv/`);
    if (optimizationReasoning) {
        url.searchParams.append("optimization_reasoning", optimizationReasoning);
    }
    const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cv),
    });
    if (!response.ok) throw new Error("Failed to save CV");
    return await response.json();
}

export async function listCvs(): Promise<CVRecord[]> {
    const response = await fetch(`${API_URL}/cv/`);
    if (!response.ok) throw new Error("Failed to list CVs");
    return await response.json();
}

export async function getCv(id: number): Promise<CVRecord> {
    const response = await fetch(`${API_URL}/cv/${id}`);
    if (!response.ok) throw new Error("Failed to get CV");
    return await response.json();
}

export async function updateCv(id: number, cv: CV, optimizationReasoning?: string): Promise<CVRecord> {
    const url = new URL(`${API_URL}/cv/${id}`);
    if (optimizationReasoning) {
        url.searchParams.append("optimization_reasoning", optimizationReasoning);
    }
    const response = await fetch(url.toString(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cv),
    });
    if (!response.ok) throw new Error("Failed to update CV");
    return await response.json();
}

export async function deleteCv(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/cv/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete CV");
}

export async function refineCv(cv: CV, job: JobPosition): Promise<{ cv: CV; reasoning: string }> {
    const response = await fetch(`${API_URL}/cv/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, job_position: job }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(errorData.detail || "Failed to refine CV");
    }

    return await response.json();
}

// --- Job Repository Endpoints ---

export async function saveJob(job: JobPosition): Promise<JobPositionRecord> {
    const response = await fetch(`${API_URL}/job/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
    });
    if (!response.ok) throw new Error("Failed to save Job");
    return await response.json();
}

export async function listJobs(): Promise<JobPositionRecord[]> {
    const response = await fetch(`${API_URL}/job/`);
    if (!response.ok) throw new Error("Failed to list Jobs");
    return await response.json();
}

export async function getJob(id: number): Promise<JobPositionRecord> {
    const response = await fetch(`${API_URL}/job/${id}`);
    if (!response.ok) throw new Error("Failed to get Job");
    return await response.json();
}

export async function updateJob(id: number, job: JobPosition): Promise<JobPositionRecord> {
    const response = await fetch(`${API_URL}/job/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
    });
    if (!response.ok) throw new Error("Failed to update Job");
    return await response.json();
}

export async function deleteJob(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/job/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete Job");
}

// --- Utils ---

export function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}
