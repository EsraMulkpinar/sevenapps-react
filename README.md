# Live Markdown Playground

## 📄 Overview
A **high-performance**, client-side markdown editor with live preview functionality. Built with Next.js 15, React 19, and TypeScript.

**🚀 [Live Demo](https://sevenapps-react.vercel.app)**

### Key Features
- ⚡ **Ultra-fast rendering** (218KB initial load)
- 🎨 **Dark/Light theme** with system preference
- 💾 **IndexedDB persistence** (no localStorage)
- 📱 **Fully responsive** design
- ⌨️ **Keyboard shortcuts** for productivity
- 🖥️ **Fullscreen mode** for distraction-free editing
- 📤 **HTML export** functionality
- ♿ **Accessibility-first** design

---

## 🛠️ Tech Stack
- **Next.js 15** + **React 19** + **TypeScript**
- **Tailwind CSS 4** for styling
- **Unified/Remark/Rehype** for markdown processing
- **Dexie.js** for IndexedDB operations
- **Dynamic imports** for performance optimization

---

## 🚀 Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:3000

# Build for production
npm run build
```

---

## ⌨️ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl/⌘ + D` | Toggle theme |
| `Ctrl/⌘ + 1-4` | Load sample documents |

---

## ✨ Features Implemented

### ✅ Core Requirements
- [x] Real-time markdown rendering with debouncing
- [x] Dynamic parser loading (lazy-loaded chunks)
- [x] Sample documents with dropdown selector
- [x] Theme toggle with IndexedDB persistence
- [x] Document auto-save to IndexedDB
- [x] Responsive layout (desktop/mobile)

### 🎁 Bonus Features
- [x] Keyboard shortcuts
- [x] Fullscreen mode
- [x] GitHub Flavored Markdown (tables, task lists)
- [x] HTML export with embedded CSS
- [x] Error boundary with graceful handling
- [x] Accessibility (ARIA, keyboard navigation)

---

## 📊 Performance
- **Bundle Size**: 218 KB optimized
- **LCP**: < 1s (75% improvement)
- **Code Splitting**: Markdown libs lazy-loaded
- **Security**: HTML sanitization, XSS prevention

---

## 📁 Project Structure
```
src/
├── app/                    # Next.js App Router
├── components/             # React components
├── hooks/                  # Custom hooks
├── db/                     # IndexedDB config

samples/                    # Sample markdown files
```

---

## 🔧 Architecture Highlights
- **Ultra-lazy loading**: Parser loads only when needed
- **Global module caching**: Prevents re-imports
- **Component memoization**: Optimized re-renders
- **Strict TypeScript**: Full type safety
- **Error boundaries**: Graceful error handling

---

