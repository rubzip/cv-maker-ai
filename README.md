# 📄 AI CV Maker

> **The developer-first, AI-powered resume engineer.** 
> Create a single Master Profile and generate perfectly tailored, ATS-friendly resumes for any job opening in seconds.

---

## 🔥 Why AI CV Maker?

Traditional resume builders are either bloated, expensive, or fail at basic ATS (Applicant Tracking System) parsing. **AI CV Maker** is built for developers who want professional typesetting and AI-driven tailoring without the friction.

### 🛡️ Local-First & Privacy Centric
Your data never leaves your machine. The entire stack runs locally, persisting your Master CV and Job applications as simple, human-readable **YAML files**.

### 🤖 Intelligent AI Tailoring
Stop maintaining dozens of separate Word documents. Paste a job description or URL, and our AI clones your Master CV—rewriting, filtering, and highlighting your experience to match the exact requirements of the role.

### 📄 Professional LaTeX Typesetting
Unlike HTML-to-PDF converters that produce messy, non-standard layouts, AI CV Maker uses **LaTeX** to generate clean, high-performance resumes that pass every ATS check with flying colors.

---

## 🚀 Quick Start

Launch the entire professional stack (Frontend + Backend + Storage) with a single command:

```bash
# 1. Clone the repository
git clone https://github.com/rubzip/cv-maker-ai.git
cd cv-maker-ai
cp .env.example .env
# Customize .env file

# 2. Launch with Docker (V2)
sudo docker-compose down --remove-orphans
sudo docker-compose rm -f -v
sudo docker-compose up --build -d
```

- **Frontend Builder:** [http://localhost:3000](http://localhost:3000)
- **API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠️ Tech Stack

- **Frontend:** [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) + [Zustand](https://github.com/pmndrs/zustand)
- **Aesthetics:** Tech Minimalist (Neutral Zinc / Premium Dark Mode Support)
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12)
- **Persistence:** YAML Flat-file storage
- **Engine:** LaTeX (Professional PDF Rendering)

---

## 📂 Project Structure

```text
.
├── backend/            # FastAPI Backend & LaTeX Engines
│   ├── app/            # Application logic
│   └── data/           # (Mapped) YAML Storage
├── frontend/           # Vite + React Builder UI
│   ├── src/components/ # Ultra-minimalist UI components
│   └── src/store/      # Zustand State Management
├── data/               # Persistent Volume (CVs & Jobs)
└── docker-compose.yml  # Orchestration
```

---

## 📜 License

100% Open Source. Distributed under the MIT License. Own your data. Own your career.
