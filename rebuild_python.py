import json
import base64

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

main_start_tag = '<main class="page-content">'
index_top = index_content[:index_content.find(main_start_tag) + len(main_start_tag)]
index_bottom = index_content[index_content.find('</main>'):]

with open('data.js', 'r', encoding='utf-8') as f:
    data_content = f.read()

# Extract JSON string
json_start = data_content.find('{')
json_end = data_content.rfind('}') + 1
json_str = data_content[json_start:json_end]

page_data = json.loads(json_str)
count = 0

for key, b64 in page_data.items():
    if not b64: continue
    
    html_bytes = base64.b64decode(b64)
    html = html_bytes.decode('utf-8')
    
    main_start = html.find(main_start_tag)
    if main_start == -1:
        main_start = html.find('<main')
        
    main_end = html.find('</main>')
    
    if main_start >= 0 and main_end > main_start:
        main_start_tag_end = html.find('>', main_start) + 1
        main_content = html[main_start_tag_end:main_end]
        
        # Remove old KVKK block if it exists
        kvkk_index = main_content.find('<div id="kvkkModalBackdrop"')
        if kvkk_index >= 0:
            main_content = main_content[:kvkk_index]
            
        new_html = index_top + main_content + index_bottom
        new_b64 = base64.b64encode(new_html.encode('utf-8')).decode('utf-8')
        
        page_data[key] = new_b64
        count += 1

new_json_str = json.dumps(page_data, ensure_ascii=False)
final_content = 'window.PAGE_DATA = ' + new_json_str + ';\n'

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(final_content)

print(f"Rebuilt {count} payloads in data.js using Python.")
