# Designer

Local workspace for editing XOLogic dashboard fragments (header, footer, metadata) and related CSS/JS. Preview changes with Live Server before pasting into the XOLogic admin.

## Preview

| File | Purpose |
|---|---|
| `preview.html` | Full page — header + footer |
| `footer-preview.html` | Footer only |

Open either file with **Live Server** from this folder (project root).

## Layout

| Path | Role |
|---|---|
| `header/header.html` | Header fragment → paste into XOLogic → Dashboard → Header |
| `data/footer/footer.html` | Footer source of truth; edit here first |
| `footer/footer.html` | Mirror for paste/deploy |
| `meta/meta.html` | Metadata fragment (scripts, styles) |
| `data/css/` | Stylesheets |
| `data/js/` | Header, footer, and preview scripts |

## Workflow

1. Edit files under `data/` (and sync mirrors in `header/`, `footer/`, `meta/` when needed).
2. Preview at mobile (~375px), tablet (~768px), and desktop.
3. Paste updated HTML into the matching XOLogic dashboard fields.
