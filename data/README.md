# QUASAR research themes — data intake

This folder is the canonical place to collect content for each of the nine
QUASAR research theme detail pages under `pages/research/`.

There are three intake files, each focused on a different shape of data:

| File | Purpose | Best opened in |
| --- | --- | --- |
| `research-themes-content.md` | Long-form narrative per theme: lead paragraph, overview, science questions, approach & methods. | Word, VS Code, any text editor, GitHub. |
| `research-theme-members.csv` | One row per (theme, member) assignment. | Excel, Google Sheets, LibreOffice Calc. |
| `research-theme-links.csv` | One row per external resource, project, paper, or facility per theme. | Excel, Google Sheets, LibreOffice Calc. |

These are intentionally simple, human-editable formats. They can later be
parsed by a Python script (matching the existing `generate_members.py`
pattern) to populate the theme pages automatically — that step is **not**
wired up yet.

## Theme IDs

Use these short IDs as the `theme_id` value in the CSVs and as the section
anchors in the Markdown file. They match the file names under
`pages/research/`.

| Theme ID | Title |
| --- | --- |
| `cosmology` | Fundamental Cosmology & The Dark Universe |
| `galaxies` | Galaxy Evolution & Formation |
| `dense-stellar` | Dense Stellar Systems & High-Energy Astrophysics |
| `agn` | Active Galactic Nuclei |
| `surveys` | Multi-Wavelength Survey Science & Data Analytics |
| `cultural` | Cultural & Indigenous Astronomy |
| `exoplanets` | Exoplanetary Science & Habitability |
| `stars` | Stellar Astrophysics & Space Weather |
| `solar-system` | Solar System & Orbital Dynamics |

## CSV columns

### `research-theme-members.csv`

| Column | Required | Description |
| --- | --- | --- |
| `theme_id` | yes | One of the IDs in the table above. |
| `theme_title` | optional | Pre-filled human-readable title for convenience. |
| `member_name` | yes | Full name; should match `Quasar Members.xlsx`. |
| `affiliation` | optional | E.g. `UQ`, `QUT`, `UniSQ`, or full department. |
| `role` | optional | E.g. `Lead`, `Co-investigator`, `Postdoc`, `HDR student`. |
| `is_lead` | optional | `yes` / `no`. Used to highlight theme leads. |
| `email` | optional | Contact email. Leave blank if you'd rather link to the member page. |
| `website` | optional | Personal or institutional profile URL. |
| `notes` | optional | Anything that doesn't fit the other columns. |

### `research-theme-links.csv`

| Column | Required | Description |
| --- | --- | --- |
| `theme_id` | yes | One of the IDs in the table above. |
| `theme_title` | optional | Pre-filled human-readable title for convenience. |
| `link_type` | yes | One of: `project`, `facility`, `survey`, `paper`, `dataset`, `software`, `outreach`, `other`. |
| `label` | yes | Short display text for the link (e.g. `ASKAP`, `Hector Galaxy Survey`). |
| `url` | optional | Full URL including `https://`. Leave blank if internal-only. |
| `description` | optional | One-line description shown next to the label. |

## Workflow

1. Open `research-themes-content.md` and fill in the fields under each theme
   heading. Anything left blank will simply not be added to the page when the
   data is later wired up.
2. Open `research-theme-members.csv` in Excel and add one row per member you
   want listed under each theme. Member names should match those in
   `Quasar Members.xlsx` so we can cross-link them later.
3. Open `research-theme-links.csv` in Excel and add one row per project,
   facility, paper, or resource you want listed under a theme.
4. When ready, ping the developer to wire the data into the static pages.

## Optional: keep working in Excel

Excel will open the `.csv` files directly. If you prefer to keep them as
`.xlsx`, save a copy with `File > Save As > Excel Workbook (.xlsx)` and edit
that — but please export back to `.csv` (UTF-8) before committing, so the
files stay diff-friendly and stdlib-parseable.
