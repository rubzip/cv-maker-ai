import type { CV } from "../types/cv";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function generatePdf(cv: CV): Promise<Blob> {
    const response = await fetch(`${API_URL}/cv/generate-pdf`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
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
        headers: {
            "Content-Type": "application/json",
        },
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
        headers: {
            "Content-Type": "application/json",
        },
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
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ yaml_content: yamlContent }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(errorData.detail || "Failed to parse YAML");
    }

    return await response.json();
}

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
