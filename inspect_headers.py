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
    except Exception as e:
        print(f"Error parsing shared strings: {e}")
        return []

def get_headers(file_path):
    headers = {}
    with zipfile.ZipFile(file_path, 'r') as z:
        shared_strings = parse_shared_strings(z)

        with z.open('xl/worksheets/sheet1.xml') as f:
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            tree = ET.parse(f)
            root = tree.getroot()
            
            sheet_data = root.find('.//ns:sheetData', ns)
            if sheet_data is None:
                # Try without namespaces if failed
                 sheet_data = root.find('.//{*}sheetData')

            first_row = sheet_data.find('.//ns:row', ns)
            if first_row is None:
                 first_row = sheet_data.find('.//{*}row')
                 
            if first_row is not None:
                for cell in first_row.findall('.//ns:c', ns):
                    ref = cell.attrib.get('r')
                    t = cell.attrib.get('t')
                    v = cell.find('.//ns:v', ns)
                    value = v.text if v is not None else ""
                    
                    if t == 's': 
                        try:
                            value = shared_strings[int(value)]
                        except (ValueError, IndexError):
                            value = ""
                    
                    col_match = re.match(r"([A-Z]+)([0-9]+)", ref)
                    if col_match:
                        col_letter = col_match.group(1)
                        headers[col_letter] = value.strip()
    return headers

try:
    headers = get_headers('Quasar Members.xlsx')
    print("Headers found in Excel:")
    for col, name in headers.items():
        print(f"{col}: {name}")
except Exception as e:
    print(f"Error: {e}")
