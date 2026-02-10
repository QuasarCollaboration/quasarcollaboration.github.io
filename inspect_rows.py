import zipfile
import xml.etree.ElementTree as ET
import re

def parse_shared_strings(z):
    try:
        with z.open('xl/sharedStrings.xml') as f:
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            tree = ET.parse(f)
            root = tree.getroot()
            shared_strings = []
            for t in root.findall('.//ns:t', ns):
                shared_strings.append(t.text if t.text else "")
            return shared_strings
    except KeyError:
        return []

def inspect_rows(file_path, num_rows=5):
    with zipfile.ZipFile(file_path, 'r') as z:
        shared_strings = parse_shared_strings(z)
        
        with z.open('xl/worksheets/sheet1.xml') as f:
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            tree = ET.parse(f)
            root = tree.getroot()
            
            sheet_data = root.find('.//ns:sheetData', ns)
            if sheet_data is None:
                 sheet_data = root.find('.//{*}sheetData')

            row_count = 0
            # Find all rows (findall) to iterate
            rows_iter = sheet_data.findall('.//ns:row', ns)
            if not rows_iter:
                rows_iter = sheet_data.findall('.//{*}row')

            for row in rows_iter:
                if row_count >= num_rows:
                    break
                
                print(f"--- Row {row.attrib.get('r')} ---")
                for cell in row.findall('.//ns:c', ns) or row.findall('.//{*}c'):
                    ref = cell.attrib.get('r')
                    t = cell.attrib.get('t')
                    v = cell.find('.//ns:v', ns)
                    if v is None: v = cell.find('.//{*}v')
                    
                    value = v.text if v is not None else ""
                    
                    if t == 's': 
                        try:
                            value = shared_strings[int(value)]
                        except (ValueError, IndexError):
                            value = ""
                    
                    print(f"  {ref}: {value}")
                row_count += 1

try:
    inspect_rows('Quasar Members.xlsx')
except Exception as e:
    print(f"Error: {e}")
