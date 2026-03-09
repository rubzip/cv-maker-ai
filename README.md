# 📄 AI CV Maker

> A high-performance, open-source CV builder designed for developers. Create your Master Profile once, and use AI to perfectly tailor your resume to any job opening in seconds.

## ✨ Features

- **Latex-based:**
- **🤖 100% ATS-Friendly:** Generates clean, parseable resume structures without the bloated layouts that confuse Applicant Tracking Systems.
- **🌍 100% Open Source:** Own your data. No hidden paywalls, no watermarks, and no subscription traps.
- **💻 Local Privacy:** Run the entire stack (Frontend, Backend, and Database) on your local machine. Your career data never leaves your control unless you want it to.
- **✨ AI Tailoring:** Stop maintaining 10 different Word documents. Save a job opening URL, and the AI will clone your Master CV, filtering and rewriting your bullet points to match the exact `required_skills` of the job—without destroying your original data.

## 🚀 Getting Started with Docker

The easiest way to run the entire stack is using Docker Compose.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose V2](https://docs.docker.com/compose/install/) (included with Docker Desktop and modern Docker Engine)

### Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rubzip/cv-maker-ai.git
    cd cv-maker-ai
    ```

2.  **Launch the stack (V2):**
    ```bash
    sudo docker compose up --build -d
    ```

### 🛠️ Troubleshooting

If you get `docker: unknown command: docker compose` or `KeyError: 'ContainerConfig'`, you are using an old version of Docker Compose.

**Install Docker Compose V2 on Ubuntu:**
```bash
sudo apt update && sudo apt install docker-compose-v2
```

### 📦 Manual Fallback (No Compose)

If you cannot use Docker Compose, you can run the containers manually:

1. **Build the images:**
   ```bash
   sudo docker build -t cv-backend ./backend
   sudo docker build -t cv-frontend ./frontend
   ```

2. **Run the Backend:**
   ```bash
   sudo docker run -d -p 8000:8000 --name cv-backend cv-backend
   ```

3. **Run the Frontend:**
   ```bash
   sudo docker run -d -p 3000:3000 -e VITE_API_URL=http://localhost:8000 --name cv-frontend cv-frontend
   ```

### Technical Details

- The **Backend** uses FastAPI and requires a LaTeX distribution to generate PDFs. This is pre-configured in the `backend/Dockerfile`.
- The **Frontend** is built with Vite and React, served using `serve` in the production container.

### Stopping the services

```bash
docker compose down
```
