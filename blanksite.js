// DOM Elements
const toolbox = document.querySelector('.toolbox');
const workspace = document.getElementById('workspace');

// Settings
const GRID_SIZE = 20;
let snapToGrid = true;
let isDragging = false;
let initialX, initialY, currentX, currentY;
let activeElement = null;
let selectedElement = null;

// Create UI elements
const createButton = (text, top, right) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    Object.assign(btn.style, {
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
        cursor: 'pointer'
    });
    return btn;
};

// Create main UI buttons
const gridToggle = createButton('Toggle Grid', 10, 10);
const snapToggle = createButton('Toggle Snap', 10, 136);
const saveButton = createButton('Save Website', 48, 10);
const loadButton = createButton('Load Website', 48, 136);
const viewMode = createButton('View Mode; ESC to Exit', 10, 10);
viewMode.style.right = 'auto';
viewMode.style.left = '10px';
viewMode.style.backgroundColor = '#C6A64B';

const uiButtons = [gridToggle, snapToggle, saveButton, loadButton, viewMode];
uiButtons.forEach(btn => workspace.appendChild(btn));

// Create file input for loading
const loadInput = document.createElement('input');
loadInput.type = 'file';
loadInput.accept = '.json';
loadInput.style.display = 'none';
workspace.appendChild(loadInput);

// Style panel
const stylePanel = document.createElement('div');
stylePanel.id = 'style-panel';
Object.assign(stylePanel.style, {
    position: 'absolute',
    top: '86px',
    right: '10px',
    width: '200px',
    background: '#4B4239',
    padding: '10px',
    borderRadius: '4px',
    display: 'none',
    zIndex: '1000',
    color: '#F1E3C6'
});

stylePanel.innerHTML = `
    <h3>Style</h3>
    <label>Background: <input type="color" id="bg-color" value="#4B4239"></label><br>
    <label>Text Color: <input type="color" id="text-color" value="#F1E3C6"></label><br>
    <label>Font Size: <input type="number" id="font-size" min="8" value="16">px</label>
`;
workspace.appendChild(stylePanel);

// Style controls
const bgColor = stylePanel.querySelector('#bg-color');
const textColor = stylePanel.querySelector('#text-color');
const fontSize = stylePanel.querySelector('#font-size');

// Add resize handles style
document.head.appendChild(Object.assign(document.createElement('style'), {
    textContent: `
        .resize-handle {
            border: 1px solid #D9BF77;
            opacity: 0.5;
            transition: opacity 0.2s;
        }
        .resize-handle:hover {
            opacity: 1;
        }
    `
}));

// Helper functions
function snapToGridPos(pos) {
    return Math.round(pos / GRID_SIZE) * GRID_SIZE;
}

function rgbToHex(rgb) {
    if (!rgb || !rgb.startsWith('rgb')) return rgb;
    const [r, g, b] = rgb.match(/\d+/g) || [0, 0, 0];
    return `#${((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1)}`;
}

// Event handlers
bgColor.addEventListener('input', () => {
    if (selectedElement) selectedElement.style.backgroundColor = bgColor.value;
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
    }
});

fontSize.addEventListener('input', () => {
    if (selectedElement) selectedElement.style.fontSize = `${fontSize.value}px`;
});

gridToggle.addEventListener('click', () => {
    workspace.classList.toggle('hide-grid');
    gridToggle.style.backgroundColor = workspace.classList.contains('hide-grid') ? '#888' : '#A08970';
});

snapToggle.addEventListener('click', () => {
    snapToGrid = !snapToGrid;
    snapToggle.style.backgroundColor = snapToGrid ? '#A08970' : '#888';
});

saveButton.addEventListener('click', saveWorkspace);
loadButton.addEventListener('click', () => loadInput.click());

viewMode.addEventListener('click', () => {
    const elements = [toolbox, stylePanel, ...uiButtons];
    elements.forEach(el => el.style.display = 'none');
    
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            toolbox.style.display = 'block';
            stylePanel.style.display = selectedElement ? 'block' : 'none';
            uiButtons.forEach(btn => btn.style.display = 'block');
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
});

// Drag and drop functionality
workspace.addEventListener('mousemove', drag);
workspace.addEventListener('mouseup', dragEnd);

toolbox.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('draggable')) {
        e.dataTransfer.setData('type', e.target.dataset.type);
    }
});

workspace.addEventListener('dragover', (e) => e.preventDefault());

workspace.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    if (!type) return;
    
    const rect = workspace.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    addElementToWorkspace(type, 
        snapToGrid ? snapToGridPos(x) : x, 
        snapToGrid ? snapToGridPos(y) : y
    );
});

function setupDraggable(element) {
    element.style.cursor = 'grab';
    
    element.addEventListener('mousedown', (e) => {
        if (e.target.tagName.toLowerCase() === 'input' || e.target.classList.contains('resize-handle')) return;
        
        e.preventDefault();
        isDragging = true;
        activeElement = element;
        
        const rect = element.getBoundingClientRect();
        const workspaceRect = workspace.getBoundingClientRect();
        
        initialX = e.clientX - rect.left;
        initialY = e.clientY - rect.top;
        currentX = rect.left - workspaceRect.left;
        currentY = rect.top - workspaceRect.top;
        
        element.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    });
}

function drag(e) {
    if (!isDragging || !activeElement) return;
    
    e.preventDefault();
    const workspaceRect = workspace.getBoundingClientRect();
    let newX = e.clientX - workspaceRect.left - initialX;
    let newY = e.clientY - workspaceRect.top - initialY;
    
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
    if (!isDragging) return;
    
    isDragging = false;
    if (activeElement) {
        activeElement.style.cursor = 'grab';
        activeElement = null;
    }
    document.body.style.userSelect = '';
}

// Add resize handles to elements
function addResizeHandles(element) {
    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
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

    corners.forEach(corner => {
        const handle = document.createElement('div');
        handle.classList.add('resize-handle', `resize-${corner}`);
        
        Object.assign(handle.style, {
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: '#D9BF77',
            zIndex: '10',
            ...handlePositions[corner]
        });

        let isResizing = false;
        let originalWidth, originalHeight, originalX, originalY, originalLeft, originalTop;

        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            isResizing = true;
            
            const rect = element.getBoundingClientRect();
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
                    newWidth = Math.max(originalWidth + deltaX, 50);
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

            if (newWidth !== undefined) element.style.width = `${newWidth}px`;
            if (newHeight !== undefined) element.style.height = `${newHeight}px`;
            if (newLeft !== undefined) element.style.left = `${newLeft}px`;
            if (newTop !== undefined) element.style.top = `${newTop}px`;

            // Update content dimensions
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
        }

        element.appendChild(handle);
    });
}

// Element creation and management
function addElementToWorkspace(type, x, y) {
    const element = document.createElement('div');
    element.classList.add('element');
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    switch (type) {
        case 'text':
            element.style.width = '200px';
            element.style.height = '40px';
            element.innerHTML = `<input type="text" value="Text Box" />`;
            break;
        case 'title':
            element.style.width = '300px';
            element.style.height = '50px';
            element.innerHTML = `<input type="text" value="Title" style="font-size: 1.5em; font-weight: bold;" />`;
            break;
        case 'image':
            setupImageElement(element);
            break;
        case 'button':
            element.style.width = '120px';
            element.style.height = '40px';
            element.innerHTML = `<button style="width: 100%; height: 100%; background-color: #A08970; color: #F1E3C6; border: none; border-radius: 4px;">Click Me</button>`;
            break;
        case 'form':
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
        case 'break':
            element.style.width = '100%';
            element.style.height = '2px';
            element.style.backgroundColor = '#D9BF77';
            element.style.border = 'none';
            break;
        case 'text-rand':
            setupRandomTextElement(element);
            break;
        case 'image-rand':
            element.innerHTML = `<img src="https://picsum.photos/200/?random" />`;
            break;
        default:
            return;
    }

    element.setAttribute('draggable', 'false');
    setupDraggable(element);
    addResizeHandles(element);

    // Element selection handlers
    element.addEventListener('click', (e) => {
        if (selectedElement) selectedElement.classList.remove('selected');
        selectedElement = element;
        element.classList.add('selected');
        stylePanel.style.display = 'block';
        
        // Update style panel
        bgColor.value = element.style.backgroundColor ? rgbToHex(element.style.backgroundColor) : '#4B4239';
        textColor.value = element.style.color ? rgbToHex(element.style.color) : '#F1E3C6';
        fontSize.value = parseInt(element.style.fontSize) || 16;
    });

    // Right-click to delete
    element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (confirm('Delete this element?')) {
            element.remove();
            if (selectedElement === element) {
                selectedElement = null;
                stylePanel.style.display = 'none';
            }
        }
    });

    workspace.appendChild(element);
}

// Handle click outside elements
workspace.addEventListener('click', (e) => {
    if (!e.target.closest('.element') && !e.target.closest('#style-panel')) {
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
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    const uploadButton = document.createElement('button');
    uploadButton.textContent = 'Upload';
    Object.assign(uploadButton.style, {
        padding: '4px 8px',
        backgroundColor: '#A08970',
        color: '#F1E3C6',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    });

    const img = document.createElement('img');
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
                alert('Failed to load image. Please check the URL.');
            };
        }
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
                img.style.display = 'block';
                inputContainer.style.display = 'none';
                urlInput.value = '';
            };
            reader.readAsDataURL(file);
        }
    });

    uploadButton.addEventListener('click', () => fileInput.click());
    img.addEventListener('click', () => {
        inputContainer.style.display = 'flex';
        img.style.display = 'none';
    });

    [urlInput, uploadButton].forEach(el => {
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

    const defaultText = ` 
        The sun dipped below the horizon, casting an orange glow across the sky.
        A stray cat wandered through the alley, searching for scraps of food.
        The sound of rain tapping against the window was oddly comforting.
        She flipped through the old book, its pages yellowed with age.
        The wind howled through the trees, making the branches sway wildly.
    `;
    
    let sentence = "Random text failed to generate.";
    if (typeof RiTa !== 'undefined') {
        try {
            let markov = RiTa.markov(3);
            markov.addText(defaultText);
            sentence = markov.generate();
        } catch (e) {
            console.error('RiTa generation failed:', e);
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
    const elements = workspace.querySelectorAll('.element');
    const savedElements = [];

    elements.forEach(element => {
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
        const input = element.querySelector('input[type="text"]');
        const img = element.querySelector('img');
        const randTextP = element.querySelector('p');
        const button = element.querySelector('button');
        const form = element.querySelector('form');

        if (input && input.style.fontSize === '1.5em') {
            elementData.type = 'title';
            elementData.content = input.value;
        } else if (input && !img) {
            elementData.type = 'text';
            elementData.content = input.value;
        } else if (img && img.src.includes('picsum')) {
            elementData.type = 'image-rand';
            elementData.content = img.src;
        } else if (img) {
            elementData.type = 'image';
            const urlInput = element.querySelector('input[type="text"]');
            elementData.content = {
                src: img.src,
                url: urlInput ? urlInput.value : ''
            };
        } else if (randTextP) {
            elementData.type = 'text-rand';
            elementData.content = randTextP.textContent;
        } else if (button && !form) {
            elementData.type = 'button';
            elementData.content = button.textContent;
        } else if (form) {
            elementData.type = 'form';
            elementData.content = form.outerHTML;
        } else if (element.style.height === '2px') {
            elementData.type = 'break';
        }

        savedElements.push(elementData);
    });

    const saveData = {
        elements: savedElements,
        gridSettings: {
            snapToGrid,
            gridVisible: !workspace.classList.contains('hide-grid')
        }
    };

    // Create and trigger download
    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Unsiteled_Project.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Load functionality
function loadWorkspace(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            loadWorkspaceFromJSON(JSON.parse(e.target.result));
        } catch (error) {
            alert('Failed to load layout file. Please check the file format.');
            console.error('Load error:', error);
        }
    };
    reader.readAsText(file);
}

function loadWorkspaceFromJSON(data) {
    // Clear existing elements
    workspace.querySelectorAll('.element').forEach(el => el.remove());
    
    // Apply settings
    snapToGrid = data.gridSettings.snapToGrid;
    snapToggle.style.backgroundColor = snapToGrid ? '#A08970' : '#888';
    
    if (data.gridSettings.gridVisible) {
        workspace.classList.remove('hide-grid');
        gridToggle.style.backgroundColor = '#A08970';
    } else {
        workspace.classList.add('hide-grid');
        gridToggle.style.backgroundColor = '#888';
    }

    // Recreate elements
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
    if (e.target.files.length > 0) loadWorkspace(e.target.files[0]);
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