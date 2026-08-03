import re
import sys

def transpile_template_literals(content):
    # Find all template literals
    def replace_literal(match):
        literal = match.group(0)
        # Remove the backticks
        inner = literal[1:-1]
        
        # Split by ${...}
        parts = []
        last_end = 0
        
        # Regex to find ${...}
        for m in re.finditer(r'\$\{([^}]+)\}', inner):
            # Text before the variable
            text = inner[last_end:m.start()]
            if text:
                # Escape quotes and newlines for normal string
                text = text.replace('\n', '\\n').replace('"', '\\"')
                parts.append(f'"{text}"')
            
            # The variable
            var = m.group(1)
            parts.append(f"({var})")
            
            last_end = m.end()
            
        # Text after the last variable
        text = inner[last_end:]
        if text:
            text = text.replace('\n', '\\n').replace('"', '\\"')
            parts.append(f'"{text}"')
            
        if not parts:
            return '""'
            
        return ' + '.join(parts)

    return re.sub(r'`[^`]*`', replace_literal, content)

with open('cart.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = transpile_template_literals(content)

with open('cart.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Done")
