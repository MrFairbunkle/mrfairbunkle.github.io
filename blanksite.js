// DOM Elements
const toolbox = document.querySelector('.toolbox');
const workspace = document.getElementById('workspace');

// Set default settings
const GRID_SIZE = 20;
let snapToGrid = true;
let isDragging = false; 
let initialX, initialY, currentX, currentY;
let activeElement = null;
let selectedElement = null;

// Create UI elements
const createButton = (text, top, right, customStyles = {}) => { // Makes buttons with text content, positioning, and styling
    const btn = document.createElement('button'); // Creates blank button to be added to screen
    btn.textContent = text; // The text for the button
    Object.assign(btn.style, { // The various styling for the button
        position: 'absolute',
        width: '120px',
        top: `${top}px`,
        right: `${right}px`,
        zIndex: '1000',
        padding: '8px 16px',
        backgroundColor: '#A08970',
        color: '#F1E3C6',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.2s, transform 0.1s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        ...customStyles // S p r e a d function
    });
    
    // Add hover effect
    btn.addEventListener('mouseover', () => { // When hovering over button, apply styles
        btn.style.backgroundColor = '#b09a80';
        btn.style.transform = 'translateY(-2px)'; // Up a bit
    });
    
    btn.addEventListener('mouseout', () => { // When no longer hovering, reapply styles
        btn.style.backgroundColor = customStyles.backgroundColor || '#A08970';
        btn.style.transform = 'translateY(0)';
    });
    
    return btn;
};

// Create main UI buttons
const gridToggle = createButton('Toggle Grid', 10, 10); // Text for button, positioning, distance from top, distance from right
const snapToggle = createButton('Toggle Snap', 10, 136);
const saveButton = createButton('Export JSON', 48, 10);
const loadButton = createButton('Load JSON', 48, 136);
const viewMode = createButton('View Mode', 10, 10, { 
    right: 'auto', 
    left: '10px', 
    backgroundColor: '#C6A64B' // Different colour for this button
});
const undoButton = createButton('Undo', 86, 10);
const redoButton = createButton('Redo', 86, 136);
const helpButton = createButton('Help', 10, 10, {
    right: 'auto',
    left: '136px',
    backgroundColor: '#C6A64B' 
});
const zoomOutButton = createButton('-', 124, 10);
const zoomInButton = createButton('+', 124, 136);

// Add export HTML button as per feedback
const exportHtmlButton = createButton('Export HTML', 48, 10, {
    right: 'auto', 
    left: '10px', 
    backgroundColor: '#C6A64B' 
});
workspace.appendChild(exportHtmlButton);

// Function to export the workspace as HTML
function exportToHtml() {
    const elements = workspace.querySelectorAll('.element');
    
    // Create the basic HTML structure, without created work added
    let htmlContent = `<!DOCTYPE html> 
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsiteled Export</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            position: relative;
        }
        .element {
            position: absolute;
        }
    </style>
</head>
<body>
`;

    // Process each element
    elements.forEach(element => {
        // Get element properties
        const left = element.style.left;
        const top = element.style.top;
        const width = element.style.width;
        const height = element.style.height;
        const backgroundColor = element.style.backgroundColor;
        const color = element.style.color;
        const fontSize = element.style.fontSize;
        const borderStyle = element.style.borderStyle;
        const borderWidth = element.style.borderWidth;
        const borderColor = element.style.borderColor;
        const borderRadius = element.style.borderRadius;
        
        // Start the element div
        htmlContent += `    <div class="element" style="left: ${left}; top: ${top}; width: ${width}; height: ${height}; `; // Creates a div containing the element properties
        
        // Add styling if there is any on the element
        if (backgroundColor) htmlContent += `background-color: ${backgroundColor}; `; // If there is background colour, add it
        if (color) htmlContent += `color: ${color}; `; // If there is a text colour, add it
        if (fontSize) htmlContent += `font-size: ${fontSize}; `; // If there is a font size, add it
        if (borderStyle && borderStyle !== 'none') { // If there is border styling, add it
            htmlContent += `border-style: ${borderStyle}; `;
            if (borderWidth) htmlContent += `border-width: ${borderWidth}; `;
            if (borderColor) htmlContent += `border-color: ${borderColor}; `;
        }
        if (borderRadius) htmlContent += `border-radius: ${borderRadius}; `;
        
        htmlContent += '">\n'; // Completes the html div
        
        // Process content based on element type
        const input = element.querySelector('input[type="text"]');
        const img = element.querySelector('img');
        const paragraph = element.querySelector('p');
        const button = element.querySelector('button');
        const form = element.querySelector('form');

        // Save all present content
        if (input && !form) {
            // Text or title element
            htmlContent += `        <div style="width: 100%; height: 100%; display: flex; align-items: center; padding: 5px; box-sizing: border-box;">${input.value}</div>\n`;
        } else if (img) {
            // Image element
            const imgSrc = img.src;
            htmlContent += `        <img src="${imgSrc}" style="max-width: 100%; max-height: 100%;">\n`;
        } else if (paragraph) {
            // Random text element
            htmlContent += `        <p style="margin: 0; padding: 10px; box-sizing: border-box;">${paragraph.textContent}</p>\n`;
        } else if (button && !form) {
            // Button element
            const btnStyles = `width: 100%; height: 100%; background-color: ${button.style.backgroundColor || '#A08970'}; color: ${button.style.color || '#F1E3C6'}; border: none; border-radius: 4px; cursor: pointer;`; // Sets button colour from options
            htmlContent += `        <button style="${btnStyles}">${button.textContent}</button>\n`;
        } else if (form) {
            // Form element 
            let formHtml = form.outerHTML; // Get all of the code and copy it into a new "box"
            formHtml = formHtml.replace(/<div class="resize-handle.*?<\/div>/g, ''); // Remove all the resizing handles, if any found
            htmlContent += `        ${formHtml}\n`;
        } else if (element.style.height === '2px') {
            // Section break
            htmlContent += `        <hr style="width: 100%; height: 100%; margin: 0; border: none; background-color: ${backgroundColor || '#D9BF77'};">\n`;
        }
        
        htmlContent += `    </div>\n`;
    });
    
    // Close the HTML structure
    htmlContent += `</body>
</html>`;
    
    // Create download for the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' }); // Raw data for the file
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Unsiteled_Export.html'; // Name for the file
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('HTML exported successfully!'); // Popup message at bottom of screen
}

// Add event listener to the export button
exportHtmlButton.addEventListener('click', exportToHtml);

const uiButtons = [gridToggle, snapToggle, saveButton, loadButton, viewMode, undoButton, redoButton, helpButton, zoomOutButton, zoomInButton];
uiButtons.forEach(btn => workspace.appendChild(btn));

// Create file input for loading
const loadInput = document.createElement('input');
loadInput.type = 'file'; // Only take files
loadInput.accept = '.json'; // Only take JSON files
loadInput.style.display = 'none';
workspace.appendChild(loadInput);

// Style panel
const stylePanel = document.createElement('div');
stylePanel.id = 'style-panel';
Object.assign(stylePanel.style, { // Various styles for the element styling panel
    position: 'absolute',
    top: '86px',
    right: '10px',
    width: '200px',
    background: '#4B4239',
    padding: '10px',
    borderRadius: '4px',
    display: 'none',
    zIndex: '1000', // Puts the panel ontop of any elements on the workaspace
    color: '#F1E3C6',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)' // Transparent shadow
});

// Code for the styling panel as HTML
stylePanel.innerHTML = `
    <h3 style="margin-top: 0; border-bottom: 1px solid #6a5b4e; padding-bottom: 5px;">Element Style</h3>
    <div style="margin-bottom: 8px;">
        <label style="display: block; margin-bottom: 4px;">Background:</label>
        <input type="color" id="bg-color" value="#4B4239" style="width: 100%;">
    </div>
    <div style="margin-bottom: 8px;">
        <label style="display: block; margin-bottom: 4px;">Text Color:</label>
        <input type="color" id="text-color" value="#F1E3C6" style="width: 100%;">
    </div>
    <div style="margin-bottom: 8px;">
        <label style="display: block; margin-bottom: 4px;">Font Size:</label>
        <input type="number" id="font-size" min="8" value="16" style="width: 60px;">px
    </div>
    <div style="margin-bottom: 8px;">
        <label style="display: block; margin-bottom: 4px;">Border Style:</label>
        <select id="border-style" style="width: 100%; padding: 4px;">
            <option value="none">None</option>
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
        </select>
    </div>
    <div style="margin-bottom: 8px;">
        <label style="display: block; margin-bottom: 4px;">Border Width:</label>
        <input type="number" id="border-width" min="0" max="10" value="1" style="width: 60px;">px
    </div>
    <div style="margin-bottom: 8px;">
        <label style="display: block; margin-bottom: 4px;">Border Color:</label>
        <input type="color" id="border-color" value="#6a5b4e" style="width: 100%;">
    </div>
    <div style="margin-bottom: 8px;">
        <label style="display: block; margin-bottom: 4px;">Border Radius:</label>
        <input type="number" id="border-radius" min="0" max="50" value="0" style="width: 60px;">px
    </div>
    <div style="margin-top: 15px; text-align: center;">
        <button id="duplicate-element" style="padding: 5px 10px; background-color: #A08970; border: none; border-radius: 4px; color: #F1E3C6; cursor: pointer; margin-right: 5px;">Duplicate</button>
        <button id="delete-element" style="padding: 5px 10px; background-color: #a85751; border: none; border-radius: 4px; color: #F1E3C6; cursor: pointer;">Delete</button>
    </div>
`;
workspace.appendChild(stylePanel);

// Style controls
const bgColor = stylePanel.querySelector('#bg-color');
const textColor = stylePanel.querySelector('#text-color');
const fontSize = stylePanel.querySelector('#font-size');
const borderStyle = stylePanel.querySelector('#border-style');
const borderWidth = stylePanel.querySelector('#border-width');
const borderColor = stylePanel.querySelector('#border-color');
const borderRadius = stylePanel.querySelector('#border-radius');
const duplicateBtn = stylePanel.querySelector('#duplicate-element');
const deleteBtn = stylePanel.querySelector('#delete-element');

// Add resize handles style
document.head.appendChild(Object.assign(document.createElement('style'), {
    textContent: `
        .resize-handle {
            border: 1px solid #D9BF77;
            opacity: 0.5;
            transition: opacity 0.2s, background-color 0.2s;
        }
        .resize-handle:hover {
            opacity: 1;
            background-color: #e6d08c;
        }
        .element.selected::after {
            content: '';
            position: absolute;
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
            border: 2px dashed #C6A64B;
            pointer-events: none;
            animation: selectedPulse 2s infinite;
        }
        @keyframes selectedPulse {
            0%, 100% { border-color: #C6A64B; }
            50% { border-color: #F1E3C6; }
        }
        #help-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(46, 43, 39, 0.9);
            z-index: 2000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #F1E3C6;
            padding: 20px;
            text-align: center;
        }
        #help-overlay h2 {
            color: #C6A64B;
            margin-bottom: 20px;
        }
        #help-overlay ul {
            text-align: left;
            max-width: 600px;
            margin: 0 auto;
        }
        #help-overlay li {
            margin-bottom: 10px;
        }
        #help-overlay button {
            margin-top: 20px;
            padding: 8px 16px;
            background-color: #C6A64B;
            border: none;
            border-radius: 4px;
            color: #2E2B27;
            cursor: pointer;
            font-weight: bold;
        }
        .workspace {
            transition: transform 0.3s ease;
        }
        .toast-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4B4239;
            color: #F1E3C6;
            padding: 10px 20px;
            border-radius: 4px;
            border-left: 4px solid #C6A64B;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
            opacity: 0;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, 20px); }
        }
    `
}));

// History for undo/redo functionality
const history = {
    states: [], // No save states as default
    currentIndex: -1, // No position in save states as default
    maxStates: 30, // Adds max 30 save states
    
    saveState() {
        // Remove any future states if not at the end
        if (this.currentIndex < this.states.length - 1) {
            this.states = this.states.slice(0, this.currentIndex + 1);
        }
        
        // Save current state
        const elements = workspace.querySelectorAll('.element');
        const stateData = [];
        
        // Save all the stuff in the current state
        elements.forEach(element => {
            stateData.push({
                html: element.outerHTML,
                position: {
                    left: element.style.left,
                    top: element.style.top,
                    width: element.style.width,
                    height: element.style.height
                },
                styles: {
                    backgroundColor: element.style.backgroundColor,
                    color: element.style.color,
                    fontSize: element.style.fontSize,
                    borderStyle: element.style.borderStyle,
                    borderWidth: element.style.borderWidth,
                    borderColor: element.style.borderColor,
                    borderRadius: element.style.borderRadius
                }
            });
        });
        
        this.states.push(stateData); // Pushes current data into available save state
        
        // Limit the number of saved states, memory management
        if (this.states.length > this.maxStates) {
            this.states.shift();
        } else {
            this.currentIndex++;
        }
        
        // Update button states
        updateUndoRedoButtons();
    },
    
    undo() {
        if (this.currentIndex > 0) {
            this.currentIndex--; // -1 from current state position
            this.restoreState(); // Go back to the previous state
            return true;
        }
        return false;
    },
    
    redo() {
        if (this.currentIndex < this.states.length - 1) {
            this.currentIndex++; // +1 from current state position
            this.restoreState(); 
            return true;
        }
        return false;
    },
    
    restoreState() {
        // Clear current workspace to replace with what was there in specified state
        workspace.querySelectorAll('.element').forEach(el => el.remove());
        
        // Restore elements from saved state
        const state = this.states[this.currentIndex];
        state.forEach(elementData => {
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = elementData.html; // Temporary container for state 
            const element = tempContainer.firstChild;
            
            // Restore position and styles
            Object.assign(element.style, elementData.position, elementData.styles);
            
            // Re-attach event listeners
            setupDraggable(element);
            setupElementEvents(element);
            
            workspace.appendChild(element);
        });
        
        // Deselect any element when changing states
        if (selectedElement) {
            selectedElement.classList.remove('selected');
            selectedElement = null;
            stylePanel.style.display = 'none';
        }
        
        // Update button states
        updateUndoRedoButtons();
    }
};

// Update undo/redo button states
function updateUndoRedoButtons() {
    undoButton.disabled = history.currentIndex <= 0; // Can't undo if at front of states
    undoButton.style.opacity = history.currentIndex <= 0 ? '0.5' : '1'; // Changed opacity of button
    
    redoButton.disabled = history.currentIndex >= history.states.length - 1; // Can't redo if at back of states
    redoButton.style.opacity = history.currentIndex >= history.states.length - 1 ? '0.5' : '1'; // Changed opacity of button
}

// Helper functions
function snapToGridPos(pos) {
    return Math.round(pos / GRID_SIZE) * GRID_SIZE; // Uses the grid size for positioning within the grid
}

// RGB to Hex, as suggested by the name
function rgbToHex(rgb) {
    if (!rgb || !rgb.startsWith('rgb')) return rgb; // If not rgb, don't change it
    const [r, g, b] = rgb.match(/\d+/g) || [0, 0, 0]; // Finds red, green, and blue values
    return `#${((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1)}`; // Makes sure red, green, and blue are whole numbers, shifts numbers, concatenates them, removes the first character, and adds a "#" so the computer knows it is a colour
}

// Toast is a popup because toaster pops up toast 😱
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    toast.offsetHeight;
    toast.style.opacity = '1';
    
    setTimeout(() => { // Makes message pop back down after some time
        document.body.removeChild(toast);
    }, duration);
}

// Zoom functionality
let zoomLevel = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.5; // Zooms in/out by 0.5 each time

function updateZoom() {
    workspace.style.transform = `scale(${zoomLevel})`; // Scales everything up/down
    workspace.style.transformOrigin = 'center center'; // Keeps it all in the center
}

zoomInButton.addEventListener('click', () => { // Waits for click to zoom in
    if (zoomLevel < MAX_ZOOM) {
        zoomLevel += ZOOM_STEP;
        updateZoom();
    }
});

zoomOutButton.addEventListener('click', () => { // Waits for click to zoom out
    if (zoomLevel > MIN_ZOOM) {
        zoomLevel -= ZOOM_STEP;
        updateZoom();
    }
});

// Event handlers
bgColor.addEventListener('input', () => {
    if (selectedElement) {
        selectedElement.style.backgroundColor = bgColor.value;
        history.saveState();
    }
});

textColor.addEventListener('input', () => {
    if (selectedElement) {
        // Set color on the selected element itself
        selectedElement.style.color = textColor.value;
        
        // Also set color on common child elements that might contain text
        const children = selectedElement.querySelectorAll('input, button, p, div, form');
        children.forEach(child => {
            child.style.color = textColor.value;
        });
        
        // Special case for text elements with inputs
        const textInput = selectedElement.querySelector('input[type="text"]');
        if (textInput) {
            textInput.style.color = textColor.value;
        }
        
        history.saveState();
    }
});

fontSize.addEventListener('input', () => {
    if (selectedElement) {
        selectedElement.style.fontSize = `${fontSize.value}px`;
        history.saveState();
    }
});

borderStyle.addEventListener('change', () => {
    if (selectedElement) {
        selectedElement.style.borderStyle = borderStyle.value;
        history.saveState();
    }
});

borderWidth.addEventListener('input', () => {
    if (selectedElement) {
        selectedElement.style.borderWidth = `${borderWidth.value}px`;
        history.saveState();
    }
});

borderColor.addEventListener('input', () => {
    if (selectedElement) {
        selectedElement.style.borderColor = borderColor.value;
        history.saveState();
    }
});

borderRadius.addEventListener('input', () => {
    if (selectedElement) {
        selectedElement.style.borderRadius = `${borderRadius.value}px`;
        history.saveState();
    }
});

duplicateBtn.addEventListener('click', () => {
    if (selectedElement) {
        const clone = selectedElement.cloneNode(true);
        const rect = selectedElement.getBoundingClientRect();
        
        // Offset the cloned element a bit to show difference
        clone.style.left = `${parseInt(selectedElement.style.left) + 20}px`;
        clone.style.top = `${parseInt(selectedElement.style.top) + 20}px`;
        
        // Don't select original element anymore
        clone.classList.remove('selected');
        
        // Re-attach event handlers
        setupDraggable(clone);
        setupElementEvents(clone);
        
        workspace.appendChild(clone);
        
        // Select the new element
        if (selectedElement) selectedElement.classList.remove('selected');
        selectedElement = clone;
        clone.classList.add('selected');
        
        // Update history
        history.saveState();
        showToast('Element duplicated');
    }
});

deleteBtn.addEventListener('click', () => {
    if (selectedElement) {
        selectedElement.remove(); // Removes the element
        selectedElement = null;
        stylePanel.style.display = 'none';
        history.saveState();
        showToast('Element deleted');
    }
});

gridToggle.addEventListener('click', () => {
    workspace.classList.toggle('hide-grid');
    gridToggle.style.backgroundColor = workspace.classList.contains('hide-grid') ? '#888' : '#A08970';
});

snapToggle.addEventListener('click', () => {
    snapToGrid = !snapToGrid;
    snapToggle.style.backgroundColor = snapToGrid ? '#A08970' : '#888';
    showToast(snapToGrid ? 'Snap to grid enabled' : 'Snap to grid disabled');
});

saveButton.addEventListener('click', saveWorkspace);
loadButton.addEventListener('click', () => loadInput.click());
undoButton.addEventListener('click', () => {
    if (history.undo()) {
        showToast('Undo');
    }
});
redoButton.addEventListener('click', () => {
    if (history.redo()) {
        showToast('Redo');
    }
});

// Help overlay information 
helpButton.addEventListener('click', () => {
    const helpOverlay = document.createElement('div');
    helpOverlay.id = 'help-overlay'; // Show text for help overlay
    helpOverlay.innerHTML = `
        <h2>Unsiteled Help Guide</h2>
        <ul>
            <li><strong>Drag and Drop:</strong> Drag elements from the toolbox into the workspace to create your page.</li>
            <li><strong>Select Elements:</strong> Click on an element to select it and modify its properties.</li>
            <li><strong>Resize Elements:</strong> Drag the corner handles to resize elements.</li>
            <li><strong>Style Panel:</strong> Use the panel on the right to change colors, fonts, and borders.</li>
            <li><strong>Grid Controls:</strong> Toggle grid visibility and snap-to-grid behavior with the buttons.</li>
            <li><strong>View Mode:</strong> Preview your page without the editing interface. Press ESC to exit.</li>
            <li><strong>Save/Load:</strong> Save your work as a JSON file and load it later.</li>
            <li><strong>Keyboard Shortcuts:</strong> Delete selected elements with the Delete key. Ctrl+Z for undo.</li>
            <li><strong>Zoom:</strong> Use the + and - buttons to zoom in and out.</li>
        </ul>
        <button id="close-help">Close Help</button>
    `;
    
    document.body.appendChild(helpOverlay);
    document.getElementById('close-help').addEventListener('click', () => {
        document.body.removeChild(helpOverlay);
    });
});

viewMode.addEventListener('click', () => {
    const elements = [toolbox, stylePanel, ...uiButtons];
    elements.forEach(el => el.style.display = 'none');
    
    // Show a hint message
    showToast('Press ESC to exit view mode', 5000);
    
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            toolbox.style.display = 'block';
            stylePanel.style.display = selectedElement ? 'block' : 'none'; // Don't display the hints once you press escape
            uiButtons.forEach(btn => btn.style.display = 'block');
            document.removeEventListener('keydown', escHandler); // Don't wait for escape button press anymore
        }
    };
    document.addEventListener('keydown', escHandler);
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Delete key to delete selected elements
    if (e.key === 'Delete' && selectedElement) { // Delete if you have something selected
        e.preventDefault(); // Ignore default key behaviour
        selectedElement.remove();
        selectedElement = null;
        stylePanel.style.display = 'none';
        history.saveState(); // Save element deletion
        showToast('Element deleted');
    }
    
    // Ctrl+Z for undo
    if (e.key === 'z' && (e.ctrlKey || e.metaKey)) { 
        e.preventDefault();
        if (history.undo()) {
            showToast('Undo');
        }
    }
    
    // Ctrl+Y or Ctrl+Shift+Z for redo
    if ((e.key === 'y' && (e.ctrlKey || e.metaKey)) || 
        (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)) {
        e.preventDefault();
        if (history.redo()) {
            showToast('Redo');
        }
    }
    
    // Ctrl+D for duplicate
    if (e.key === 'd' && (e.ctrlKey || e.metaKey) && selectedElement) {
        e.preventDefault();
        duplicateBtn.click();
    }
});

// Drag and drop functionality
workspace.addEventListener('mousemove', drag);
workspace.addEventListener('mouseup', dragEnd);

toolbox.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('draggable')) {
        e.dataTransfer.setData('type', e.target.dataset.type); // Keep the data of what is being moved for when it is placed back down
    }
});

workspace.addEventListener('dragover', (e) => e.preventDefault());

workspace.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    if (!type) return;
    
    const rect = workspace.getBoundingClientRect(); // Gets the position of where to move the element to
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;
    
    addElementToWorkspace(type, 
        snapToGrid ? snapToGridPos(x) : x, 
        snapToGrid ? snapToGridPos(y) : y
    );
    
    // Save state after adding element
    history.saveState();
});

function setupDraggable(element) {
    element.style.cursor = 'grab';
    
    element.addEventListener('mousedown', (e) => {
        if (e.target.tagName.toLowerCase() === 'input' || e.target.classList.contains('resize-handle')) return; // Does not move the text inside the box
        
        e.preventDefault();
        isDragging = true;
        activeElement = element;
        
        const rect = element.getBoundingClientRect();
        const workspaceRect = workspace.getBoundingClientRect();
        
        initialX = e.clientX - rect.left;
        initialY = e.clientY - rect.top;
        currentX = (rect.left - workspaceRect.left) / zoomLevel;
        currentY = (rect.top - workspaceRect.top) / zoomLevel;
        
        element.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    });
}

function drag(e) {
    if (!isDragging || !activeElement) return;
    
    e.preventDefault();
    const workspaceRect = workspace.getBoundingClientRect(); // Handles moving if zoomed in or out
    let newX = (e.clientX - workspaceRect.left) / zoomLevel - initialX;
    let newY = (e.clientY - workspaceRect.top) / zoomLevel - initialY;
    
    if (snapToGrid) {
        newX = snapToGridPos(newX);
        newY = snapToGridPos(newY);
    }
    
    activeElement.style.left = `${newX}px`;
    activeElement.style.top = `${newY}px`;
    currentX = newX;
    currentY = newY;
}

function dragEnd() {
    if (!isDragging) return; // Stop dragging once you stop dragging
    
    isDragging = false;
    if (activeElement) {
        activeElement.style.cursor = 'grab';
        activeElement = null;
        
        // Save state after moving element
        history.saveState();
    }
    document.body.style.userSelect = '';
}

// Add resize handles to elements
function addResizeHandles(element) {
    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right']; // 4 corners of elements
    element.style.position = 'absolute';
    element.style.resize = 'none';
    element.style.minWidth = '50px';
    element.style.minHeight = '50px';

    // Handle inputs and text containers
    const input = element.querySelector('input[type="text"]');
    if (input) {
        Object.assign(input.style, {
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            resize: 'none',
            border: 'none',
            padding: '5px'
        });
    }

    const textContainer = element.querySelector('div');
    if (textContainer && element.querySelector('p')) {
        Object.assign(textContainer.style, {
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center'
        });
        
        const paragraph = textContainer.querySelector('p');
        paragraph.style.width = '100%';
        paragraph.style.wordWrap = 'break-word';
    }

    // Create resize handles for each corner
    const handlePositions = {
        'top-left': { top: '-5px', left: '-5px', cursor: 'nwse-resize' },
        'top-right': { top: '-5px', right: '-5px', cursor: 'nesw-resize' },
        'bottom-left': { bottom: '-5px', left: '-5px', cursor: 'nesw-resize' },
        'bottom-right': { bottom: '-5px', right: '-5px', cursor: 'nwse-resize' }
    };

    corners.forEach(corner => { // For each of the 4 corners
        const handle = document.createElement('div');
        handle.classList.add('resize-handle', `resize-${corner}`);
        
        Object.assign(handle.style, {
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: '#D9BF77',
            zIndex: '10',
            ...handlePositions[corner] // Spread them all out at once
        });

        let isResizing = false;
        let originalWidth, originalHeight, originalX, originalY, originalLeft, originalTop;

        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            isResizing = true;
            
            const rect = element.getBoundingClientRect(); // Measure the element, note the dimensions
            originalWidth = rect.width;
            originalHeight = rect.height;
            originalX = e.clientX;
            originalY = e.clientY;
            originalLeft = parseInt(element.style.left);
            originalTop = parseInt(element.style.top);
            
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            document.body.style.userSelect = 'none';
        });

        function resize(e) {
            if (!isResizing) return;
            
            const deltaX = e.clientX - originalX;
            const deltaY = e.clientY - originalY;
            let newWidth, newHeight, newLeft, newTop;

            switch(corner) {
                case 'bottom-right':
                    newWidth = Math.max(originalWidth + deltaX, 50); // Delta just means how far you have moved, the difference
                    newHeight = Math.max(originalHeight + deltaY, 50);
                    break;
                case 'top-right':
                    newWidth = Math.max(originalWidth + deltaX, 50);
                    newHeight = Math.max(originalHeight - deltaY, 50);
                    newTop = originalTop + deltaY;
                    break;
                case 'bottom-left':
                    newWidth = Math.max(originalWidth - deltaX, 50);
                    newHeight = Math.max(originalHeight + deltaY, 50);
                    newLeft = originalLeft + deltaX;
                    break;
                case 'top-left':
                    newWidth = Math.max(originalWidth - deltaX, 50);
                    newHeight = Math.max(originalHeight - deltaY, 50);
                    newTop = originalTop + deltaY;
                    newLeft = originalLeft + deltaX;
                    break;
            }

            if (newWidth !== undefined) element.style.width = `${newWidth}px`; // Makes size in px so the computer knows what it means
            if (newHeight !== undefined) element.style.height = `${newHeight}px`;
            if (newLeft !== undefined) element.style.left = `${newLeft}px`;
            if (newTop !== undefined) element.style.top = `${newTop}px`;

            // Update content dimensions as well as box 
            if (input) {
                input.style.width = '100%';
                input.style.height = '100%';
            }
            if (textContainer) {
                textContainer.style.width = '100%';
                textContainer.style.height = '100%';
            }
        }

        function stopResize() {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
            document.body.style.userSelect = '';
            
            // Save state after resizing
            history.saveState();
        }

        element.appendChild(handle);
    });
}

// Element creation and management
function addElementToWorkspace(type, x, y) {
    const element = document.createElement('div'); // Create a div for the element
    element.classList.add('element');
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    switch (type) {
        case 'text': // Text element
            element.style.width = '200px'; // Default width
            element.style.height = '40px'; // Default height
            element.innerHTML = `<input type="text" value="Text Box" style="color: #000000;" />`; // Div content
            break;
        case 'title': // Title element
            element.style.width = '300px';
            element.style.height = '50px';
            element.innerHTML = `<input type="text" value="Title" style="color: #000000; font-size: 1.5em; font-weight: bold;" />`;
            break;
        case 'image': // Image element
            setupImageElement(element); // Use the image function I made somewhere else 
            break;
        case 'button': // Button element
            element.style.width = '120px';
            element.style.height = '40px';
            element.innerHTML = `<button style="width: 100%; height: 100%; background-color: #A08970; color: #F1E3C6; border: none; border-radius: 4px;">Click Me</button>`;
            break;
        case 'form': // Form element, HTML code for the form
            element.style.width = '300px';
            element.style.height = '200px';
            element.innerHTML = `
                <form style="display: flex; flex-direction: column; gap: 10px;">
                    <input type="text" placeholder="Name" style="padding: 5px;">
                    <input type="email" placeholder="Email" style="padding: 5px;">
                    <button type="submit" style="padding: 5px; background-color: #A08970; color: #F1E3C6; border: none;">Submit</button>
                </form>
            `;
            break;
        case 'break': // Section break element
            element.style.width = '100%';
            element.style.height = '2px';
            element.style.backgroundColor = '#D9BF77';
            element.style.border = 'none';
            break;
        case 'text-rand': // Random text element
            setupRandomTextElement(element); // Use the random text function I made somewhere else
            break;
        case 'image-rand': // Random image element
            element.innerHTML = `<img src="https://picsum.photos/200/?random" />`; // Lorem Picsum link generates a ranom image of dimensions 200x200px
            break;
        default:
            return;
    }

    element.setAttribute('draggable', 'false');
    setupDraggable(element);
    addResizeHandles(element);
    setupElementEvents(element);

    workspace.appendChild(element);
}

// Setup element events
function setupElementEvents(element) {
    // Element selection handlers
    element.addEventListener('click', (e) => {
        if (selectedElement) selectedElement.classList.remove('selected');
        selectedElement = element;
        element.classList.add('selected');
        stylePanel.style.display = 'block';
        
        // Update style panel according to element styles
        bgColor.value = element.style.backgroundColor ? rgbToHex(element.style.backgroundColor) : '#4B4239';
        textColor.value = element.style.color ? rgbToHex(element.style.color) : '#F1E3C6';
        fontSize.value = parseInt(element.style.fontSize) || 16; // Change to whole number, or default at 16
    });
}

// Handle click outside elements
workspace.addEventListener('click', (e) => {
    if (!e.target.closest('.element') && !e.target.closest('#style-panel')) { // Don't do anything to anything if clicking on nothing
        if (selectedElement) selectedElement.classList.remove('selected');
        selectedElement = null;
        stylePanel.style.display = 'none';
    }
});

// Setup specialized element types
function setupImageElement(element) { 
    const container = document.createElement('div');
    const inputContainer = document.createElement('div');
    Object.assign(inputContainer.style, {
        display: 'flex',
        gap: '8px',
        marginBottom: '8px'
    });

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Image URL';
    urlInput.style.flex = '1';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // Accept image files
    fileInput.style.display = 'none';

    const uploadButton = document.createElement('button');
    uploadButton.textContent = 'Upload'; // What to write in the button
    Object.assign(uploadButton.style, {
        padding: '4px 8px',
        backgroundColor: '#A08970',
        color: '#F1E3C6',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    });

    const img = document.createElement('img'); // Make it type img
    img.style.display = 'none';
    img.style.maxWidth = '200px';
    img.style.maxHeight = '200px';

    // Image element event handlers
    urlInput.addEventListener('change', () => {
        const url = urlInput.value.trim();
        if (url) {
            img.src = url;
            img.style.display = 'block';
            inputContainer.style.display = 'none';
            img.onerror = () => {
                img.style.display = 'none';
                inputContainer.style.display = 'flex';
                alert('Failed to load image. Please check the URL.'); // Error message if image invalid or load fails
            };
        }
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0]; // Only choose the first file you select
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result; // Put the image into the "box"
                img.style.display = 'block';
                inputContainer.style.display = 'none';
                urlInput.value = ''; // Clear URL on image upload
            };
            reader.readAsDataURL(file);
        }
    });

    uploadButton.addEventListener('click', () => fileInput.click());
    img.addEventListener('click', () => {
        inputContainer.style.display = 'flex';
        img.style.display = 'none';
    });

    [urlInput, uploadButton].forEach(el => { // Don't accidentally press other buttons as well that are underneath 
        el.addEventListener('mousedown', (e) => e.stopPropagation());
    });

    inputContainer.appendChild(urlInput);
    inputContainer.appendChild(uploadButton);
    container.appendChild(inputContainer);
    container.appendChild(fileInput);
    container.appendChild(img);
    element.appendChild(container);
}

function setupRandomTextElement(element) {
    const textContainer = document.createElement('div');
    Object.assign(textContainer.style, {
        padding: '10px',
        border: '1px solid #554b42',
        borderRadius: '4px',
        minWidth: '200px',
        minHeight: '50px',
        backgroundColor: '#554b42'
    });

    // Example text for the markov chain
    const defaultText = ` 
        The sun dipped below the horizon, casting an orange glow across the sky.
        A stray cat wandered through the alley, searching for scraps of food.
        The sound of rain tapping against the window was oddly comforting.
        She flipped through the old book, its pages yellowed with age.
        The wind howled through the trees, making the branches sway wildly.
        The waves crashed against the rocky shore, sending salty mist into the crisp evening air.
        A gentle breeze rustled through the autumn leaves, scattering them across the winding path.
        The old clock tower chimed solemnly, its echoes lingering in the quiet, foggy streets.
        Snowflakes danced in the pale moonlight, blanketing the town in a shimmering white coat.
        The city lights flickered to life as dusk settled in, painting the skyline with a golden hue.
        Raindrops tapped against the windowpane, tracing jagged patterns down the fogged glass.
        The forest hummed with life as dawn broke, light filtering through the thick canopy above.
        Soft laughter floated from the garden, blending with the sweet scent of blooming roses.
        Thunder rumbled in the distance, rolling ominously over the sprawling, empty fields.
        A lone lantern swayed gently in the wind, casting shadows that danced along the cobblestones.
    `;
    
    let sentence = "Random text failed to generate."; // Default text if generation fails
    if (typeof RiTa !== 'undefined') {
        try {
            let markov = RiTa.markov(3); // Model version
            markov.addText(defaultText);
            sentence = markov.generate();
        } catch (e) {
            console.error('RiTa generation failed:', e); // Log error message in console, not on screen
        }
    }
    
    const textElement = document.createElement('p');
    textElement.textContent = sentence;
    textElement.style.margin = '0';
    textElement.style.fontStyle = 'italic';
    
    textContainer.appendChild(textElement);
    element.appendChild(textContainer);
}

// Save and load functionality
function saveWorkspace() {
    const elements = workspace.querySelectorAll('.element'); // Select all the elements
    const savedElements = []; // Save them in an array

    elements.forEach(element => { // Get all their styling and positioning
        const elementData = {
            type: '',
            left: element.style.left,
            top: element.style.top,
            width: element.style.width,
            height: element.style.height,
            content: '',
            styles: {
                backgroundColor: element.style.backgroundColor,
                color: element.style.color,
                fontSize: element.style.fontSize
            }
        };

        // Detect element type and content
        const input = element.querySelector('input[type="text"]'); // Input
        const img = element.querySelector('img'); // Image
        const randTextP = element.querySelector('p'); // Text
        const button = element.querySelector('button'); // Button
        const form = element.querySelector('form'); // Form

        if (input && input.style.fontSize === '1.5em') { // If input and large text, is title
            elementData.type = 'title';
            elementData.content = input.value;
        } else if (input && !img) { // If input but not image, is image
            elementData.type = 'text';
            elementData.content = input.value;
        } else if (img && img.src.includes('picsum')) { // If URL contains picsum, is random image
            elementData.type = 'image-rand';
            elementData.content = img.src;
        } else if (img) { // If image, is image, pretty self explanatory
            elementData.type = 'image';
            const urlInput = element.querySelector('input[type="text"]');
            elementData.content = {
                src: img.src, // Take the image source
                url: urlInput ? urlInput.value : '' // Take the image URL is there is one otherwise leave as blank
            };
        } else if (randTextP) { // If random text, is random text
            elementData.type = 'text-rand';
            elementData.content = randTextP.textContent; // Save random text content
        } else if (button && !form) { // If button but not form, is form
            elementData.type = 'button';
            elementData.content = button.textContent;
        } else if (form) { // If form, is form
            elementData.type = 'form';
            elementData.content = form.outerHTML;
        } else if (element.style.height === '2px') { // If styling that of section break, is section break
            elementData.type = 'break';
        }

        savedElements.push(elementData); // Save all elements into the array
    });

    const saveData = {
        elements: savedElements,
        gridSettings: {
            snapToGrid,
            gridVisible: !workspace.classList.contains('hide-grid')
        }
    };

    // Create and trigger download
    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' }); // Make downloadable string data
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Unsiteled_Project.json'; // Default file name
    a.click();
    URL.revokeObjectURL(url);
}

// Load functionality
function loadWorkspace(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            loadWorkspaceFromJSON(JSON.parse(e.target.result)); // Parse text from saved data
        } catch (error) {
            alert('Failed to load layout file. Please check the file format.'); // Error message is file incorrect
            console.error('Load error:', error);
        }
    };
    reader.readAsText(file);
}

function loadWorkspaceFromJSON(data) {
    // Clear existing elements
    workspace.querySelectorAll('.element').forEach(el => el.remove());
    
    // Apply grid and snap settings
    snapToGrid = data.gridSettings.snapToGrid;
    snapToggle.style.backgroundColor = snapToGrid ? '#A08970' : '#888';
    
    if (data.gridSettings.gridVisible) {
        workspace.classList.remove('hide-grid');
        gridToggle.style.backgroundColor = '#A08970';
    } else {
        workspace.classList.add('hide-grid');
        gridToggle.style.backgroundColor = '#888';
    }

    // Recreate elements in original positions
    data.elements.forEach(elementData => {
        addElementToWorkspace(
            elementData.type,
            parseInt(elementData.left),
            parseInt(elementData.top)
        );
        
        const element = workspace.lastElementChild;
        if (elementData.width) element.style.width = elementData.width;
        if (elementData.height) element.style.height = elementData.height;
        
        // Apply styles
        if (elementData.styles) {
            Object.assign(element.style, {
                backgroundColor: elementData.styles.backgroundColor,
                color: elementData.styles.color,
                fontSize: elementData.styles.fontSize
            });
        }

        // Set element content
        switch (elementData.type) {
            case 'image':
                const img = element.querySelector('img');
                const urlInput = element.querySelector('input[type="text"]');
                if (img && urlInput) {
                    img.src = elementData.content.src;
                    img.style.display = 'block';
                    urlInput.value = elementData.content.url;
                    urlInput.parentElement.style.display = elementData.content.src ? 'none' : 'flex';
                }
                break;
            case 'image-rand':
                const randImg = element.querySelector('img');
                if (randImg) randImg.src = elementData.content;
                break;
            case 'text-rand':
                const randTextP = element.querySelector('p');
                if (randTextP) randTextP.textContent = elementData.content;
                break;
            case 'title':
            case 'text':
                const input = element.querySelector('input[type="text"]');
                if (input) input.value = elementData.content;
                break;
            case 'button':
                const button = element.querySelector('button');
                if (button) button.textContent = elementData.content;
                break;
            case 'form':
                element.innerHTML = elementData.content;
                break;
        }
    });
}

loadInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) loadWorkspace(e.target.files[0]); // Load saved file when you try to
});

// Load templates/projects from localStorage if available
if (localStorage.getItem('loadedTemplate')) {
    loadWorkspaceFromJSON(JSON.parse(localStorage.getItem('loadedTemplate')));
    localStorage.removeItem('loadedTemplate');
}

if (localStorage.getItem('loadedProject')) {
    loadWorkspaceFromJSON(JSON.parse(localStorage.getItem('loadedProject')));
    localStorage.removeItem('loadedProject');
}
