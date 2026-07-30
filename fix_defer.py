import os
import glob

html_files = glob.glob('*.html')
count = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = content.replace(' defer></script>', '></script>')
    
    if content != modified:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(modified)
        count += 1
print(f"Fixed {count} files.")
