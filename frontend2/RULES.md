# AI CV Maker - Frontend Context & Rules

## 1. WHAT & WHY (Project Scope)
* **What:** Frontend for an AI-powered CV maker. Includes a complex nested form builder, real-time CV preview, Dark Mode, future Auth, and a future LaTeX editor.
* **Why:** To provide a high-performance, precision-tool experience for users to build professional resumes. 
* **Architecture:** React Single Page Application (SPA) built with Vite.

## 2. HOW (Tech Stack)
* **Framework & Bundler:** React 18+ with Vite.
* **Routing:** React Router.
* **Styling:** Tailwind CSS.
* **Typing:** TypeScript (Strict).
* **State Management:** Zustand (for global/complex nested form state).
* **Backend:** FastAPI (Pydantic models act as the Single Source of Truth).

## 3. TECH-SPECIFIC RULES (Trigger-Action Format)

### React & Architecture
* **WHEN** building form sections -> **DO** extract logic into small sub-components (max 150-200 lines per file).
* **WHEN** accessing deeply nested CV data (e.g., `cv.sections[0].interval.start_date`) -> **DO** use optional chaining (`?.`) to prevent runtime crashes.
* **NEVER** prop-drill more than 2 levels. Use Zustand to access and mutate the CV state directly where needed.
* **NEVER** build the LaTeX editor or CV builder as a single massive component.

### Tailwind CSS & UI Design
* **CRITICAL:** **BEFORE** writing any styling code -> **MUST** read and apply the rules in `guide-style.md`.
* **WHEN** applying classes -> **DO** stick to `neutral`/`zinc` palettes, 1px borders (`border-neutral-200`), and sharp/snappy interactions.
* **NEVER** use bright primary colors, heavy drop shadows, or bouncy animations.

### TypeScript & FastAPI (Data Models)
* **WHEN** defining data structures -> **DO** perfectly mirror the FastAPI Pydantic schemas (`backend/app/models.py`)(`Cv`, `PersonalInfo`, `Interval`, `Date`, etc.).
* **WHEN** handling dates -> **DO** respect the `month` (1-12) and `year` numerical format from the backend.
* **NEVER** use `any` types.

### State Management (Zustand)
* **WHEN** updating deeply nested CV state in Zustand -> **DO** use a library like Immer (or Zustand's Immer middleware) to avoid complex spread operators (`...state`) and prevent accidental mutations.
* **NEVER** mutate React local state if the data needs to be sent to the backend or previewed globally; put it in the Zustand store.