import os
import glob
import re

base_dir = r"m:\GitHub\quasarcollaboration.github.io"
index_file = os.path.join(base_dir, "index.html")
pages_files = glob.glob(os.path.join(base_dir, "pages", "*.html"))

all_files = [index_file] + pages_files

for file_path in all_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    is_index = file_path == index_file
    
    img_src = 'assets/img/UQ Quasar - Official Logo.png' if is_index else '../assets/img/UQ Quasar - Official Logo.png'
    
    # We want to replace the existing image tag we inserted previously.
    # The previous tag looked like:
    # <img src="..." alt="QUASAR Logo" class="h-14 w-auto object-contain dark:brightness-0 dark:invert transition-transform group-hover:scale-105" />
    
    # We'll use a regex to find any img tag inside the flex container we made and replace it.
    # Or, more simply, just replace the exact img tag line.
    
    new_img_tag = f'<img src="{img_src}" alt="QUASAR Logo" class="h-14 w-auto object-contain transition-transform group-hover:scale-105" />'
    
    # Regex to find the img tag. It might have either the old or new src, and might have the dark classes.
    pattern = re.compile(r'<img src="[^"]+" alt="QUASAR Logo" class="[^"]+" />')
    
    content_new = pattern.sub(new_img_tag, content)
    
    if content != content_new:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content_new)
        print(f"Updated {file_path}")
    else:
        print(f"No changes made to {file_path}")

