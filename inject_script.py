import os
import glob

files = glob.glob(r"c:\Users\uqmhooym\GitHub\quasarcollaboration.github.io\pages\*.html")

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if components.js is already injected
    if 'components.js' in content:
        print(f"Already injected in {fpath}")
        continue
    
    # Replace the theme-toggle.js with components.js + theme-toggle.js
    old_str = '<script src="../assets/js/theme-toggle.js" defer></script>'
    new_str = '<script src="../assets/js/components.js" defer></script>\n    <script src="../assets/js/theme-toggle.js" defer></script>'
    
    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Injected into {fpath}")
    else:
        print(f"Could not find exact string in {fpath}")
