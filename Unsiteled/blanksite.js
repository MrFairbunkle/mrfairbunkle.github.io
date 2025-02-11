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
gridToggle.style.position = 'absolute'; // absolfruitely
gridToggle.style.width = '120px';
gridToggle.style.top = '10px';
gridToggle.style.right = '10px';
gridToggle.style.zIndex = '1000';
gridToggle.style.padding = '8px 16px';
gridToggle.style.backgroundColor = '#4CAF50'; // Your elemental power is green. What's that? Green. Okay, so, uh, just to recap. Fire, Ice, Water, Earth, Lightning, snd... Green.
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
saveButton.style.border = 'none'; // who is none???
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
  saveButton // wow no way
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
  if (type) addElementToWorkspace(type, snapToGrid ? snapToGridPos(x) : x, snapToGrid ? snapToGridPos(y) : y); // python user's worst nightmare
});

// Function to snap position to grid
function snapToGridPos(pos) {
  return Math.round(pos / GRID_SIZE) * GRID_SIZE; // STOP SHOUTING
}

// Function for resizing corners
function addResizeHandles(element) {
  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  
  // Positioning of the stuff in the element
  element.style.position = 'absolute';
  element.style.resize = 'none';
  element.style.minWidth = '50px';
  element.style.minHeight = '50px';
  
  const input = element.querySelector('input[type="text"]');
  if (input) {
    input.style.width = '100%';
    input.style.height = '100%';
    input.style.boxSizing = 'border-box';
    input.style.resize = 'none';
    input.style.border = 'none';
    input.style.padding = '5px';
  }

  const randomTextContainer = element.querySelector('div');
  if (randomTextContainer && element.querySelector('p')) {
    randomTextContainer.style.width = '100%';
    randomTextContainer.style.height = '100%';
    randomTextContainer.style.boxSizing = 'border-box';
    randomTextContainer.style.display = 'flex';
    randomTextContainer.style.alignItems = 'center';
    
    const paragraph = randomTextContainer.querySelector('p');
    paragraph.style.width = '100%';
    paragraph.style.wordWrap = 'break-word'; // no overflow thanks
  }
  
  corners.forEach(corner => {
    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('resize-handle', `resize-${corner}`);
    
    Object.assign(resizeHandle.style, {
      position: 'absolute',
      width: '10px',
      height: '10px',
      backgroundColor: 'blue',
      zIndex: '10'
    });
    
    // Position corners
    const handlePositions = {
      'top-left': { top: '-5px', left: '-5px', cursor: 'nwse-resize' },
      'top-right': { top: '-5px', right: '-5px', cursor: 'nesw-resize' },
      'bottom-left': { bottom: '-5px', left: '-5px', cursor: 'nesw-resize' },
      'bottom-right': { bottom: '-5px', right: '-5px', cursor: 'nwse-resize' }
    };
    
    Object.assign(resizeHandle.style, handlePositions[corner]);
    
    let isResizing = false;
    let originalWidth, originalHeight, originalX, originalY, originalLeft, originalTop;
    
    resizeHandle.addEventListener('mousedown', startResize); // I thought that said mountain
    
    function startResize(e) {
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
    }
    
    function resize(e) {
      if (!isResizing) return;
      
      const deltaX = e.clientX - originalX;
      const deltaY = e.clientY - originalY;
      
      // Calculate new dimensions and position
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
      
      // Apply new dimensions
      if (newWidth !== undefined) element.style.width = `${newWidth}px`;
      if (newHeight !== undefined) element.style.height = `${newHeight}px`;
      if (newLeft !== undefined) element.style.left = `${newLeft}px`;
      if (newTop !== undefined) element.style.top = `${newTop}px`;
      
      if (input) {
        input.style.width = '100%';
        input.style.height = '100%';
      }
      
      if (randomTextContainer) {
        randomTextContainer.style.width = '100%';
        randomTextContainer.style.height = '100%';
      }
    }
    
    function stopResize() {
      isResizing = false;
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
      document.body.style.userSelect = '';
    }
    
    element.appendChild(resizeHandle);
  });
}

function addElementToWorkspace(type, x, y) {
  const element = document.createElement('div');
  element.classList.add('element');
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  
  // All the stuff for the elements
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
      fileInput.accept = 'image/*';
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
          
          img.onerror = () => { // Wait til they hear about two error, wait not that says on error. Wait til they hear about off error!!! :O
            img.style.display = 'none';
            alert('Failed to load image. Please check the URL.');
          };
          
          img.onload = () => { // Wait til they hear about two load, wait not that says on load. Wait til they hear about off load!!! :O
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

    case 'text-rand':
      const randomTextContainer = document.createElement('div');
      randomTextContainer.style.padding = '10px';
      randomTextContainer.style.border = '1px solid #ccc';
      randomTextContainer.style.borderRadius = '4px';
      randomTextContainer.style.minWidth = '200px';
      randomTextContainer.style.minHeight = '50px';
      randomTextContainer.style.backgroundColor = '#f9f9f9';
    
      // Default text for generation, leave collapsed
      const defaultText = ` 
          The sun dipped below the horizon, casting an orange glow across the sky.
          A stray cat wandered through the alley, searching for scraps of food.
          The sound of rain tapping against the window was oddly comforting.
          She flipped through the old book, its pages yellowed with age.
          The wind howled through the trees, making the branches sway wildly.
          A distant thunderclap signaled the arrival of the approaching storm.
          His footsteps echoed through the empty hallway, the silence unnerving.
          She carefully arranged the flowers in the vase, adjusting each petal.
          The coffee machine whirred to life, filling the air with a rich aroma.
          A small boat bobbed gently on the surface of the calm lake.
          He adjusted his tie in the mirror, preparing for the important meeting.
          The library was eerily silent, except for the rustling of pages.
          A single candle flickered in the darkness, casting strange shadows.
          She hesitated at the door, uncertain if she should knock or leave.
          The ancient clock in the hallway chimed loudly at midnight.
          A faint melody drifted through the air, barely audible over the wind.
          The scent of freshly baked bread filled the tiny kitchen.
          A lone crow perched on the fence, watching everything intently.
          The car engine sputtered before finally roaring to life.
          She traced patterns in the sand with the tip of her finger.
          A cool breeze carried the scent of salt from the nearby ocean.
          The marketplace bustled with people shouting and haggling over prices.
          A dog barked in the distance, breaking the stillness of the night.
          The waves crashed against the rocks, sending white foam into the air.
          He opened the old wooden chest, revealing a collection of forgotten trinkets.
          The streetlights flickered as he walked down the deserted road.
          She carefully folded the letter and slipped it into an envelope.
          A soft chuckle escaped his lips as he recalled an old memory.
          The room was filled with the soft hum of conversation and laughter.
          A butterfly landed gently on her outstretched hand.
          The spaceship hovered just above the surface, its lights blinking.
          The crisp autumn leaves crunched beneath his boots with every step.
          A single tear rolled down her cheek, but she quickly wiped it away.
          The train rumbled down the tracks, its whistle echoing through the valley.
          The neon lights of the city glowed brightly against the night sky.
          She ran her fingers along the spines of the books on the shelf.
          A mysterious figure stood at the end of the foggy street.
          The fire crackled in the fireplace, casting a warm glow in the room.
          The ice cubes clinked against the glass as he took a slow sip.
          She whispered something under her breath before turning away.
          The old wooden bridge creaked under his weight as he crossed.
          A soft drizzle began to fall, dampening the dusty pavement.
          The painting hung crookedly on the wall, its colors fading with time.
          The detective examined the footprints closely, deep in thought.
          She turned the key in the lock, holding her breath as the door creaked open.
          A sudden gust of wind scattered the papers across the table.
          The campfire crackled as sparks rose into the night sky.
          The radio played a song from decades ago, filling the room with nostalgia.
          A squirrel darted up the tree, disappearing into the dense foliage.
          She carefully stitched the fabric together, lost in concentration.
          The roller coaster clattered up the steep track, anticipation building.
          A gentle knock on the door interrupted her train of thought.
          The clouds parted, revealing a sky full of shimmering stars.
          He carefully arranged the chess pieces, planning his next move.
          The air smelled of pine and damp earth after the morning rain.
          The old bicycle leaned against the fence, its tires slightly deflated.
          A firefly flickered in the darkness, briefly illuminating the night.
          The bakery windows were fogged up from the warmth inside.
          A forgotten melody played in the back of his mind, familiar yet distant.
          She ran barefoot through the grass, feeling the earth beneath her feet.
          The moon cast long shadows across the empty parking lot.
          He shuffled the deck of cards with practiced ease.
          The canoe drifted lazily down the slow-moving river.
          A row of candles flickered on the windowsill, their light dancing.
          The mechanic wiped the grease from his hands and sighed.
          A rabbit darted across the path, disappearing into the underbrush.
          The elevator doors slid open with a soft chime.
          The wind carried the scent of fresh flowers from the garden.
          The bookstore was filled with the quiet rustling of pages being turned.
          A violin played softly in the background, adding to the atmosphere.
          The rusty gate creaked as he pushed it open.
          The soft hum of a ceiling fan filled the quiet room.
          The soccer ball rolled to a stop at the edge of the field.
          The mailman whistled as he placed the letters in the mailbox.
          A drop of water fell from the leaky faucet, echoing in the sink.
          She tied the ribbon carefully, making sure the bow was perfect.
          The mountain peaks were shrouded in mist, barely visible.
          A shooting star streaked across the night sky in a brilliant flash.
          The subway car rocked gently as it sped through the tunnels.
          The black cat watched him curiously from its perch on the windowsill.
          A distant church bell rang, signaling the end of the hour.
          The tea kettle whistled, steam curling into the air.
          The old rocking chair creaked with every gentle movement.
          He adjusted his glasses and squinted at the tiny print in the book.
          The children chased each other through the park, their laughter ringing out.
          The echo of footsteps in the empty corridor sent a chill down his spine.
          A spider dangled from a single thread of silk, swaying slightly.
          The aroma of fresh coffee was enough to wake him up completely.
          She carefully arranged the chessboard, ready for another game.
          The old train station had an air of nostalgia, frozen in time.
          A layer of frost covered the grass, shimmering in the morning light.
          The lighthouse stood tall against the crashing waves.
          She traced a heart in the fogged-up window with her finger.
          The clouds gathered ominously, promising a heavy downpour.
          A lone street performer played the violin, his melody hauntingly beautiful.
          The grandfather clock chimed, marking the passage of another hour.
          The market was alive with the chatter of vendors and customers.
          He absentmindedly drummed his fingers on the wooden table.
          The scent of lavender and vanilla lingered in the air.
          A single candle flickered in the dark, barely illuminating the room.
          The river flowed smoothly over the rocks, creating a soothing sound.
          She wrapped the scarf tightly around her neck, bracing against the cold.
          The empty swing swayed gently in the breeze, creaking softly.
          A pigeon fluttered down to peck at the crumbs on the pavement.
          `;
    
      // Create RiTa markov model, totally know how it works
      let markov = RiTa.markov(3);
      
      // Load the text into the model
      markov.addText(defaultText);
      
      // Generate sentences
      const sentence = markov.generate();
      
      // Create text element
      const randomTextElement = document.createElement('p');
      randomTextElement.textContent = sentence;
      randomTextElement.style.margin = '0';
      randomTextElement.style.fontStyle = 'italic';
    
      // Add to container
      randomTextContainer.appendChild(randomTextElement);
      
      // Add container to element
      element.appendChild(randomTextContainer);
      break;

    case 'image-rand': // Fix this, image always same random image on each load, kinda doesn't matter
      element.innerHTML = `<img src="https://picsum.photos/200/?random" />`;
      break;

    default:
      return;
  }
  
  // Make element draggable
  element.setAttribute('draggable', 'false');
  setupDraggable(element);
  
  addResizeHandles(element);
  
  element.addEventListener('click', () => {
    element.classList.toggle('selected');
  });
  
  workspace.appendChild(element);
}

// Styling for the grabby bits 
const resizeStyleSheet = document.createElement('style');
resizeStyleSheet.textContent = `
  .resize-handle {
    border: 1px solid blue;
    opacity: 0.5;
    transition: opacity 0.2s;
  }
  .resize-handle:hover {
    opacity: 1;
  }
`;
document.head.appendChild(resizeStyleSheet);

function setupDraggable(element) {
  element.style.cursor = 'grab';
  element.addEventListener('mousedown', dragStart);
  
  function dragStart(e) {
    if (
      e.target.tagName.toLowerCase() === 'input' || 
      e.target.classList.contains('resize-handle')
    ) {
      return;
    }
    
    e.preventDefault();
    isDragging = true;
    activeElement = element;
    
    // Get the element's current position
    const rect = element.getBoundingClientRect();
    const workspaceRect = workspace.getBoundingClientRect();
    
    initialX = e.clientX - rect.left;
    initialY = e.clientY - rect.top;
    
    // Store the element's current position 
    currentX = rect.left - workspaceRect.left;
    currentY = rect.top - workspaceRect.top;
    
    element.style.cursor = 'grabbing';
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
  }
}

function drag(e) {
  if (!isDragging || !activeElement) return;
  
  e.preventDefault();
  
  // Calculate new position
  const workspaceRect = workspace.getBoundingClientRect();
  let newX = e.clientX - workspaceRect.left - initialX;
  let newY = e.clientY - workspaceRect.top - initialY;
  
  // Snap to grid???
  if (snapToGrid) {
    newX = snapToGridPos(newX);
    newY = snapToGridPos(newY);
  }
  
  // Update element's position
  activeElement.style.left = `${newX}px`;
  activeElement.style.top = `${newY}px`;
  
  // Update current position
  currentX = newX;
  currentY = newY;
}

function dragEnd(e) {
  if (!isDragging) return;
  
  isDragging = false;
  
  if (activeElement) {
    activeElement.style.cursor = 'grab';
    
    activeElement = null;
  }
  
  document.body.style.userSelect = '';
}



// Separated code for all the save button stuff cos idk where to put it 

// Save the current website 
function saveWorkspace() {
  const elements = workspace.querySelectorAll('.element');
  const savedElements = [];

  elements.forEach(element => {
    // Get element dimensions
    const elementData = {
      type: '',
      left: element.style.left,
      top: element.style.top,
      width: element.style.width,
      height: element.style.height,
      content: ''
    };

    // Determine element type and save relevant content
    const input = element.querySelector('input[type="text"]');
    const img = element.querySelector('img');
    const randTextP = element.querySelector('p');
    
    if (input && input.style.fontSize === '1.5em') {
      // Title element
      elementData.type = 'title';
      elementData.content = input.value;
    } else if (input && !img) {
      // Text element
      elementData.type = 'text';
      elementData.content = input.value;
    } else if (img && img.src.includes('picsum')) {
      // Random image element
      elementData.type = 'image-rand';
      elementData.content = img.src;
    } else if (img) {
      // Regular image element
      elementData.type = 'image';
      const urlInput = element.querySelector('input[type="text"]');
      elementData.content = {
        src: img.src,
        url: urlInput ? urlInput.value : ''
      };
    } else if (randTextP) {
      // Random text element
      elementData.type = 'text-rand';
      elementData.content = randTextP.textContent;
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

// Update the load function to handle the new save format
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
        // Create element with correct position
        addElementToWorkspace(
          elementData.type,
          parseInt(elementData.left),
          parseInt(elementData.top)
        );
        
        const element = workspace.lastElementChild;
        
        // Set dimensions
        if (elementData.width) element.style.width = elementData.width;
        if (elementData.height) element.style.height = elementData.height;
        
        // Restore content based on type
        switch (elementData.type) {
          case 'image':
            const img = element.querySelector('img');
            const urlInput = element.querySelector('input[type="text"]');
            if (img && urlInput) {
              img.src = elementData.content.src;
              img.style.display = 'block';
              urlInput.value = elementData.content.url;
            }
            break;
            
          case 'image-rand':
            const randImg = element.querySelector('img');
            if (randImg) {
              randImg.src = elementData.content;
            }
            break;
            
          case 'text-rand':
            const randTextP = element.querySelector('p');
            if (randTextP) {
              randTextP.textContent = elementData.content;
            }
            break;
            
          case 'title':
          case 'text':
            const input = element.querySelector('input[type="text"]');
            if (input) {
              input.value = elementData.content;
            }
            break;
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
