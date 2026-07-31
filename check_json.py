import json
import codecs

try:
    with codecs.open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()

    start = content.find('{')
    end = content.rfind('}')
    json_str = content[start:end+1]
    
    data = json.loads(json_str)
    print("SUCCESS: JSON is valid")
    print("Keys found:", len(data))
except json.JSONDecodeError as e:
    print("JSONDecodeError:", e)
    # Print the exact location context
    lines = json_str.split('\n')
    line_idx = e.lineno - 1
    print("Line", e.lineno, ":", lines[line_idx])
    if line_idx > 0:
        print("Prev line:", lines[line_idx-1])
except Exception as e:
    print("Error:", e)
