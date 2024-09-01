import random, os, openai, anvil

# Variables
#html_file_path = "C:\\Users\\22CfAiRbAnKs-WeStOn.TGS\\Desktop\\A-Level-Repo\\site.html"
#html_file_path = "E:\Stuff\Things\VSCODE\A-Level-Repo\site.html"
html_file_path = "site.html"
css_file_path = "style.css"

# Inputs from user
site_name = input("What is your site called? ")
site_sections = input("What sections would you like? Please separate with commas. ")
site_col = input("What would you like the main colour to be? ")
text_col = input("What would you like the text colour to be? ")

# CSS presets
base = f"""
body {{
            background-color: {site_col};
            color: {text_col};
        }}
        h1 {{
            text-align: center;
        }}
"""

professional = f"""

"""
while True:
    preset = input("Would you like to use a preset? (Overwrites your colour choices) Y/N ").upper()
    if preset == "Y":
        options = input("Professional, ")
    elif preset == "N":
        try:
            with open(css_file_path, 'w') as file:
                file.write(base)
            print(f"The content has been saved to {css_file_path}")
        except Exception as e:
            print(f"An error occurred while writing to the file: {str(e)}")
        break

# Makes correct number of sections
sections = site_sections.split(", ")
print(sections)
print(len(sections))

# Basic skeleton
html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="style.css">
    <title>{site_name}</title>
</head>
<body>
    <h1>{site_name}</h1>
    <br>
"""

for section in sections:
    html += f"""
    <h2>{section}</h2>
    <p>This is filler text</p>
    <br>
    """

html += """
</body>
</html>
"""

try:
    with open(html_file_path, 'w') as file:
        file.write(html)
    print(f"The content has been saved to {html_file_path}")
except Exception as e:
    print(f"An error occurred while writing to the file: {str(e)}")
