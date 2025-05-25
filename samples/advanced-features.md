# Advanced Features

This sample demonstrates the editor's advanced features.

## Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Tables | ✅ | High |
| Task Lists | ✅ | High |
| Fullscreen | ✅ | Medium |
| HTML Export | ✅ | Medium |

## Task Lists

### Todo Items
- [x] Fullscreen buttons added
- [x] HTML export feature
- [x] GitHub Flavored Markdown support
- [ ] More markdown extensions
- [ ] Live collaboration feature

## Code Blocks

```javascript
// HTML export example
function exportHTML(content) {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  return url;
}
```

## Feature Usage

**Fullscreen**: Click the expand icon in Editor/Preview header
**HTML Export**: Use the download button in Preview header
**Tables**: Create columns with pipe `|` character
**Task Lists**: `- [ ]` empty, `- [x]` checked tasks

---

*Tip: Try fullscreen mode while editing this document!* 