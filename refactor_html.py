import os
import re

base_dir = r"c:\Users\uqmhooym\GitHub\quasarcollaboration.github.io"
files = [
    "index.html",
    "pages/about.html",
    "pages/contact.html",
    "pages/members.html",
    "pages/news.html",
    "pages/projects.html",
    "pages/research.html",
    "pages/schedule.html"
]

header_pattern = re.compile(r'<header[^>]*>.*?</header>', re.DOTALL)
footer_pattern = re.compile(r'<footer[^>]*class="([^"]+)"[^>]*>.*?</footer>', re.DOTALL)

for fpath in files:
    full_path = os.path.join(base_dir, fpath)
    if not os.path.exists(full_path):
        print("Skipping (not found):", full_path)
        continue
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    is_index = fpath == "index.html"
    base_path = "./" if is_index else "../"
    active_page = "home" if is_index else os.path.basename(fpath).replace(".html", "")

    # Replace header
    content = header_pattern.sub(f'<layout-header base-path="{base_path}" active-page="{active_page}"></layout-header>', content)

    # Replace footer
    def footer_repl(match):
        classes = match.group(1)
        # remove default classes
        defaults = ["relative", "z-10", "border-t", "border-indigo-100", "glass-panel"]
        custom = [c for c in classes.split() if c not in defaults]
        custom_str = " ".join(custom)
        if custom_str:
            return f'<layout-footer custom-classes="{custom_str}"></layout-footer>'
        else:
            return '<layout-footer></layout-footer>'

    content = footer_pattern.sub(footer_repl, content)

    # Insert components.js
    theme_script = f'{base_path.replace("./", "")}assets/js/theme-toggle.js'
    components_script = f'{base_path.replace("./", "")}assets/js/components.js'

    if f'<script src="{components_script}"' not in content:
        # insert before theme-toggle.js
        content = content.replace(
            f'<script src="{theme_script}" defer></script>',
            f'<script src="{components_script}" defer></script>\n    <script src="{theme_script}" defer></script>'
        )
    else:
        print("Already injected components in:", fpath)

    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
