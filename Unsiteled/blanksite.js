// Elements
const toolbox = document.querySelector('.toolbox');
const workspace = document.getElementById('workspace');

// Handle drag events
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
  if (type) addElementToWorkspace(type, x, y);
});

// Add element to workspace
function addElementToWorkspace(type, x, y) {
  const element = document.createElement('div');
  element.classList.add('element');
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;

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
      
      // Handle input changes
      input.addEventListener('change', () => {
        const url = input.value.trim();
        if (url) {
          img.src = url;
          img.style.display = 'block';
          
          // Handle image load errors
          img.onerror = () => {
            img.style.display = 'none';
            alert('Failed to load image. Please check the URL.');
          };
          
          // Handle successful image load
          img.onload = () => {
            img.style.display = 'block';
          };
        } else {
          img.style.display = 'none';
        }
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
