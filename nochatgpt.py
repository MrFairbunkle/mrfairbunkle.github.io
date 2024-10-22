import os

# File paths
html_file_path = "site.html"

# User input for site customization
site_name = input("What is your site called? ")
sections = input("What sections would you like (comma separated)? ")
main_color = input("Enter main background color: #")
text_color = input("Enter main text color: #")

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
        <link rel="stylesheet" href="drag-and-drop-test.css"> 
    </head>
    <body>
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
        let editMode = false;  // Track whether we are in edit mode
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
    </script>
    <style>
    * {
    margin: 0;
    padding: 0;
    font-family:'Courier New', Courier, monospace;
    box-sizing: border-box;
    }

    .container {
        width: 100%;
        min-height: 100vh;
        background: #0b0423;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
    }

    #left, #right {
        width: 300px;
        min-height: 400px;
        margin: 2px;
        border: none;
        transition: border 0.3s ease;
    }

    .list {
        background: #e91e63;
        height: 60px;
        margin: 30px;
        color: #ffffff;
        display: flex;
        align-items: center;
        cursor: grab;
    }

    #edit-btn {
        background: #00bcd4;
        color: white;
        padding: 10px 20px;
        margin-bottom: 20px;
        border: none;
        cursor: pointer;
    }

    #edit-btn:hover {
        background: #0097a7;
    }
    </style>
    </body>
</html>
"""

# Write the content to an HTML file
with open(html_file_path, 'w') as f:
    f.write(html_content)

print(f"Website saved as {html_file_path}.")
