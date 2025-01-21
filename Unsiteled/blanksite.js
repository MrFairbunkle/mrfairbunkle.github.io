// Elements
const toolbox = document.querySelector('.toolbox');
const workspace = document.getElementById('workspace');

// Grid settings
const GRID_SIZE = 20;
let snapToGrid = true;

// Variables to track dragging
let isDragging = false;
let initialX;
let initialY;
let currentX;
let currentY;
let activeElement = null;

// Create grid toggle button
const gridToggle = document.createElement('button');
gridToggle.textContent = 'Toggle Grid';
gridToggle.style.position = 'absolute';
gridToggle.style.width = '120px';
gridToggle.style.top = '10px';
gridToggle.style.right = '10px';
gridToggle.style.zIndex = '1000';
gridToggle.style.padding = '8px 16px';
gridToggle.style.backgroundColor = '#4CAF50';
gridToggle.style.color = 'white';
gridToggle.style.border = 'none';
gridToggle.style.borderRadius = '4px';
gridToggle.style.cursor = 'pointer';

// Create snap toggle button
const snapToggle = document.createElement('button');
snapToggle.textContent = 'Toggle Snap';
snapToggle.style.position = 'absolute';
snapToggle.style.width = '120px';
snapToggle.style.top = '10px';
snapToggle.style.right = '136px';
snapToggle.style.zIndex = '1000';
snapToggle.style.padding = '8px 16px';
snapToggle.style.backgroundColor = '#4CAF50';
snapToggle.style.color = 'white';
snapToggle.style.border = 'none';
snapToggle.style.borderRadius = '4px';
snapToggle.style.cursor = 'pointer';

// Create save button
const saveButton = document.createElement('button');
saveButton.textContent = 'Save Website';
saveButton.style.position = 'absolute';
saveButton.style.width = '120px';
saveButton.style.top = '10px';
saveButton.style.right = '264px';
saveButton.style.zIndex = '1000';
saveButton.style.padding = '8px 16px';
saveButton.style.backgroundColor = '#4CAF50';
saveButton.style.color = 'white';
saveButton.style.border = 'none';
saveButton.style.borderRadius = '4px';
saveButton.style.cursor = 'pointer';

// Add buttons to workspace
workspace.appendChild(gridToggle);
workspace.appendChild(snapToggle);
workspace.appendChild(saveButton);

// Add event listeners for toggles
gridToggle.addEventListener('click', () => {
  workspace.classList.toggle('hide-grid');
  gridToggle.style.backgroundColor = workspace.classList.contains('hide-grid') ? '#888' : '#4CAF50';
});

snapToggle.addEventListener('click', () => {
  snapToGrid = !snapToGrid;
  snapToggle.style.backgroundColor = snapToGrid ? '#4CAF50' : '#888';
});

// Add mousemove listener to workspace
workspace.addEventListener('mousemove', drag);
workspace.addEventListener('mouseup', dragEnd);

// Handle drag events for toolbox items
toolbox.addEventListener('dragstart', (e) => {
  if (e.target.classList.contains('draggable')) {
    e.dataTransfer.setData('type', e.target.dataset.type);
  }
});

// Allow drop in workspace
workspace.addEventListener('dragover', (e) => {
  e.preventDefault();
});

workspace.addEventListener('drop', (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData('type');
  const x = e.clientX - workspace.getBoundingClientRect().left;
  const y = e.clientY - workspace.getBoundingClientRect().top;
  if (type) addElementToWorkspace(type, snapToGrid ? snapToGridPos(x) : x, snapToGrid ? snapToGridPos(y) : y);
});

// Function to snap position to grid
function snapToGridPos(pos) {
  return Math.round(pos / GRID_SIZE) * GRID_SIZE;
}

// Add element to workspace
function addElementToWorkspace(type, x, y) {
  const element = document.createElement('div');
  element.classList.add('element');
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  
  // Make element draggable
  element.setAttribute('draggable', 'false');
  setupDraggable(element);

  switch (type) {
    case 'text':
      element.innerHTML = `<input type="text" value="Text Box" />`;
      break;
    case 'title':
      element.innerHTML = `<input type="text" value="Title" style="font-size: 1.5em; font-weight: bold;" />`;
      break;
    case 'image':
      const container = document.createElement('div');
      const inputContainer = document.createElement('div');
      inputContainer.style.display = 'flex';
      inputContainer.style.gap = '8px';
      inputContainer.style.marginBottom = '8px';
      
      // URL input
      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.placeholder = 'Image URL';
      urlInput.style.flex = '1';
      
      // File input
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*'; // Is an image or something
      fileInput.style.display = 'none';
      
      // File upload button
      const uploadButton = document.createElement('button');
      uploadButton.textContent = 'Upload';
      uploadButton.style.padding = '4px 8px';
      uploadButton.style.backgroundColor = '#4CAF50';
      uploadButton.style.color = 'white';
      uploadButton.style.border = 'none';
      uploadButton.style.borderRadius = '4px';
      uploadButton.style.cursor = 'pointer';
      
      const img = document.createElement('img');
      img.style.display = 'none';
      img.style.maxWidth = '200px';
      img.style.maxHeight = '200px';
      
      // Handle URL input
      urlInput.addEventListener('change', () => {
        const url = urlInput.value.trim();
        if (url) {
          img.src = url;
          img.style.display = 'block';
          
          img.onerror = () => {
            img.style.display = 'none';
            alert('Failed to load image. Please check the URL.');
          };
          
          img.onload = () => {
            img.style.display = 'block';
          };
        } else {
          img.style.display = 'none';
        }
      });
      
      // Handle file upload
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            img.src = e.target.result;
            img.style.display = 'block';
            urlInput.value = ''; // Clear URL input when file is uploaded
          };
          reader.readAsDataURL(file);
        }
      });
      
      // Upload button click handler
      uploadButton.addEventListener('click', () => {
        fileInput.click();
      });
      
      // Prevent drag start when interacting with inputs
      [urlInput, uploadButton].forEach(el => {
        el.addEventListener('mousedown', (e) => {
          e.stopPropagation();
        });
      });
      
      // Assemble the components
      inputContainer.appendChild(urlInput);
      inputContainer.appendChild(uploadButton);
      container.appendChild(inputContainer);
      container.appendChild(fileInput);
      container.appendChild(img);
      element.appendChild(container);
      break;
    default:
      return;
  }

  element.addEventListener('click', () => {
    element.classList.toggle('selected');
  });
  
  workspace.appendChild(element);
}

function setupDraggable(element) {
  element.addEventListener('mousedown', dragStart);
  
  function dragStart(e) {
    if (e.target.tagName.toLowerCase() === 'input') {
      return;
    }
    
    e.preventDefault();
    isDragging = true;
    activeElement = element;
    
    // Get the current transform values or default to 0
    const style = window.getComputedStyle(element);
    const matrix = new DOMMatrix(style.transform);
    currentX = matrix.m41;
    currentY = matrix.m42;
    
    // Calculate cursor offset relative to element
    const rect = element.getBoundingClientRect();
    initialX = e.clientX - rect.left - currentX;
    initialY = e.clientY - rect.top - currentY;
    
    element.style.cursor = 'grabbing';
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
  }
}

function drag(e) {
  if (!isDragging || !activeElement) return;
  
  e.preventDefault();
  
  // Calculate new position
  let newX = e.clientX - workspace.getBoundingClientRect().left - initialX;
  let newY = e.clientY - workspace.getBoundingClientRect().top - initialY;
  
  // Snap to grid if enabled
  if (snapToGrid) {
    newX = snapToGridPos(newX);
    newY = snapToGridPos(newY);
  }
  
  // Transform element position
  activeElement.style.transform = `translate(${newX}px, ${newY}px)`;
  
  // Update current position
  currentX = newX;
  currentY = newY;
}

function dragEnd(e) {
  if (!isDragging) return;
  
  isDragging = false;
  
  if (activeElement) {
    activeElement.style.cursor = 'grab';
    
    // Convert transform to left/top for consistent positioning
    activeElement.style.left = `${currentX}px`;
    activeElement.style.top = `${currentY}px`;
    activeElement.style.transform = 'none';
    
    activeElement = null;
  }
  
  // Re-enable text selection
  document.body.style.userSelect = '';
}