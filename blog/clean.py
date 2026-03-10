import re

with open('blog/Popular Famous Temple/Akilandeswari Temple - Tamil Nadu.docx.txt', 'r', encoding='utf-8') as f:
    content = f.read()

def clean_txt_lines(content):
    lines = content.strip().split('\n')
    cleaned = []
    
    question_regex = re.compile(r'^[\*\s]*\d+\s*[\.\)\]\s]+(.*)', re.IGNORECASE)
    skip_next = 0
    
    for line in lines:
        sline = line.strip()
        lower_sline = sline.lower()
        
        # Determine if we should skip this line because of previous multi-line prompt
        should_skip = False
        if skip_next > 0:
            if sline.startswith('*') or sline.startswith('.') or sline.startswith('a.') or sline.startswith('b.') or sline.startswith('c.') or sline.startswith('d.') or sline.startswith('-'):
                skip_next -= 1
                should_skip = True
            else:
                skip_next = 0
                
        # Handle numbered prompts
        match = question_regex.match(sline)
        if match:
            if 'opening' in lower_sline and 'closing' in lower_sline: 
                skip_next = 2
                should_skip = True
            elif 'entry fee' in lower_sline: 
                skip_next = 1
                should_skip = True
            elif 'special pooja' in lower_sline and 'rituals' in lower_sline: 
                skip_next = 1
                should_skip = True
            elif 'special significance' in lower_sline: 
                skip_next = 1
                should_skip = True
            elif 'call to action' in lower_sline or 'interaction link' in lower_sline: 
                skip_next = 4
                should_skip = True
            elif any(k in lower_sline for k in ['name:', 'full address', 'how to reach', 'online service', 'dress code', 'electronic gadget', 'photography', 'lift', 'wheelchair', 'special entry', 'vehicle pooja', 'does the temple provide accommodation', 'parking place', 'temple prashad services', 'carry home', 'procedure for reporting', 'group members is missing', 'registered under the state', 'how can one make donations', 'privileges associated', 'construction/', 'information which a foreigner', 'annual event', 'monthly event']):
                should_skip = True
                
        # Extra prompt parts that are on new lines
        if lower_sline.startswith('.what are the rates') or lower_sline.startswith('. what privilege') or lower_sline.startswith('* “ the region') or lower_sline.startswith('* . what privilege') or lower_sline.startswith('phone(s)/contact number') or lower_sline.startswith('.what are') or lower_sline.startswith('what privilege does it grant'):
            should_skip = True
            
        if not should_skip:
            cleaned.append(line)
            
    return '\n'.join(cleaned)

file_out = clean_txt_lines(content)
with open('cleaned_test.txt', 'w', encoding='utf-8') as f:
    f.write(file_out)
