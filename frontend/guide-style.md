# UI Design Guidelines & Tailwind Rules (Tech Minimalist)

## 1. Core Philosophy
The aesthetic of this project is "Tech Minimalist" or "High-Performance European Software". Think of companies like Vercel, Linear, Stripe, Raycast, or GitHub.
* **Goal:** The UI must feel like a precision tool, not a toy. 
* **Content First:** The interface is just a clean glass through which the user interacts with their data.
* **Vibe:** Serious, clean, dense, professional, and subtle.

## 2. Color Palette (Monochromatic Focus)
Avoid bright primary colors. Rely on a strict, neutral grayscale for 95% of the UI.
* **DO USE:** `neutral` or `zinc` tailwind palettes.
* **Backgrounds:** `bg-white` for cards/panels, `bg-neutral-50` for app backgrounds.
* **Text:** `text-neutral-900` for primary text/headings, `text-neutral-500` for secondary text.
* **Accents:** Use color ONLY for critical states (e.g., `text-red-500` for delete actions) or a single, dark primary brand color (like `bg-neutral-900` or a very muted `bg-blue-600`).
* **DON'T USE:** Bright, saturated blues, greens, or purples (`bg-blue-500`, `text-green-500`) unless explicitly required for a status badge.

## 3. Borders & Depth (The "Borders over Shadows" Rule)
Never use heavy shadows to create separation. Use 1px borders instead.
* **DO USE:** `border border-neutral-200` to separate cards, sections, and inputs.
* **Shadows:** Use `shadow-sm` purely to give a slight lift to interactive elements (like buttons or dropdowns).
* **Radii:** Keep corners relatively sharp. Use `rounded-md` for inputs/buttons and `rounded-lg` for large cards.
* **DON'T USE:** Neo-brutalism (hard offset shadows like `shadow-[4px_4px_0px_black]`), heavy blur shadows (`shadow-xl`, `shadow-2xl`), or pill-shaped containers (`rounded-full`, except for avatars).

## 4. Typography (Dense and Crisp)
Typography should create hierarchy through weight and size contrast, not just by making things massive.
* **Headings:** Use tight tracking. Example: `text-xl font-semibold tracking-tight text-neutral-900`.
* **Small Labels:** Use uppercase for structural labels. Example: `text-xs font-medium text-neutral-500 uppercase tracking-wider`.
* **Body:** Keep it readable and slightly smaller. `text-sm text-neutral-600`.
* **DON'T USE:** Giant headers (`text-4xl` or above) unless it's a landing page hero section.

## 5. Interactive States & Animations
Micro-interactions must feel instant and snappy. No bouncing or floating.
* **Hover States (Buttons/Items):** Change background color slightly, not the size. Use `hover:bg-neutral-100 transition-colors duration-150`.
* **Focus States (Inputs):** Do not use default glowing blue rings. Use crisp, neutral rings. Example: `focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400`.
* **DON'T USE:** Transform scales (`hover:scale-105`), long transitions (`duration-500`), or bouncy physics.

## 6. Layout & Spacing
* **Density:** Professional tools are information-dense. Use consistent, mathematical spacing (`gap-4`, `p-6`).
* **Alignment:** Use Flexbox and Grid strictly. Everything must align perfectly to a visual grid.
* **Dividers:** Use `border-t border-neutral-100` to separate content inside a card, rather than wrapping everything in its own box.

## 7. Dark Mode Implementation (Strict Rules)
The application must support Dark Mode using Tailwind's `dark:` modifier. 
* **Never use pure black (`#000000` / `bg-black`):** It causes eye strain. Use `dark:bg-neutral-950` for the main app background.
* **Cards & Surfaces:** Use `dark:bg-neutral-900` for cards to create a slight elevation from the 950 background.
* **Borders:** In dark mode, borders should be extremely subtle. Use `dark:border-neutral-800`.
* **Text Contrast:** Primary text should be `dark:text-neutral-100` (not pure white) and secondary text `dark:text-neutral-400`.
* **Hover States:** Use `dark:hover:bg-neutral-800` for subtle interactive feedback.

---

## 🛑 Prompting Checklist for LLMs
When generating a new React component for this project, the LLM must verify:
1. [ ] Are there any primary colors? (If yes, replace with neutral-900/white/neutral-100).
2. [ ] Are the borders 1px and neutral-200?
3. [ ] Are the shadows larger than `shadow-sm`? (If yes, remove them).
4. [ ] Are hover effects relying on `scale` or `translate`? (If yes, change to background color changes).
5. [ ] Is the focus ring neutral and 1px?