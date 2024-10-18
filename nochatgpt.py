import os

# File paths
html_file_path = "site.html"

# User input for site customization
site_name = input("What is your site called? ")
sections = input("What sections would you like (comma separated)? ")
main_color = input("Enter main background color (hex, without #): ")
text_color = input("Enter main text color (hex, without #): ")

# Add "#" prefix automatically
main_color = f"#{main_color}"
text_color = f"#{text_color}"

# Creating HTML structure dynamically
sections = sections.split(", ")

html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{site_name}</title>
    <style>
        body {{
            background-color: {main_color};
            color: {text_color};
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
            background-color: white;
            border: 1px solid black;
            padding: 10px;
            width: 200px;
        }}
        .menu-options h3 {{
            margin-top: 0;
        }}
        .menu-options button {{
            width: 100%;
            margin-bottom: 10px;
        }}
        section {{
            padding: 20px;
            margin: 20px 0;
            border: 1px solid black;
        }}
        .editable {{
            cursor: pointer;
            border: 1px dashed gray;
        }}
        img {{
            max-width: 100%;
        }}
    </style>
    <script>
        function toggleMenu() {{
            const menu = document.querySelector('.menu-options');
            menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
        }}

        function applyStyle(element, property, value) {{
            document.querySelector(element).style[property] = value;
        }}

        function moveElement(id) {{
            const element = document.getElementById(id);
            element.style.position = 'relative';
            const newTop = prompt('Enter the top position (e.g., 50px):');
            const newLeft = prompt('Enter the left position (e.g., 50px):');
            element.style.top = newTop;
            element.style.left = newLeft;
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
        <h3>Edit Elements</h3>
        <button onclick="applyStyle('body', 'backgroundColor', prompt('Enter background color (hex, without #):'))">Change Background</button>
        <button onclick="applyStyle('body', 'color', prompt('Enter text color (hex, without #):'))">Change Text Color</button>
        <button onclick="moveElement('{sections[0]}')">Move Section</button>
        <h3>Insert Image</h3>
        <input type="file" id="image-upload" accept="image/*" onchange="addImageToSection('{sections[0]}', event)">
    </div>

    <div class="content">
"""

# Dynamically generate sections
for section in sections:
    html_content += f"""
    <section id="{section}" class="editable">
        <h2>{section}</h2>
        <p>This is the {section} section. Click to edit!</p>
    </section>
    """

html_content += """
    </div>

    <script>
        function addImageToSection(sectionId, event) {{
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {{
                const section = document.getElementById(sectionId);
                const img = document.createElement('img');
                img.src = e.target.result;
                section.appendChild(img);
            }};
            reader.readAsDataURL(file);
        }}
    </script>

</body>
</html>
"""

# Write the content to an HTML file
with open(html_file_path, 'w') as f:
    f.write(html_content)

print(f"Website saved as {html_file_path}.")
