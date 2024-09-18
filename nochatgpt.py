import random, os

# Variables
html_file_path = "site.html"
css_file_path = "style.css"

# Inputs from user
site_name = input("What is your site called? ")
site_sections = input("What sections would you like? Please separate with commas and spaces. ")
site_col = input("What would you like the main color to be? ")
text_col = input("What would you like the text color to be? ")

while True:
    preset = input("Would you like to use a preset? (Overwrites your color choices) Y/N ").title()
    if preset == "Y":
        option = input("Professional, ").title()
        
        # Preset options
        presets = {
            "Professional": {
                "site_col": "#333",
                "text_col": "#fff"
            }
        }
        
        if option in presets:
            site_col = presets[option]["site_col"]
            text_col = presets[option]["text_col"]
            break
        else:
            print("Invalid preset option.")
    elif preset == "N":
        break

# Makes correct number of sections
section_names = site_sections.split(", ")

# Basic skeleton
html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="style.css">
    <title>{site_name}</title>
    <style>
        body {{
            background-color: {site_col};
            color: {text_col};
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }}
        .menu {{
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #000;
            color: white;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
        }}
        .menu-options {{
            display: none;
            position: fixed;
            top: 60px;
            right: 20px;
            background-color: #fff;
            border: 1px solid #ccc;
            padding: 10px;
            width: 200px;
        }}
        .menu-options h3 {{
            margin: 0;
            margin-bottom: 10px;
        }}
        .menu-options button {{
            display: block;
            width: 100%;
            margin-bottom: 10px;
            padding: 5px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 3px;
        }}
    </style>
    <script>
        function toggleMenu() {{
            const menu = document.querySelector('.menu-options');
            menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
        }}

        function applyPreset(color, textColor) {{
            document.body.style.backgroundColor = color;
            document.body.style.color = textColor;
        }}
    </script>
</head>
<body>
    <h1>{site_name}</h1>
    <div class="menu" onclick="toggleMenu()">Menu</div>
    <div class="menu-options">
        <h3>Choose a Preset</h3>
        <button onclick="applyPreset('#333', '#fff')">Professional</button>
        <!-- Add more presets if needed -->
    </div>
    <br>
"""

for section_name in section_names:
    html += f"""
    <h2>{section_name}</h2>
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
