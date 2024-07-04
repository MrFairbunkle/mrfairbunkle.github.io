import random, os

site_name = input("What is your site called? ")
site_col = input("What would you like the main colour to be? ")
site_sections = input("What sections would you like? Please separate with commas. ")

section=[]
section.append(site_sections.split(", "))
print(section)
print(len(section[0]))

html = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{site_name}</title>
</head>
<body>
"""

for section in section:
    html += f"""
    <h1>{section}</h1>
    <p>This is filler text</p>
    <br>
    """

html += """
</body>
</html>
"""

html_file_path = "site.html"

try:
    with open(html_file_path, 'w') as file:
        file.write(html)
    print(f"The content has been saved to {html_file_path}")
except Exception as e:
    print(f"An error occurred while writing to the file: {str(e)}")

# $env:OPENAI_API_KEY='your-api-key-here'
# openai.api_key = os.getenv('OPENAI_API_KEY')
