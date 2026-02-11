# QUASAR Collaboration Website

The official website for the **QUASAR Collaboration** (Queensland Universities Astronomy & Space Research), a joint initiative bringing together researchers, students, and staff from:
*   **University of Queensland (UQ)**
*   **Queensland University of Technology (QUT)**
*   **University of Southern Queensland (UniSQ)**

The website serves as a hub for showcasing research themes, member profiles, news, and upcoming events/seminars.

## Features

*   **Responsive Design**: Fully responsive layout using **Tailwind CSS**.
*   **Dark Mode**: Native dark mode support with a theme toggle.
*   **Dynamic Member Loading**: Member profiles are generated from an Excel spreadsheet and loaded dynamically via JSON/JS to avoid manual HTML editing.
*   **Glassmorphism UI**: Modern aesthetic with glass-panel effects.

## Tech Stack

*   **HTML5**
*   **Tailwind CSS** (via CDN for simplicity, no build step required for CSS).
*   **JavaScript (Vanilla)**
*   **Python 3** (for data processing utilities).

## Project Structure

```bash
├── assets/
│   ├── css/            # Custom styles (style.css)
│   ├── img/            # Images and logos
│   └── js/             # Scripts (theme-toggle, members_data.js)
├── pages/              # Individual content pages (about, members, news, etc.)
├── generate_members.py # Python script to convert Excel data to JS
├── inspect_headers.py  # Utility to inspect Excel headers
├── Quasar Members.xlsx # Source of truth for member data
├── index.html          # Homepage
└── README.md           # This file
```

## Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/quasarcollaboration/quasarcollaboration.github.io.git
    cd quasarcollaboration.github.io
    ```

2.  **Run a local server**:
    Since this is a static site, you can use Python's built-in HTTP server or any other static file server.
    ```bash
    python -m http.server
    ```
    Open `http://localhost:8000` in your browser.

## Updating Members

The members list on the "Members" page is populated dynamically from an Excel file. **Do not edit `pages/members.html` manually to add/remove members.**

### Workflow

1.  **Update the Excel File**:
    *   Open `Quasar Members.xlsx`.
    *   Add, remove, or modify rows.
    *   Ensure columns match the expected headers (Name, Affiliation, Location, etc.).
    *   **Save** the file.

2.  **Run the Generation Script**:
    You need Python 3 installed. Run the script to parse the Excel file and update `assets/js/members_data.js`.
    ```bash
    python generate_members.py
    ```
    *If successful, it will output: `Successfully converted X members to assets/js/members_data.js`*

3.  **Verify Changes**:
    *   Open `pages/members.html` locally to double-check the updates.

4.  **Commit and Push**:
    ```bash
    git add "Quasar Members.xlsx" "assets/js/members_data.js"
    git commit -m "Update members list"
    git push
    ```

## License

&copy; 2026 QUASAR Collaboration. All rights reserved.
