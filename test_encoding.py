import base64
import re

with open('data.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines:
    match = re.search(r'^\s*"[^"]+"\s*:\s*"([^"]+)"', line)
    if match:
        b64 = match.group(1)
        html = base64.b64decode(b64).decode('utf-8')
        if 'KAPLİNLER' in html:
            print("SUCCESS: Characters are correct.")
        elif 'KAPL' in html:
            print("FAILED: Found corrupted characters near KAPL.")
        else:
            print("Could not find KAPL string.")
        break
