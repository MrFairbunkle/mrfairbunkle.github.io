// Elements
const toolbox = document.querySelector('.toolbox');
const workspace = document.getElementById('workspace');

// Grid settings
const GRID_SIZE = 20;
let snapToGrid = true;

// Variables to track dragging
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let activeElement = null;

// Create grid toggle button
const gridToggle = document.createElement('button');
gridToggle.textContent = 'Toggle Grid';
gridToggle.style.position = 'absolute';
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
snapToggle.style.top = '10px';
snapToggle.style.right = '120px';
snapToggle.style.zIndex = '1000';
snapToggle.style.padding = '8px 16px';
snapToggle.style.backgroundColor = '#4CAF50';
snapToggle.style.color = 'white';
snapToggle.style.border = 'none';
snapToggle.style.borderRadius = '4px';
snapToggle.style.cursor = 'pointer';

// Add buttons to workspace
workspace.appendChild(gridToggle);
workspace.appendChild(snapToggle);

// Add event listeners for toggles
gridToggle.addEventListener('click', () => {
  workspace.classList.toggle('hide-grid');
  gridToggle.style.backgroundColor = workspace.classList.contains('hide-grid') ? '#888' : '#4CAF50';
});

snapToggle.addEventListener('click', () => {
  snapToGrid = !snapToGrid;
  snapToggle.style.backgroundColor = snapToGrid ? '#4CAF50' : '#888';
});

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
      const input = document.createElement('input');
      const img = document.createElement('img');
      
      input.type = 'text';
      input.placeholder = 'Image URL';
      img.style.display = 'none';
      img.style.maxWidth = '200px';
      img.style.maxHeight = '200px';
      
      input.addEventListener('change', () => {
        const url = input.value.trim();
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
      
      input.addEventListener('mousedown', (e) => {
        e.stopPropagation();
      });
      
      container.appendChild(input);
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
  element.addEventListener('mousemove', drag);
  element.addEventListener('mouseup', dragEnd);
  element.addEventListener('mouseleave', dragEnd);

  function dragStart(e) {
    if (e.target.tagName.toLowerCase() === 'input') {
      return;
    }
    
    isDragging = true;
    activeElement = element;
    
    const rect = element.getBoundingClientRect();
    initialX = e.clientX - rect.left;
    initialY = e.clientY - rect.top;
    
    element.style.cursor = 'grabbing';
  }

  function drag(e) {
    if (!isDragging || activeElement !== element) return;
    
    e.preventDefault();
    
    // Calculate new position
    currentX = e.clientX - workspace.getBoundingClientRect().left - initialX;
    currentY = e.clientY - workspace.getBoundingClientRect().top - initialY;
    
    // Snap to grid if enabled
    if (snapToGrid) {
      currentX = snapToGridPos(currentX);
      currentY = snapToGridPos(currentY);
    }
    
    // Update element position
    element.style.left = `${currentX}px`;
    element.style.top = `${currentY}px`;
  }

  function dragEnd(e) {
    if (activeElement !== element) return;
    
    isDragging = false;
    activeElement = null;
    element.style.cursor = 'grab';
  }
}
