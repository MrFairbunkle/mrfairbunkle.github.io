import random, os, openai, anvil

site_name = input("What is your site called? ")
site_col = input("What would you like the main colour to be? ")
site_sections = input("What sections would you like? Please separate with commas. ")

sections = site_sections.split(", ")
print(sections)
print(len(sections))

html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{site_name}</title>
    <style>
        body {{
            background-color: {site_col};
        }}
    </style>
</head>
<body>
"""

for section in sections:
    html += f"""
    <h1>{section}</h1>
    <p>This is filler text</p>
    <br>
    """

html += """
</body>
</html>
"""

html_file_path = "C:\\Users\\22CfAiRbAnKs-WeStOn.TGS\\Desktop\\A-Level-Repo\\site.html"

try:
    with open(html_file_path, 'w') as file:
        file.write(html)
    print(f"The content has been saved to {html_file_path}")
except Exception as e:
    print(f"An error occurred while writing to the file: {str(e)}")
