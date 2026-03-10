import os
try:
    from PIL import Image
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow"])
    from PIL import Image

def process_image(path):
    if not os.path.exists(path):
        print(f"Not found: {path}")
        return
        
    try:
        img = Image.open(path).convert("RGBA")
        datas = img.getdata()
        
        new_data = []
        for item in datas:
            # Check if pixel is white or very close to white
            if item[0] > 235 and item[1] > 235 and item[2] > 235:
                # Make transparent
                new_data.append((255, 255, 255, 0))
            else:
                # Keep original color
                # Optional: if it is anti-aliased edge, we might want to adjust alpha
                # But simple thresholding works mostly fine for silhouetting with brightness-0 invert
                new_data.append(item)
                
        img.putdata(new_data)
        
        # Save as a transparent PNG
        img.save(path, "PNG")
        print(f"Processed and made transparent: {path}")
    except Exception as e:
        print(f"Error processing {path}: {e}")

process_image(r"m:\GitHub\quasarcollaboration.github.io\assets\img\UQ Quasar - Official Logo.png")
process_image(r"m:\GitHub\quasarcollaboration.github.io\assets\img\UQ Quasar - Official Logo with text.png")
