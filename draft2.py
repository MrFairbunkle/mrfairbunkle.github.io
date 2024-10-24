import os

# File paths
html_file_path = "site.html"

# User input for site customization
site_name = input("What is your site called? ")
sections = input("What sections would you like (comma separated)? ")
main_color = input("Enter main background color: #")
text_color = input("Enter main text color: #")

# Preset options
presets = {
    "Reset": {
        "site_col": "#"+main_color,
        "text_col": "#"+text_color
    },
    "Blueish": {
        "site_col": "#073a69",
        "text_col": "#b4b6b8"
    },
    "Professional": {
        "site_col": "#F9F6EF",
        "text_col": "#282828"
    },
    "Test3": {
        "site_col": "#fff",
        "text_col": "#333"
    }
}

# Make presets work for js
# presets_js = str(presets).replace("'", '"')

# Add "#" prefix automatically
main_color = f"#{main_color}"
text_color = f"#{text_color}"

# Creating HTML structure dynamically
sections = sections.split(", ")

# HTML and JavaScript content for enabling Edit Mode
html_content = f"""
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Drag & Drop Test</title>
    </head>
    <body>
    <h1>{site_name}</h1>
    <div class="menu" onclick="toggleMenu()">Menu</div>
    <div class="menu-options">
        <h3>Choose a Preset</h3>    
        <div id="custom-colors">
            <label for="bg-color">Background Color:</label><br>
            <input type="color" id="bg-color" name="bg-color" value="{main_color}"><br>
            <label for="text-color">Text Color:</label><br>
            <input type="color" id="text-color" name="text-color" value="{text_color}"><br>
            <button onclick="applyCustomColors()">Apply Custom Colors</button>
            <button onclick="saveCustomPreset()">Save Custom Preset</button>
        </div>
    </div>
    <button id="edit-btn">Enable Edit Mode</button>
        <div class="container">
            <div id="left">
            """
for section in sections:
    html_content += f"""
    <div class="list" draggable="false">{section}</div>
    """
html_content += """
            </div>
            <div id="right">
            </div>
        </div>
    <script>
        let editMode = false;
        const editButton = document.getElementById('edit-btn');
        const leftBox = document.getElementById('left');
        const rightBox = document.getElementById('right');
        const lists = document.getElementsByClassName('list');

        function toggleEditMode() {
            editMode = !editMode;
            if (editMode) {
                editButton.textContent = 'Disable Edit Mode';
                leftBox.style.border = '2px dashed #ffffff';
                rightBox.style.border = '2px dashed #ffffff';

                for (let list of lists) {
                    list.setAttribute('draggable', 'true');
                }
            } else {
                editButton.textContent = 'Enable Edit Mode';
                leftBox.style.border = 'none';
                rightBox.style.border = 'none';

                for (let list of lists) {
                    list.setAttribute('draggable', 'false');
                }
            }
        }

        editButton.addEventListener('click', toggleEditMode);

        for (let list of lists) {
            list.addEventListener('dragstart', function(e) {
                if (editMode) {
                    let selected = e.target;

                    leftBox.addEventListener('dragover', function(e) {
                        e.preventDefault();
                    });

                    leftBox.addEventListener('drop', function(e) {
                        if (editMode) {
                            leftBox.appendChild(selected);
                            selected = null;
                        }
                    });

                    rightBox.addEventListener('dragover', function(e) {
                        e.preventDefault();
                    });

                    rightBox.addEventListener('drop', function(e) {
                        if (editMode) {
                            rightBox.appendChild(selected);
                            selected = null;
                        }
                    });
                }
            });
        }
        """

html_content += f"""
        const presets = {presets}; 

        function toggleMenu() {{
            const menu = document.querySelector('.menu-options');
            menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none'; // ChatGPT Magic
        }}

        function applyPreset(color, textColor) {{
            document.body.style.backgroundColor = color;
            document.body.style.color = textColor;
        }}

        function showCustomColors() {{
            const customColorsDiv = document.getElementById('custom-colors');
            customColorsDiv.style.display = 'block';
        }}

        function applyCustomColors() {{
            const bgColor = document.getElementById('bg-color').value;
            const textColor = document.getElementById('text-color').value;
            applyPreset(bgColor, textColor);
        }}

        function saveCustomPreset() {{
            const presetName = prompt('Enter a name for your custom preset:');
            if (presetName) {{
                const bgColor = document.getElementById('bg-color').value;
                const textColor = document.getElementById('text-color').value;
                presets[presetName] = {{
                    site_col: bgColor,
                    text_col: textColor
                }};
                addPresetButton(presetName);
            }}
        }}

        function addPresetButton(presetName) {{
            const menuOptions = document.querySelector('.menu-options');
            const btn = document.createElement('button');
            btn.textContent = presetName;
            btn.onclick = function() {{
                applyPreset(presets[presetName].site_col, presets[presetName].text_col);
            }};
            menuOptions.appendChild(btn);
        }}

        window.onload = function() {{
            const menuOptions = document.querySelector('.menu-options');
            for (let preset in presets) {{
                addPresetButton(preset);
            }}
            const customBtn = document.createElement('button');
            customBtn.textContent = 'Custom';
            customBtn.onclick = showCustomColors;
            menuOptions.appendChild(customBtn);
        }};
    </script>
    """
html_content += f"""
    <style>
    * {{
    margin: 0;
    padding: 0;
    font-family:'Courier New', Courier, monospace;
    box-sizing: border-box;
    background: {main_color};
    color: {text_color};
    }}

    .container {{
        width: 100%;
        min-height: 100vh;
        background: {main_color};
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
    }}

    #left, #right {{
        width: 300px;
        min-height: 400px;
        margin: 2px;
        border: none;
        transition: border 0.3s ease;
    }}

    .list {{
        background: #e91e63;
        height: 60px;
        margin: 30px;
        color: #ffffff;
        display: flex;
        align-items: center;
        cursor: grab;
    }}

    #edit-btn {{
        background: #00bcd4;
        color: ffffff;
        padding: 10px 20px;
        margin-bottom: 20px;
        border: none;
        cursor: pointer;
    }}

    #edit-btn:hover {{
        background: #0097a7;
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

    #custom-colors {{
        display: none;
        margin-top: 10px;
    }}

    #custom-colors input[type='color'] {{ // This allows for a custom colour to be selected
        margin-bottom: 10px;
    }}
    </style>
    </body>
</html>
"""

# Write the content to an HTML file
with open(html_file_path, 'w') as f:
    f.write(html_content)

print(f"Website saved as {html_file_path}.")
