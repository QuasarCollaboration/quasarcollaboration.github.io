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
    
    replacement_start = r'\1flex items-center gap-4 group\3'
    # Actually wait we want to inject the img as well.
    # So we replace the match with:
    # <a href="..." class="flex items-center gap-4 group">
    #     <img src="..." ... />
    #     <div class="block">
    #         <h1...
    
    def repl_start(m):
        return (f'{m.group(1)}flex items-center gap-4 group">\n'
                f'                        <img src="{img_src}" alt="QUASAR Logo" class="h-14 w-auto object-contain transition-transform group-hover:scale-105" />\n'
                f'                        <div class="block">\n'
                f'                            <h1')
    
    # For the ending tag, we need to inject closing div just before </a>
    # The block ends with: </p>\n                    </a>
    
    content_new = re.sub(
        r'(<a\s+href="' + re.escape(href_val) + r'"\s+class=")block group(">\s*<h1)',
        repl_start,
        content
    )
    
    # Now close the div before </a>
    # We find the specific </a> that matches the branding section. 
    # To be safe, we just find the whole block:
    # <p>...QUEENSLAND...RESEARCH</p></a>
    
    content_new = re.sub(
        r'(<span[^>]*>R</span>esearch\s*</p>\s*)(</a>)',
        r'\1    </div>\n                    \2',
        content_new
    )
    
    if content != content_new:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content_new)
        print(f"Updated {file_path}")
    else:
        print(f"No changes made to {file_path}")

