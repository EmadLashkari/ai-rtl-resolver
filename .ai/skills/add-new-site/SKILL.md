---
name: add-new-site
description: Add support for a new AI chat platform to the RTL resolver browser extension. Creates site parser, entry point, updates build config, manifest, README, and docs.
---

# Add New Site

Add RTL text direction support for a new AI chat platform to the Ai RTL Resolver browser extension.

## Prerequisites

User provides:
- **Site name** (short lowercase identifier, e.g. `zai`, `duckai`, `qwen`)
- **CSS selectors** for: input textarea, user message bubble, assistant content area
- **Domain(s)** to match in the manifest (e.g. `https://z.ai/*`, `https://chat.z.ai/*`)
- **Display name** and optional platform icon filename for README/docs

## Steps

### 1. Create site parser — `src/sites/<name>.ts`

Copy the pattern from any existing site (e.g. `src/sites/zai.ts`). The file must:

- Import `applyDetectedDirection`, `getElementText`, `observeBodyMutations` from `../lib/dom`
- Import `initKatexDirectionFix` from `../lib/katex`
- Define a `DIRECTION_TARGET_SELECTOR` constant with CSS selectors targeting input, user bubbles, and assistant content (comma-separated)
- Export an `init<Name>()` function that:
  1. Calls `applyDetectedDirection(document.querySelectorAll(selector), getElementText)`
  2. Calls `observeBodyMutations(applyFn)` for dynamic content
  3. Calls `initKatexDirectionFix()` for math formula support

Selector tips:
- Include `table` in the selector to catch table elements
- Use `:not()` exclusions to avoid double-matching user bubbles in content areas
- Test selectors against the live site's DOM before committing

### 2. Create entry point — `src/entries/<name>.ts`

Copy the pattern from `src/entries/zai.ts`. The file must:

- Import `initFontInjection` from `../lib/fonts`
- Import `checkEnabled`, `observeToggle` from `../lib/storage`
- Import `init<Name>` from `../sites/<name>`
- Call `checkEnabled(SITE_ID)` and conditionally run `initFontInjection()` + `init<Name>()`
- Set up `observeToggle` to reload the page when the user toggles the site on

### 3. Update build config — `scripts/build.mjs`

Add the site name to the `entries` array in alphabetical or logical order:

```js
const entries = ['chatgpt', 'deepseek', ..., '<name>'];
```

Also update the `@type` JSDoc comment above it to match.

### 4. Update manifest — `public/manifest.json`

Add two things:

**`content_scripts`** — add a new entry:
```json
{
  "matches": ["<domain1>/*", "<domain2>/*"],
  "js": ["<name>.js"],
  "run_at": "document_end"
}
```

**`web_accessible_resources[0].matches`** — append the domain(s):
```json
"https://example.com/*"
```

### 5. Update README.md

Three locations to update:

1. **Description line** (line ~8): Add the display name to the comma-separated list
2. **Supported Platforms table**: Add a new row with icon and link
3. **Version History table**: Add a row for the current version noting the addition

### 6. Update docs/index.html

Update the landing page:

1. **Hero description**: Add display name to the supported platforms list
2. **Stats section**: Increment the platforms count
3. **Platforms section**: Add a new platform card with icon and link

### 7. Validate

```bash
npm run build && npm run typecheck
```

Both must pass. If typecheck fails, check imports and type annotations.

## File reference

| File | Purpose |
|------|---------|
| `src/sites/<name>.ts` | Site parser with CSS selectors |
| `src/entries/<name>.ts` | Entry point (font init + site init) |
| `scripts/build.mjs` | Vite build config, entries array |
| `public/manifest.json` | Chrome extension manifest, content scripts + resources |
| `README.md` | Supported platforms list and version history |
| `docs/index.html` | Landing page with platform cards |

## Example

Adding `zai` support (from `[ses_10bec37caffeo865emoiX9VQh1]`):

- User provided selectors: `#chat-input` (textarea), `.chat-user` (user bubble), `.markdown-prose` (main content)
- Domains: `https://z.ai/*` and `https://chat.z.ai/*`
- Created `src/sites/zai.ts` with selector `#chat-input,.chat-user [data-expanded], .markdown-prose:not(.chat-user), table`
- Created `src/entries/zai.ts` following the standard pattern
- Added `'zai'` to build entries, manifest content_scripts, web_accessible_resources
- Updated README description, platforms table, version history
- Updated docs hero, stats, platforms section
- Build + typecheck passed
