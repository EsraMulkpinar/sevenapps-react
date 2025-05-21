# Case Study: Live Markdown Playground

## 📄 Overview
Build a **client‑only**, single‑page application where users write Markdown in an editor and view a live HTML preview. No servers or backend code—everything runs in the browser.

**Why this exercise?**
1. Evaluate proficiency with React Hooks and state management.  
2. Test ability to integrate dynamic imports for performance.  
3. Assess skill in persisting data using IndexedDB rather than `localStorage`.  
4. Verify familiarity with Tailwind CSS for responsive design.

---

## 🎯 Objectives
1. **Real‑time Markdown Rendering**  
   - On each keystroke, convert `.md` to sanitized HTML and display in preview pane.  
   - Ensure minimal latency and efficient reconciliation.

2. **Dynamic Parser Loading**  
   - Use `React.lazy` or dynamic `import()` to load the Markdown parser (e.g., `remark` + `remark-html`) only when the editor mounts.  
   - Confirm chunk splitting in your build.

3. **Sample Documents**  
   - Include three sample `.md` files (e.g., `intro.md`, `features.md`, `usage.md`) under `/src/samples/`.  
   - Provide a dropdown or tabs UI to switch between them.

4. **Theme Toggle**  
   - Offer light/dark styles via Tailwind’s `dark:` variants.  
   - Persist theme selection in IndexedDB under a `settings` table.

5. **Last‑Document Persistence**  
   - Store the current MD content in an IndexedDB `documents` table.  
   - On page load, retrieve and display the last‑edited document.

6. **Responsive Layout**  
   - Side‑by‑side panes on desktop (≥768px).  
   - Stacked editor above preview on mobile (<768px).

---

## 🧰 Tech Stack & Key Patterns
1. **React + TypeScript (v18+)**
   - Functional components written in `.tsx` with Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`).
   - Define interfaces/types for component props, state, and hook data.
   - Use proper typing for dynamic imports and external module declarations (e.g., Markdown parser types).

2. **Dynamic Imports**
   - `const { unified } = await import('unified');`
   - `const remarkParse = await import('remark-parse');`
   - Wrap in `useEffect` to defer loading until needed.

3. **Dexie.js**
   - Define a DB schema:
     ```js
     const db = new Dexie('MarkdownPlayground');
     db.version(1).stores({
       settings: '&key, value',
       documents: 'id, content'
     });
     ```

4. **Tailwind CSS**
   - Utilize utility classes for spacing, typography, responsiveness.  
   - Example class: `className="flex flex-col md:flex-row h-screen"

5. **Security & Performance**
   - Sanitize rendered HTML (e.g., `rehype-sanitize`).  
   - Debounce rendering to avoid excessive parser calls.

6. **Folder Structure (suggested)**
   ```plaintext
   src/
   ├─ components/
   ├─ Editor.tsx
   ├─ Preview.tsx
   ├─ ThemeToggle.tsx
   └─ SampleSelector.tsx
   hooks/
   └─ useIndexedDB.ts

   │  └─ useIndexedDB.js
   ├─ samples/
   │  ├─ intro.md
   │  ├─ features.md
   │  └─ usage.md
   ├─ App.jsx
   └─ index.css
   ```

---

## 🚀 Deliverables
1. **`<Editor />` & `<Preview />`**
   - Real‑time Markdown editing + sanitized HTML preview.  

2. **`<SampleSelector />`**
   - Dropdown or tabbed UI to load `intro.md`, `features.md`, or `usage.md`.

3. **`<ThemeToggle />`**
   - Switch controlling `document.documentElement.classList` for `dark` mode.  

4. **IndexedDB Persistence**
   - Custom hook for saving/loading settings & documents.  

5. **Build Config**
   - Confirm dynamic import chunks in your production build.

---

## 🕹️ Evaluation Criteria
| Criterion                   | What to Look For                              |
|-----------------------------|-----------------------------------------------|
| **Hooks & Re‑renders**      | Proper dependency arrays; minimal unnecessary updates |
| **Dynamic Imports**         | Parser code split; no parser code in initial bundle |
| **IndexedDB Usage**         | Robust CRUD; error handling; no `localStorage`    |
| **Responsive CSS**          | Layout adapts at breakpoints; accessible fonts & colors |
| **Code Organization**       | Logical folder structure; reusable components     |

---

## 🎁 Bonus Criteria
- **Custom Shortcuts**: Add keyboard shortcuts (e.g., `Ctrl+S` to save, `Ctrl+1/2/3` to switch samples).
- **Fullscreen Mode**: Implement a button to toggle the editor or preview pane into fullscreen.
- **Markdown Extensions**: Support at least one advanced Markdown extension (e.g., footnotes, tables, or task lists).
- **Export HTML**: Provide a “Download HTML” button that serializes the preview pane content to an `.html` file.
- **Accessibility Audit**: Include an ARIA‑friendly implementation and pass a basic Lighthouse accessibility check.

## 📤 Submission Instructions
1. Push your code to a **public GitHub repo**.  
2. Provide the repo link—**no ZIP files**.  
3. Include a brief `README.md` explaining your approach, any trade‑offs, and how to run the app.  

> ❗ **Reminder:** Using `localStorage` or sending a ZIP will **disqualify** your submission. No backend or API code.

# sevenapps-react
