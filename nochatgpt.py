import random, os

# Variables
html_file_path = "site.html"
css_file_path = "style.css"

# Inputs from user
site_name = input("What is your site called? ")
site_sections = input("What sections would you like? Please separate with commas and spaces. ")
site_col_choice = input("What would you like the main color to be? Please use rgb. ")
text_col_choice = input("What would you like the text color to be? Please use rgb. ")
site_col = site_col_choice
text_col = text_col_choice

# Preset options
presets = {
    "Reset": {
        "site_col": site_col_choice,
        "text_col": text_col_choice
    },
    "Test1": {
        "site_col": "#ff0000",
        "text_col": "#0000ff"
    },
    "Test2": {
        "site_col": "#333",
        "text_col": "#fff"
    },
    "Test3": {
        "site_col": "#fff",
        "text_col": "#333"
    }
}

# Converts preset options to strings so that the thing below works 
preset_options = ", ".join(presets.keys()) # This was chatgpt

option="" 
while True:
    preset = input("Would you like to use a preset? (Overwrites your color choices) Y/N ").title()
    if preset == "Y":
        option = input(f"Choose a preset ({preset_options}): ").title()
        
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
            color: #000;
            border: 1px solid #ccc;
            padding: 10px;
            width: 200px;
        }}
        .menu-options h3 {{
            margin: 0;
            margin-bottom: 10px;
            background-color: #fff;
            color: #000;
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
        """

# if option in presets:
#     if option == "Test1":
#         html += """
#         <nav>
#         """
        
#         for section_name in section_names:
#             html += """
#                 <li>
#                     <a href="#{section_name}">{section_name}</a>
#                 </li>
#             """

#         html += """
#         </nav>
#         """

#         html += """
#         <style>
#             .nav {{
            
#             }}
#         </style>
#             """

html += f"""
    <script>
        const presets = {presets}; 

        function toggleMenu() {{
            const menu = document.querySelector('.menu-options');
            menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
        }}

        function applyPreset(color, textColor) {{
            document.body.style.backgroundColor = color;
            document.body.style.color = textColor;
        }}

        window.onload = function() {{
            const menuOptions = document.querySelector('.menu-options');
            for (let preset in presets) {{
                const btn = document.createElement('button');
                btn.textContent = preset;
                btn.onclick = function() {{
                    applyPreset(presets[preset].site_col, presets[preset].text_col);
                }};
                menuOptions.appendChild(btn);
            }}
        }};
    </script>
</head>
<body>
    <h1>{site_name}</h1>
    <div class="menu" onclick="toggleMenu()">Menu</div>
    <div class="menu-options">
        <h3>Choose a Preset</h3>
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
