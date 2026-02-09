import zipfile
import xml.etree.ElementTree as ET
import json
import re

def parse_xlsx(file_path):
    with zipfile.ZipFile(file_path, 'r') as z:
        # 1. Parse Shared Strings
        try:
            with z.open('xl/sharedStrings.xml') as f:
                tree = ET.parse(f)
                root = tree.getroot()
                # Namespace (usually implicit in findall if not handled, but let's be safe)
                # The namespace usually looks like {http://schemas.openxmlformats.org/spreadsheetml/2006/main}
                # We can strip namespaces for easier parsing
                shared_strings = []
                for t in root.findall('.//{*}t'):
                    shared_strings.append(t.text if t.text else "")
        except KeyError:
            shared_strings = []

        # 2. Parse Sheet 1
        with z.open('xl/worksheets/sheet1.xml') as f:
            tree = ET.parse(f)
            root = tree.getroot()
            
            rows = []
            # Find all rows
            sheet_data = root.find('.//{*}sheetData')
            for row in sheet_data.findall('.//{*}row'):
                row_data = {}
                for cell in row.findall('.//{*}c'):
                    # Get cell reference (e.g., "A1")
                    ref = cell.attrib.get('r')
                    # Get type
                    t = cell.attrib.get('t')
                    # Get value
                    v = cell.find('.//{*}v')
                    value = v.text if v is not None else ""
                    
                    if t == 's': # Shared String
                        try:
                            value = shared_strings[int(value)]
                        except (ValueError, IndexError):
                            value = ""
                    
                    # Store by column letter
                    col_match = re.match(r"([A-Z]+)([0-9]+)", ref)
                    if col_match:
                        col_letter = col_match.group(1)
                        row_data[col_letter] = value.strip()
                
                if row_data:
                    rows.append(row_data)

    return rows

def process_members(rows):
    if not rows:
        return []

    # Assume first row is headers
    headers = rows[0]
    # Map column letters to header names
    col_map = {k: v for k, v in headers.items()}
    
    # Identify key columns based on known headers
    # Headers found: ['Name ', 'Affiliation', 'Location/Campus', 'Research Interests (Keywords)', 'Photo Link', 'Website Link', 'Position / Which career stage do you fall into?']
    
    key_map = {}
    for col, header in col_map.items():
        h = header.lower().strip()
        if 'name' in h: key_map['name'] = col
        elif 'affiliation' in h: key_map['affiliation'] = col
        elif 'location' in h: key_map['location'] = col
        elif 'interests' in h: key_map['interests'] = col
        elif 'photo' in h: key_map['photo'] = col
        elif 'website' in h: key_map['website'] = col
        elif 'position' in h or 'career' in h: key_map['role'] = col
        elif 'sub-field' in h or 'primary field' in h: key_map['primary_field'] = col

    members = []
    for row in rows[1:]: # Skip header
        member = {}
        # Get Name
        if 'name' in key_map:
            member['name'] = row.get(key_map['name'], "Unknown Name")
        
        # Skip empty rows
        if not member.get('name') or member['name'] == "Unknown Name":
            continue

        member['affiliation'] = row.get(key_map.get('affiliation', ''), "")
        member['location'] = row.get(key_map.get('location', ''), "")
        member['interests'] = row.get(key_map.get('interests', ''), "")
        member['primary_field'] = row.get(key_map.get('primary_field', ''), "")
        member['photo'] = row.get(key_map.get('photo', ''), "")
        member['website'] = row.get(key_map.get('website', ''), "")
        member['role'] = row.get(key_map.get('role', ''), "")
        
        # Clean up Data
        # Ensure external links have https
        if member['website'] and not member['website'].startswith('http'):
             member['website'] = 'https://' + member['website']

        members.append(member)

    return members

if __name__ == "__main__":
    try:
        raw_rows = parse_xlsx('Quasar Members.xlsx')
        members = process_members(raw_rows)
        
        # Output as JS file for static loading without fetch/CORS issues
        output_file = 'assets/js/members_data.js'
        
        # Ensure directory exists
        import os
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json_str = json.dumps(members, indent=2)
            f.write(f"window.membersData = {json_str};")
            
        print(f"Successfully converted {len(members)} members to {output_file}")
        
    except Exception as e:
        print(f"Error processing excel: {e}")

