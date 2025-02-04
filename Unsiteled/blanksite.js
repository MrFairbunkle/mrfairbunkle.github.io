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

// Create buttons

const gridToggle = document.createElement('button'); // Grid toggle button
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

const snapToggle = document.createElement('button'); // Grid snap toggle button
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

const saveButton = document.createElement('button'); // Save website button
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

// Add event listeners for buttons
gridToggle.addEventListener('click', () => {
  workspace.classList.toggle('hide-grid');
  gridToggle.style.backgroundColor = workspace.classList.contains('hide-grid') ? '#888' : '#4CAF50';
});

snapToggle.addEventListener('click', () => {
  snapToGrid = !snapToGrid;
  snapToggle.style.backgroundColor = snapToGrid ? '#4CAF50' : '#888';
});

saveButton.addEventListener('click', () => {
  saveButton 
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

    case 'image': // Add resizing 
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

    case 'image-slideshow':
      break;

    case 'text-rand':
      element.innerHTML = `<input type="text" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin finibus ipsum neque, ac fermentum tortor commodo at. Sed tempus sollicitudin placerat. Nulla condimentum convallis magna, sit amet rhoncus velit. Ut in tellus ac nulla luctus convallis. Duis lacinia lobortis enim nec vehicula. Donec tempor sit amet tortor sit amet vestibulum. Vivamus ultrices tortor neque, et rhoncus libero laoreet sit amet. Aenean malesuada neque id nisl suscipit, at rutrum felis efficitur. Suspendisse non dui pretium lectus cursus eleifend sit amet quis massa. Cras a felis imperdiet massa tristique elementum in eget quam. Vivamus urna ipsum, consectetur at nulla quis, tincidunt consequat sapien. Vestibulum in sapien in neque porta iaculis. Sed nibh ipsum, ornare sit amet augue sit amet, congue euismod turpis. Donec volutpat neque vitae odio maximus consectetur." />`;
      break;

    case 'image-rand':
      element.innerHTML = `<img src="https://picsum.photos/200" />`;
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



// Separate code for all the save button stuff

// Save the current website 
function saveWorkspace() {
  const elements = workspace.querySelectorAll('.element');
  const savedElements = [];

  elements.forEach(element => {
    const elementData = {
      type: '',
      left: element.style.left,
      top: element.style.top,
      content: ''
    };

    // Determine element type and save relevant content
    const input = element.querySelector('input[type="text"]');
    const img = element.querySelector('img');

    if (input && input.style.fontSize === '1.5em') {
      elementData.type = 'title';
      elementData.content = input.value;
    } else if (input && !img) {
      elementData.type = 'text';
      elementData.content = input.value;
    } else if (img) {
      elementData.type = 'image';
      elementData.content = img.src;
    }

    savedElements.push(elementData);
  });

  // Create the save data object
  const saveData = {
    elements: savedElements,
    gridSettings: {
      snapToGrid: snapToGrid,
      gridVisible: !workspace.classList.contains('hide-grid')
    }
  };

  // Convert to JSON string
  const saveString = JSON.stringify(saveData, null, 2);

  // Create and trigger download
  const blob = new Blob([saveString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Unsiteled_Project.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Add this function to load a saved layout
function loadWorkspace(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const saveData = JSON.parse(e.target.result);
      
      // Clear existing elements
      workspace.querySelectorAll('.element').forEach(el => el.remove());
      
      // Restore grid settings
      snapToGrid = saveData.gridSettings.snapToGrid;
      snapToggle.style.backgroundColor = snapToGrid ? '#4CAF50' : '#888';
      
      if (saveData.gridSettings.gridVisible) {
        workspace.classList.remove('hide-grid');
        gridToggle.style.backgroundColor = '#4CAF50';
      } else {
        workspace.classList.add('hide-grid');
        gridToggle.style.backgroundColor = '#888';
      }
      
      // Restore elements
      saveData.elements.forEach(elementData => {
        addElementToWorkspace(
          elementData.type,
          parseInt(elementData.left),
          parseInt(elementData.top)
        );
        
        // Restore element content
        const element = workspace.lastElementChild;
        if (elementData.type === 'image') {
          const img = element.querySelector('img');
          const urlInput = element.querySelector('input[type="text"]');
          if (img && urlInput) {
            img.src = elementData.content;
            img.style.display = 'block';
            urlInput.value = elementData.content;
          }
        } else {
          const input = element.querySelector('input[type="text"]');
          if (input) {
            input.value = elementData.content;
          }
        }
      });
    } catch (error) {
      alert('Failed to load layout file. Please check the file format.');
      console.error('Load error:', error);
    }
  };
  reader.readAsText(file);
}

// Update the save button event listener
saveButton.addEventListener('click', saveWorkspace);

// Add load button
const loadButton = document.createElement('button');
loadButton.textContent = 'Load Website';
loadButton.style.position = 'absolute';
loadButton.style.width = '120px';
loadButton.style.top = '10px';
loadButton.style.right = '392px';
loadButton.style.zIndex = '1000';
loadButton.style.padding = '8px 16px';
loadButton.style.backgroundColor = '#4CAF50';
loadButton.style.color = 'white';
loadButton.style.border = 'none';
loadButton.style.borderRadius = '4px';
loadButton.style.cursor = 'pointer';

// Add file input for loading
const loadInput = document.createElement('input');
loadInput.type = 'file';
loadInput.accept = '.json';
loadInput.style.display = 'none';
loadInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    loadWorkspace(e.target.files[0]);
  }
});

// Add load button click handler
loadButton.addEventListener('click', () => {
  loadInput.click();
});

// Add load button and input to workspace
workspace.appendChild(loadButton);
workspace.appendChild(loadInput);