// Please collapse this
const text = `
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
      // Create RiTa markov model (2, or 3, or 4)
      let markov = RiTa.markov(3);
      
      // Load the text into the model
      markov.addText(text);
      
      // Generate and display sentences
      const outputDiv = document.getElementById('output');
      for (let i = 0; i < 1; i++) {
          const sentence = markov.generate();
          const p = document.createElement('p');
          p.textContent = sentence;
          outputDiv.appendChild(p);
      };
      element.innerHTML = `<script src="randomWordThing.js" type="text" />`;
      break;

    case 'image-rand':
      element.innerHTML = `<img src="https://picsum.photos/200/?random" />`;
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
